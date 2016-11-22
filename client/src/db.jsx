import Kinto from 'kinto';


const collections = {
    blocks: null,
    reports: null,
};


function createKintoInstance(userToken) {
    const headers = {};
    if (userToken) {
        headers.Authorization = `github+Bearer ${userToken}`;
    }

    const db = new Kinto({
        remote: `${process.env.STORAGE_ENDPOINT_URL}/v1/`,
        bucket: 'processeer',
        headers,
    });

    collections.blocks = db.collection('blocks');
    collections.reports = db.collection('reports');

    // Synchronize collections.
    collections.blocks.sync({ strategy: Kinto.syncStrategy.SERVER_WINS })
    .then((res) => {
        if (res.ok) {
            return res;
        }

        // If conflicts, take remote version and sync again.
        return Promise.all(
            res.conflicts.map(conflict => collections.blocks.resolve(conflict, conflict.remote))
        )
        .then(() => collections.blocks.sync());
    })
    .catch(console.error.bind(console));
    // DEBUG - activate this to re-synchronize a flushed server.
    // .catch((err) => {
    //     if (err.message.indexOf('flushed') >= 0) {
    //         return collections.blocks.resetSyncStatus()
    //         .then(() => collections.blocks.sync());
    //     }
    //     throw err;
    // });
    collections.reports.sync({ strategy: Kinto.syncStrategy.SERVER_WINS })
    .then((res) => {
        if (res.ok) {
            return res;
        }

        // If conflicts, take remote version and sync again.
        return Promise.all(
            res.conflicts.map(conflict => collections.reports.resolve(conflict, conflict.remote))
        )
        .then(() => collections.reports.sync());
    })
    .catch(console.error.bind(console));
    // DEBUG - activate this to re-synchronize a flushed server.
    // .catch((err) => {
    //     if (err.message.indexOf('flushed') >= 0) {
    //         return collections.reports.resetSyncStatus()
    //         .then(() => collections.reports.sync());
    //     }
    //     throw err;
    // });
}


createKintoInstance();


export default {
    collections,
    setUserToken: (token) => {
        createKintoInstance(token);
    },
};
