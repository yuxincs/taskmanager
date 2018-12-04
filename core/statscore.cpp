#include "statscore.h"

StatsCore::StatsCore(int msec)
{
    connect(&this->refreshTimer_, &QTimer::timeout, this, &StatsCore::updateProcesses);
    this->refreshTimer_.start(msec);
    this->database_ = QSqlDatabase::addDatabase("QSQLITE");
    this->database_.setDatabaseName(":memory:");
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
    this->processModel_ = new QSqlTableModel(this, this->database_);
    this->processModel_->setTable("process");
}

void StatsCore::setRefreshRate(int msec)
{
    this->refreshTimer_.setInterval(msec);
}

StatsCore::~StatsCore()
{

}

const QSqlTableModel &StatsCore::processModel()
{
    return *this->processModel_;
}

void StatsCore::updateProcesses()
{
    // update the processes based on a `ps` solution
    QProcess psProcess;
    psProcess.start("ps axo pid,%cpu,%mem,comm");
    connect(&psProcess, &QProcess::readyReadStandardOutput, [&] {
        QString psOutput = psProcess.readAllStandardOutput();
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
    });
}
