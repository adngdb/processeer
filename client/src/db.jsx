/* global Kinto */

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
        remote: 'http://localhost:8888/v1/',
        bucket: 'spectateur',
        headers,
    });

    collections.blocks = db.collection('blocks');
    collections.reports = db.collection('reports');

    if (userToken) {
        // Synchronize collections.
        collections.blocks.sync();
        collections.reports.sync();
    }
}


createKintoInstance();


export default {
    collections,
    setUserToken: (token) => {
        createKintoInstance(token);
    },
};
