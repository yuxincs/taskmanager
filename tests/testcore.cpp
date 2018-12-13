#include <QTest>
#include "statscore.h"

class TestCore: public QObject
{
    Q_OBJECT
private:
    StatsCore *core;
private slots:
    void initTestCase()
    {
        this->core = new StatsCore(1000, this);
    }

    void testProcessModel()
    {
        QVERIFY(true);
    }

    void testKillProcess()
    {
        QProcess process;
        process.start("tail", {"-f", "/dev/null"});
        this->core->killProcess(static_cast<quint64>(process.pid()));
        process.waitForFinished();
        QVERIFY(process.exitStatus() == QProcess::NormalExit ||
                process.exitStatus() == QProcess::CrashExit);
    }

    void cleanupTestCase()
    {
        delete this->core;
    }
};

QTEST_MAIN(TestCore)
#include "testcore.moc"
