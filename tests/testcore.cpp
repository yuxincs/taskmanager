#pragma once
#include <QTest>

class TestCore: public QObject
{
    Q_OBJECT
private slots:
    void testProcessModel();
};


void TestCore::testProcessModel()
{
    QVERIFY(true);
}

QTEST_MAIN(TestCore)
#include "testcore.moc"
