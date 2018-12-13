#include "statscore.h"

StatsCore::StatsCore(int msec, QObject *parent)
    :QObject(parent)
{
    // connect timer to update functions
    connect(&this->refreshTimer_, &QTimer::timeout, this, &StatsCore::updateProcesses);

    // create a in-memory sqlite database to store all information
    this->database_ = QSqlDatabase::addDatabase("QSQLITE");
    this->database_.setDatabaseName(":memory:");
    this->database_.open();
    // create process info table
    this->database_.exec("CREATE TABLE `process` (\
                         `name`	TEXT,\
                         `pid`	INTEGER UNIQUE,\
                         `cpu`	REAL,\
                         `memory`	INTEGER,\
                         `disk`	INTEGER,\
                         `network`	INTEGER,\
                         PRIMARY KEY(`pid`)\
                     );");
    // create and set a QSqlTableModel for GUI
    this->processModel_ = new QSqlTableModel(this, this->database_);
    this->processModel_->setTable("process");

    // initial update
    this->process__ = nullptr;
    this->updateProcesses();

    // start timer
    this->refreshTimer_.start(msec);
}

void StatsCore::setRefreshRate(int msec)
{
    this->refreshTimer_.setInterval(msec);
}

StatsCore::~StatsCore()
{
    // kill and delete the process object
    if(this->process__ != nullptr)
    {
        // disconnect all slots connected to finished signal,
        // otherwise QProcess::waitForFinished() won't work
        disconnect(this->process__, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
                   nullptr, nullptr);
        this->process__->kill();
        this->process__->waitForFinished();
        delete this->process__;
    }
    delete this->processModel_;
}

QSqlTableModel *StatsCore::processModel()
{
    return this->processModel_;
}

void StatsCore::updateProcesses()
{
    // update the processes based on a `ps` implementation
    if (this->process__ == nullptr)
    {
        // initialize the process object and connect to a function that updates the database
        this->process__ = new QProcess(this);
        connect(this->process__, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished), [=] {
            QString psOutput = this->process__->readAllStandardOutput();
            QStringList processList = psOutput.split('\n');
            // remove the first line (title) and last line (blank line)
            processList.removeFirst();
            processList.removeLast();

            // begin transaction
            this->database_.transaction();
            QSqlQuery query(this->database_);

            // clear process table data
            query.exec("DELETE from process;");

            for(const QString &process: processList)
            {
                quint64 pid = process.section(' ', 0, 0, QString::SectionSkipEmpty).toULongLong();
                double cpuPercent = process.section(' ', 1, 1, QString::SectionSkipEmpty).toDouble();
                double memory = process.section(' ', 2, 2, QString::SectionSkipEmpty).toDouble();
                QString name = process.section(' ', 3, -1, QString::SectionSkipEmpty);
                name = name.mid(name.lastIndexOf('/') + 1);
                query.prepare("INSERT INTO process (pid, name, cpu, memory, disk, network)"
                              "VALUES (:pid, :name, :cpu, :memory, :disk, :network)");
                query.bindValue(":pid", pid);
                query.bindValue(":name", name);
                query.bindValue(":cpu", cpuPercent);
                query.bindValue(":memory", memory);
                query.bindValue(":disk", 0);
                query.bindValue(":network", 0);
                query.exec();
            }
            this->database_.commit();
            qDebug() << "Updated " << processList.size() << "processes.";
            this->processModel_->select();
        });
    }
    // if the last update is still running
    if (this->process__->state() == QProcess::Running)
        return;
    // else start updating
    else
        this->process__->start("ps axo pid,%cpu,rss,comm");
}

void StatsCore::killProcess(quint64 pid)
{
    // a command based implementation
    QProcess *process = new QProcess(this);
    process->start("kill", {"-s", "KILL", QString::number(pid)});
    connect(process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            process, &QObject::deleteLater);
    qDebug() << "Killed " << pid;
}
