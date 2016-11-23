import Kinto from 'kinto';


const collections = {
    blocks: null,
    reports: null,
};


function syncCollection(collection) {
    return collection.sync({ strategy: Kinto.syncStrategy.SERVER_WINS })
    .then((res) => {
        if (res.ok) {
            return res;
        }

        // If conflicts, take remote version and sync again.
        return Promise.all(
            res.conflicts.map(conflict => collection.resolve(conflict, conflict.remote))
        )
        .then(() => collection.sync());
    })
    .catch(console.error.bind(console));
    // DEBUG - activate this to re-synchronize a flushed server.
    // .catch((err) => {
    //     if (err.message.indexOf('flushed') >= 0) {
    //         return collection.resetSyncStatus()
    //         .then(() => collection.sync());
    //     }
    //     throw err;
    // });
}


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

    return syncCollection(collections.blocks)
    .then(() => syncCollection(collections.reports));
}


createKintoInstance();


export default {
    collections,
    sync: syncCollection,
    setUserToken: createKintoInstance,
};
