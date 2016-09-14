let db = new Kinto({
    remote: "http://localhost:8888/v1/",
    headers: {Authorization: "Basic " + btoa("user:pass")}
});

export let db_views = db.collection("views");
export let db_reports = db.collection("reports");

db_views.sync()
.catch(err => {
    if (err.message.contains("flushed")) {
        return db_views.resetSyncStatus()
        .then(_ => db_views.sync());
    }
    throw err;
});
db_views.list().then(console.log.bind(console));

db_reports.sync()
.catch(err => {
    if (err.message.contains("flushed")) {
        return db_reports.resetSyncStatus()
        .then(_ => db_reports.sync());
    }
    throw err;
});
db_reports.list().then(console.log.bind(console));
