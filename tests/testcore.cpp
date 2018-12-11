#include <QTest>

class TestCore: public QObject
{
    Q_OBJECT
private slots:
    void testProcessModel()
    {
        QVERIFY(true);
    }
};

QTEST_MAIN(TestCore)
#include "testcore.moc"
