/* global jailed */

import qs from 'qs';

import history from './history.jsx';
import { dbReports } from './db.jsx';


// ----------------------------------------------------------------------------
export const RECEIVE_REPORT_META = 'RECEIVE_REPORT_META';
function receiveReportMeta(id, report) {
    return {
        type: RECEIVE_REPORT_META,
        id,
        report,
    };
}

export const FETCHING_REPORT_META = 'FETCHING_REPORT_META';
function requestReport(id) {
    return {
        type: FETCHING_REPORT_META,
        id,
    };
}

export function fetchReport(id) {
    return (dispatch) => {
        dispatch(requestReport(id));
        return dbReports.get(id)
        .then((data) => {
            const report = Object.assign({}, data);
            if (!report.data.params) {
                report.data.params = [];
            }
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
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_REPORTS = 'REQUEST_REPORTS';
function requestReports() {
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
    return (dispatch) => {
        dispatch(requestReports());

        dbReports.list()
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
        modelIndex: parseInt(modelIndex, 10),
        endpoint,
        params,
    };
}

export const UPDATE_REPORT_PARAM = 'UPDATE_REPORT_PARAM';
export function updateReportParam(id, paramIndex, param) {
    return {
        type: UPDATE_REPORT_PARAM,
        id,
        paramIndex,
        param,
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
    return (dispatch) => {
        dispatch(requestCreateReport());

        dbReports.create(report)
        .then((res) => {
            dispatch(receiveReportCreated(res.data));
            dispatch(clearNewReportData());
            history.push(`/edit/report/${res.data.id}`);
            return res.data;
        })
        .catch(console.log.bind(console));
    };
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
    return (dispatch) => {
        dispatch(requestSaveReport(id));

        dbReports.get(id)
        .then((data) => {
            const newReport = Object.assign({}, data.data);
            newReport.params = report.params;
            newReport.models = report.models;
            newReport.controller = report.controller;
            newReport.name = report.name;
            newReport.slug = report.slug;

            dbReports.update(newReport)
            .then((res) => {
                dbReports.sync()
                .catch(console.log.bind(console));
                return res;
            })
            .then(() => dispatch(receiveReportSaved(id)))
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
    return (dispatch) => {
        dispatch(requestDeleteReport(id));

        dbReports.delete(id)
        .then(() => {
            dbReports.sync()
            .then(() => dispatch(receiveReportDeleted(id)))
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
/**
 * Return an object containing the report and its parameters filled with the
 * values passed as input.
 */
function prepareInput(report, input) {
    const newInput = {};

    report.params.forEach((param) => {
        newInput[param.name] = input[param.name] || param.defaultValue;
    });

    return { report, input: newInput };
}

/**
 * Return an object containing the report, its parameters and the results of
 * fetching the models of that report.
 */
function fetchModels(args) {
    const input = args.input;
    const report = args.report;

    let count = 0;
    const total = report.models.length;
    const results = [];

    return new Promise((resolve) => {
        function finished() {
            count += 1;
            if (count >= total) {
                resolve({
                    report,
                    params: input,
                    models: results,
                });
            }
        }

        // Call finished() right away to account for the case where
        // there are no models to fetch.
        finished();

        report.models.forEach((model) => {
            let url = model.endpoint;
            const params = [];

            if (input) {
                const templateRegex = /\{\{([^}]+)\}\}/;

                // First replace templates in the URLs themselves.
                let matchURL = templateRegex.exec(url);
                while (matchURL) {
                    const key = matchURL[1];
                    const paramName = key.trim();
                    const value = input[paramName] || '';

                    url = url.replace(`{{${key}}}`, value);

                    matchURL = templateRegex.exec(url);
                }

                // Then replace templates in the URL parameters.
                model.params.forEach((param) => {
                    const newParam = Object.assign({}, param);
                    const match = templateRegex.exec(param.value);
                    if (match) {
                        const key = match[1];
                        const value = input[key.trim()];

                        // Replace the template with the actual value from params.
                        if (Array.isArray(value)) {
                            newParam.value = value;
                        }
                        else if (value) {
                            newParam.value = param.value.replace(`{{${key}}}`, value);
                        }
                    }
                    params.push(newParam);
                });
            }

            const urlParams = {};
            params.forEach((param) => {
                if (!urlParams[param.key]) {
                    urlParams[param.key] = [];
                }
                urlParams[param.key].push(param.value);
            });

            const queryString = qs.stringify(urlParams, { indices: false });
            url = `${url}?${queryString}`;

            fetch(url)
            .then(response => response.json())
            .then((data) => {
                results.push(data);
                finished();
            });
        });
    });
}

function runController(args) {
    const report = args.report;
    const params = args.params;
    const models = args.models;

    const modelsData = {
        params,
        models,
    };

    return new Promise((resolve) => {
        let controller = report.controller;
        controller += ';application.setInterface({execute: (data, cb) => cb(transform(data))});';
        const plugin = new jailed.DynamicPlugin(controller);
        plugin.whenConnected(() => {
            plugin.remote.execute(modelsData, (output) => {
                resolve(output);
            });
        });
    });
}

/**
 * Return the output of a report.
 *
 * Fetches the report metadata, prepare its parameters based on the input,
 * fetches the models and then run the controller and return its output.
 */
export function runReport(args) {
    const id = args.id;
    const input = args.input;

    return dispatch => dispatch(fetchReport(id))
        .then(report => prepareInput(report, input))
        .then(fetchModels)
        .then(runController)
        .catch(console.log.bind(console));
}
