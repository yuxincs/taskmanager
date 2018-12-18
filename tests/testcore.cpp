#include <QTest>
#include <QAbstractItemModel>
#include <QProcess>
#include <QDebug>
#include <QTimer>
#include <QSignalSpy>
#include "statscore.h"

class TestCore: public QObject
{
    Q_OBJECT
private:
    StatsCore *core;
private slots:
    void initTestCase()
    {
        this->core = StatsCore::createCore(1000, this);
    }

    void testProcessModel()
    {
        QAbstractItemModel *model = this->core->processModel();
        QVERIFY(model != nullptr);
        // wait until the model is updated for the first time
        QSignalSpy spy(model, &QAbstractTableModel::modelReset);
        QVERIFY(spy.wait(1500));
        QVERIFY(model->index(0, 0).isValid());
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
