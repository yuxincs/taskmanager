#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"
#include <QFile>
#include <QDebug>
#include <QStringListModel>
#include <QRegularExpression>
#include <QTime>
#include <QProcess>

LinuxStatsCore::LinuxStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{
    this->process = new QProcess();
    this->regexp = new QRegularExpression("%Cpu\\(s\\):\\s+([0-9]+\\.[0-9]+) us,\\s+([0-9]+\\.[0-9]+) sy");
    connect(this->process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            [=] {
        qDebug() << this->process->readAllStandardOutput().mid(0, 500).simplified();
        QRegularExpressionMatch match = this->regexp->match(this->process->readAllStandardOutput().mid(0, 500).simplified());
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Utilization),
                                    QString::number(match.captured(1).toDouble() + match.captured(2).toDouble(), 'f', 2));
    });
}

LinuxStatsCore::~LinuxStatsCore()
{
    disconnect(this->process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            nullptr, nullptr);
    this->process->kill();
    this->process->waitForFinished();
    delete this->process;
    delete this->regexp;
}

void LinuxStatsCore::updateProcesses()
{
    return GenericStatsCore::updateProcesses();
}

void LinuxStatsCore::gatherStaticInformation()
{
    qDebug() << "Gathering linux static information";
    // get total memory
    QFile meminfo("/proc/meminfo");
    QRegularExpression rx;
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemTotal:\\s+([0-9]+) kB");
        this->staticSystemInfo_[StatsCore::StaticSystemField::TotalMemory] = QString::number(rx.match(content).captured(1).toLongLong() * 1024);
    }
    return;
}

void LinuxStatsCore::updateSystemInfo()
{
    qDebug() << "Linux update system information";
    // update utilization
    this->process->start("top", {"-n", "1", "-b"});

    // update temperature
    QFile inputFile("/sys/class/hwmon/hwmon0/temp1_input");
    if(inputFile.open(QIODevice::ReadOnly))
    {
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Temperature), QString::number(QString(inputFile.readAll()).toInt() / 1000.0, 'f', 1));
        inputFile.close();
    }

    // update memory information
    QRegularExpression rx;
    QFile meminfo("/proc/meminfo");
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemAvailable:\\s+([0-9]+) kB\n");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::AvailableMemory), rx.match(content).captured(1).toULongLong() * 1024);

        rx.setPattern("Buffers:\\s+([0-9]+) kB\n");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::CachedMemory), rx.match(content).captured(1).toULongLong() * 1024);
        meminfo.close();
    }

    QFile cpuinfo("/proc/cpuinfo");
    if(cpuinfo.open(QIODevice::ReadOnly))
    {
        QString content(cpuinfo.readAll());
        rx.setPattern("cpu MHz\\s+:\\s+([0-9]+\\.[0-9]+)");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::CPUSpeed),  QString::number(rx.match(content).captured(1).toDouble() / 1024, 'f', 1) + " GHz");
        cpuinfo.close();
    }

    // update up time
    QFile uptime("/proc/uptime");
    if(uptime.open(QIODevice::ReadOnly))
    {
        QStringList uptimeContent = QString(uptime.readAll()).split(" ");
        double seconds = uptimeContent.at(0).toDouble();
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UpTime), QTime::fromMSecsSinceStartOfDay(static_cast<int>(seconds * 1000)).toString());
        uptime.close();
    }

    // update process number
    QFile stat("/proc/stat");
    if(stat.open(QIODevice::ReadOnly))
    {
        QString content(stat.readAll());
        rx.setPattern("processes ([0-9]+)");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Processes), rx.match(content).captured(1));
        stat.close();
    }
    return;
}

#endif
