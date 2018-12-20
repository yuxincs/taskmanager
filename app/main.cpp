#include "mainwindow.h"


void myMessageOutput(QtMsgType type, const QMessageLogContext &context, const QString &msg)
{
    QByteArray localMsg = msg.toLocal8Bit();
    switch (type) {
    case QtDebugMsg:
        fprintf(stderr, "[Debug]: %s [%s]\n", localMsg.constData(), context.function);
        break;
    case QtInfoMsg:
        fprintf(stderr, "[Info]: %s [%s]\n", localMsg.constData(), context.function);
        break;
    case QtWarningMsg:
        fprintf(stderr, "[Warning]: %s [%s]\n", localMsg.constData(),context.function);
        break;
    case QtCriticalMsg:
        fprintf(stderr, "[Critical]: %s [%s]\n", localMsg.constData(), context.function);
        break;
    case QtFatalMsg:
        fprintf(stderr, "[Fatal]: %s [%s]\n", localMsg.constData(), context.function);
        break;
    }
}

int main(int argc, char *argv[])
{
    qInstallMessageHandler(myMessageOutput);
    QApplication a(argc, argv);
    MainWindow w;
    w.show();
    return a.exec();
}
