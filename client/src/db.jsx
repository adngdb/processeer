/* global STORAGE_ENDPOINT_URL */

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
        remote: `${STORAGE_ENDPOINT_URL}/v1/`,
        bucket: 'spectateur',
        headers,
    });

    collections.blocks = db.collection('blocks');
    collections.reports = db.collection('reports');

    // Synchronize collections.
    collections.blocks.sync()
    .catch((err) => {
        if (err.message.indexOf('flushed') >= 0) {
            return collections.blocks.resetSyncStatus()
            .then(() => collections.blocks.sync());
        }
        throw err;
    });
    collections.reports.sync()
    .catch((err) => {
        if (err.message.indexOf('flushed') >= 0) {
            return collections.reports.resetSyncStatus()
            .then(() => collections.reports.sync());
        }
        throw err;
    });
}


createKintoInstance();


export default {
    collections,
    setUserToken: (token) => {
        createKintoInstance(token);
    },
};
