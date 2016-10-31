/* global Kinto */

const db = new Kinto({
    remote: 'http://localhost:8888/v1/',
    headers: {
        Authorization: `Basic ${btoa('user:pass')}`,
    },
});

export const dbViews = db.collection('views');
export const dbReports = db.collection('reports');

dbViews.sync()
.catch((err) => {
    if (err.message.indexOf('flushed') > -1) {
        return dbViews.resetSyncStatus()
        .then(dbViews.sync.bind(dbViews));
    }
    throw err;
});
dbViews.list().then(console.log.bind(console));

dbReports.sync()
.catch((err) => {
    if (err.message.indexOf('flushed') > -1) {
        return dbReports.resetSyncStatus()
        .then(dbReports.sync.bind(dbReports));
    }
    throw err;
});
dbReports.list().then(console.log.bind(console));
