import history from '../history.jsx';
import db from './../db.jsx';
import { runBlock } from '../actions/blocks.jsx';


const dbReports = () => db.collections.reports;


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

        dbReports().listRecords()
        .then(reports => dispatch(receiveReports(reports.data)))
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_REPORT_META = 'REQUEST_REPORT_META';
function requestReportMeta(id) {
    return {
        type: REQUEST_REPORT_META,
        id,
    };
}

export const REQUEST_RUNNING_REPORT = 'REQUEST_RUNNING_REPORT';
function requestRunningReport(id) {
    return {
        type: REQUEST_RUNNING_REPORT,
        id,
    };
}

export const RECEIVE_REPORT_META = 'RECEIVE_REPORT_META';
function receiveReportMeta(id, report) {
    return {
        type: RECEIVE_REPORT_META,
        id,
        blocks: report.blocks,
        name: report.name,
    };
}

export function fetchReport(id) {
    return (dispatch) => {
        dispatch(requestReportMeta(id));

        dbReports().getRecord(id)
        .then((report) => {
            dispatch(receiveReportMeta(
                id,
                report.data
            ));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const RECEIVE_REPORT_CONTENT = 'RECEIVE_REPORT_CONTENT';
function receiveReportContent(id, content, title) {
    return {
        type: RECEIVE_REPORT_CONTENT,
        id,
        content,
        title,
    };
}

export const REMOVE_REPORT_CONTENT = 'REMOVE_REPORT_CONTENT';
export function removeReportContent(id) {
    return {
        type: REMOVE_REPORT_CONTENT,
        id,
    };
}

export const UPDATE_REPORT = 'UPDATE_REPORT';
export function updateReport(id, report) {
    return {
        type: UPDATE_REPORT,
        id,
        report,
    };
}

// ----------------------------------------------------------------------------
function runBlocks(reportId, blocks, input) {
    return (dispatch) => {
        let promise = Promise.resolve(input || {});

        blocks.forEach((blockId) => {
            promise = promise.then(outputOfPreviousBlock =>
                 dispatch(runBlock({
                     id: blockId,
                     input: outputOfPreviousBlock,
                 }))
            );
        });

        promise.then((content) => {
            dispatch(receiveReportContent(reportId, content, content.title));
        })
        .catch(console.log.bind(console));
    };
}

export function runReport(report) {
    return (dispatch) => {
        dispatch(requestRunningReport(report.id));
        dispatch(runBlocks(report.id, report.blocks, report.input));
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

export function createReport(blocks, name) {
    return (dispatch) => {
        dispatch(requestCreateReport());

        const report = {
            blocks,
            name,
        };

        dbReports().createRecord(report)
        .then((res) => {
            dispatch(receiveReportCreated(res.data));
            dispatch(clearNewReportData());
            history.push(`/edit/report/${res.data.id}`);
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
function receiveReportSaved(report) {
    return {
        type: RECEIVE_SAVED_REPORT,
        id: report.id,
    };
}

export function saveReport(id, blocks, name) {
    return (dispatch) => {
        dispatch(requestSaveReport(id));

        dbReports().getRecord(id)
        .then((res) => {
            const report = Object.assign({}, res.data, {
                blocks,
                name,
            });

            dbReports().updateRecord(report)
            .then(receiveReportSaved)
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

        dbReports().deleteRecord(id)
        .then(() => dispatch(receiveReportDeleted(id)))
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const UPDATE_REPORT_INPUT = 'UPDATE_REPORT_INPUT';
export function updateReportInput(id, input) {
    return {
        type: UPDATE_REPORT_INPUT,
        id,
        input,
    };
}
