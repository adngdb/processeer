import KintoClient from 'kinto-http';


const collections = {
    blocks: null,
    reports: null,
};


function createKintoInstance(userToken) {
    return Promise.resolve().then(() => {
        const headers = {};
        if (userToken) {
            headers.Authorization = `github+Bearer ${userToken}`;
        }

        const db = new KintoClient(
            `${process.env.STORAGE_ENDPOINT_URL}/v1`,
            { headers }
        );
        const bucket = db.bucket('processeer');

        collections.blocks = bucket.collection('blocks');
        collections.reports = bucket.collection('reports');
    });
}


createKintoInstance();


export default {
    collections,
    setUserToken: createKintoInstance,
};
