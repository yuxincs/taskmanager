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
                         `pid`	INTEGER UNIQUE,\
                         `name`	TEXT,\
                         `cpu`	REAL,\
                         `memory`	REAL,\
                         `disk`	TEXT,\
                         `network`	TEXT,\
                         PRIMARY KEY(`pid`)\
                     );");
    // create and set a QSqlTableModel for GUI
    this->processModel_ = new QSqlTableModel(this, this->database_);
    this->processModel_->setTable("process");

    // initial update
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

}

QSqlTableModel *StatsCore::processModel()
{
    return this->processModel_;
}

void StatsCore::updateProcesses()
{
    // update the processes based on a `ps` implementation
    QProcess *psProcess = new QProcess();
    psProcess->start("ps axo pid,%cpu,%mem,comm");
    connect(psProcess, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            [=] {
        QString psOutput = psProcess->readAllStandardOutput();
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
            double memPercent = process.section(' ', 2, 2, QString::SectionSkipEmpty).toDouble();
            QString name = process.section(' ', 3, -1, QString::SectionSkipEmpty);
            name = name.mid(name.lastIndexOf('/') + 1);
            query.prepare("INSERT INTO process (pid, name, cpu, memory, disk, network)"
                          "VALUES (:pid, :name, :cpu, :memory, :disk, :network)");
            query.bindValue(":pid", pid);
            query.bindValue(":name", name);
            query.bindValue(":cpu", cpuPercent);
            query.bindValue(":memory", memPercent);
            query.bindValue(":disk", "0.0 MB/s");
            query.bindValue(":network", "0.0 MB/s");
            query.exec();
        }
        this->database_.commit();
        qDebug() << "Updated " << processList.size() << "processes.";
        this->processModel_->select();
        psProcess->deleteLater();
    });
}

void StatsCore::killProcess(quint64 pid)
{
    // a command based implementation
    QProcess *process = new QProcess(this);
    process->start("kill", {"-s", "9", QString::number(pid)});
    connect(process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            process, &QObject::deleteLater);
    qDebug() << "Killed " << pid;
}
