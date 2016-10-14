import qs from 'qs';

import history from './history.jsx';
import { db_reports } from './db.jsx';


// ----------------------------------------------------------------------------
export const RECEIVE_REPORT_META = 'RECEIVE_REPORT_META';
function receiveReportMeta(id, report) {
    return {
        type: RECEIVE_REPORT_META,
        id,
        report,
    };
}

export function fetchReport(id) {
    return dispatch => {
        return db_reports.get(id)
        .then((report) => {
            if (!report.data.models) {
                report.data.models = [];
            }
            if (!report.data.controller) {
                report.data.controller = '';
            }
            dispatch(receiveReportMeta(
                id,
                report.data
            ));
            return report.data;
        })
        .catch(console.log.bind(console));
    }
}

// ----------------------------------------------------------------------------
export const REQUEST_REPORTS = 'REQUEST_REPORTS';
function requestReports(reports) {
    return {
        type: REQUEST_REPORTS,
    };
}

export const RECEIVE_REPORTS = 'RECEIVE_REPORTS';
function receiveReports(reports) {
    return {
        type: RECEIVE_REPORTS,
        reports,
    };
}

export function fetchReports() {
    return dispatch => {
        dispatch(requestReports());

        db_reports.list()
        .then(reports => dispatch(receiveReports(reports.data)))
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const UPDATE_REPORT = 'UPDATE_REPORT';
export function updateReport(id, report) {
    return {
        type: UPDATE_REPORT,
        id,
        report,
    };
}

export const UPDATE_REPORT_CONTROLLER = 'UPDATE_REPORT_CONTROLLER';
export function updateReportController(id, controller) {
    return {
        type: UPDATE_REPORT_CONTROLLER,
        id,
        controller,
    };
}

export const UPDATE_REPORT_MODEL = 'UPDATE_REPORT_MODEL';
export function updateReportModel(id, modelIndex, endpoint, params) {
    return {
        type: UPDATE_REPORT_MODEL,
        id,
        modelIndex: parseInt(modelIndex),
        endpoint,
        params,
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_CREATE_REPORT = 'REQUEST_CREATE_REPORT';
function requestCreateReport() {
    return {
        type: REQUEST_CREATE_REPORT,
    };
}

export const RECEIVE_CREATED_REPORT = 'RECEIVE_CREATED_REPORT';
function receiveReportCreated(report) {
    return {
        type: RECEIVE_CREATED_REPORT,
        id: report.id,
    };
}

export const CLEAR_NEW_REPORT_DATA = 'CLEAR_NEW_REPORT_DATA';
function clearNewReportData() {
    return {
        type: CLEAR_NEW_REPORT_DATA,
        id: '_new',
    };
}

export function createReport(report) {
    return dispatch => {
        dispatch(requestCreateReport());

        db_reports.create(report)
        .then(res => {
            dispatch(receiveReportCreated(res.data));
            dispatch(clearNewReportData());
            history.push('/edit/report/' + res.data.id);
            return res.data;
        })
        .catch(console.log.bind(console));
    }
}

// ----------------------------------------------------------------------------
export const REQUEST_SAVE_REPORT = 'REQUEST_SAVE_REPORT';
function requestSaveReport(id) {
    return {
        type: REQUEST_SAVE_REPORT,
        id,
    };
}

export const RECEIVE_SAVED_REPORT = 'RECEIVE_SAVED_REPORT';
function receiveReportSaved(id) {
    return {
        type: RECEIVE_SAVED_REPORT,
        id,
    };
}

export function saveReport(id, report) {
    return dispatch => {
        dispatch(requestSaveReport(id));

        db_reports.get(id)
        .then((obj) => {
            console.log('saving report ' + id);
            obj.data.models = report.models;
            obj.data.controller = report.controller;
            obj.data.name = report.name;
            obj.data.slug = report.slug;

            db_reports.update(obj.data)
            .then(res => {
                db_reports.sync()
                .catch(console.log.bind(console));

                db_reports.list().then(console.log.bind(console));
                console.log(res);
                return res;
            })
            .then(report => dispatch(receiveReportSaved(id)))
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_DELETE_REPORT = 'REQUEST_DELETE_REPORT';
function requestDeleteReport(id) {
    return {
        type: REQUEST_DELETE_REPORT,
        id,
    };
}

export const RECEIVE_REPORT_DELETED = 'RECEIVE_REPORT_DELETED';
function receiveReportDeleted(id) {
    return {
        type: RECEIVE_REPORT_DELETED,
        id,
    };
}

export function deleteReport(id) {
    return dispatch => {
        dispatch(requestDeleteReport(id));

        db_reports.delete(id)
        .then(() => {
            db_reports.sync()
            .then(() => dispatch(receiveReportDeleted(id)))
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export function runReport(args) {
    let id = args.id;
    let input = args.input;

    return dispatch => {
        return dispatch(fetchReport(id))
        .then(report => fetchModels({params: input, report}))
        .then(runController)
        .catch(console.log.bind(console));
    }
}

function fetchModels(args) {
    let params = args.params;
    let report = args.report;

    let count = 0;
    let total = report.models.length;
    let results = [];

    return new Promise((resolve, reject) => {
        function finished() {
            count++;
            if (count >= total) {
                resolve({
                    report,
                    params,
                    models: results,
                });
            }
        }

        report.models.forEach(model => {
            let url = model.endpoint;

            if (params) {
                let templateRegex = /\{\{([^}]+)\}\}/;

                // First replace templates in the URLs themselves.
                let matchURL = templateRegex.exec(model.endpoint);
                while (matchURL) {
                    let key = matchURL[1];
                    let paramName = key.trim();
                    let value = params[paramName] || '';

                    model.endpoint.replace(`{{${key}}}`, value);

                    matchURL = templateRegex.exec(model.endpoint);
                }

                // Then replace templates in the URL parameters.
                model.params.forEach(param => {
                    let match = templateRegex.exec(param.value);
                    if (match) {
                        let key = match[1];
                        let value = params[key.trim()];
                        console.log(value);

                        // Replace the template with the actual value from params.
                        if (Array.isArray(value)) {
                            param.value = value;
                        }
                        else if (value) {
                            param.value.replace(`{{${key}}}`, value);
                        }
                    }
                });
            }

            let urlParams = {};
            model.params.forEach(param => {
                if (!urlParams[param.key]) {
                    urlParams[param.key] = [];
                }
                urlParams[param.key].push(param.value);
            });

            url = url + '?' + qs.stringify(urlParams, {indices: false});

            fetch(url)
            .then(response => response.json())
            .then(data => {
                results.push(data);
                finished();
            });
        });
    });
}

function runController(args) {
    let report = args.report;
    let params = args.params;
    let models = args.models;

    let modelsData = {
        params,
        models,
    };

    return new Promise((resolve, reject) => {
        let controller = report.controller;
        controller += ';application.setInterface({execute: (data, cb) => cb(transform(data))})';
        let plugin = new jailed.DynamicPlugin(controller);
        console.log('starting jailed');
        plugin.whenConnected(() => {
            console.log('plugin connected');
            plugin.remote.execute(modelsData, output => {
                resolve(output);
                console.log('controller resolved');
            });
        });
    });
}
