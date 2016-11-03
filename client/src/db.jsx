/* global Kinto */

const db = new Kinto({
    remote: 'http://localhost:8888/v1/',
    bucket: 'spectateur',
    headers: {
        Authorization: `Basic ${btoa('user:pass')}`,
    },
});

export const dbReports = db.collection('reports');
export const dbBlocks = db.collection('blocks');

dbReports.sync()
.catch((err) => {
    // Use this code to synchronize the server with what the client has. Note
    // this is dangerous and will erase the server! Quite useful for local
    // development but might be removed later.
    // if (err.message.indexOf('flushed') > -1) {
    //     return dbReports.resetSyncStatus()
    //     .then(dbReports.sync.bind(dbReports));
    // }
    throw err;
});
dbReports.list().then(console.log.bind(console));

dbBlocks.sync()
.catch((err) => {
    // if (err.message.indexOf('flushed') > -1) {
    //     return dbBlocks.resetSyncStatus()
    //     .then(dbBlocks.sync.bind(dbBlocks));
    // }
    throw err;
});
dbBlocks.list().then(console.log.bind(console));
