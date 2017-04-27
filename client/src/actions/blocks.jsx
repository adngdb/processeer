/* global jailed */

import qs from 'qs';

import history from '../history.jsx';
import db from '../db.jsx';


const dbBlocks = () => db.collections.blocks;


// ----------------------------------------------------------------------------
export const RECEIVE_BLOCK_META = 'RECEIVE_BLOCK_META';
function receiveBlockMeta(id, block) {
    return {
        type: RECEIVE_BLOCK_META,
        id,
        block,
    };
}

export const FETCHING_BLOCK_META = 'FETCHING_BLOCK_META';
function requestBlock(id) {
    return {
        type: FETCHING_BLOCK_META,
        id,
    };
}

export function fetchBlock(id) {
    return (dispatch) => {
        dispatch(requestBlock(id));
        return dbBlocks().getRecord(id)
        .then((data) => {
            const block = Object.assign({}, data);
            if (!block.data.params) {
                block.data.params = [];
            }
            if (!block.data.models) {
                block.data.models = [];
            }
            if (!block.data.controller) {
                block.data.controller = '';
            }
            dispatch(receiveBlockMeta(
                id,
                block.data
            ));
            return block.data;
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_BLOCKS = 'REQUEST_BLOCKS';
function requestBlocks() {
    return {
        type: REQUEST_BLOCKS,
    };
}

export const RECEIVE_BLOCKS = 'RECEIVE_BLOCKS';
function receiveBlocks(blocks) {
    return {
        type: RECEIVE_BLOCKS,
        blocks,
    };
}

export function fetchBlocks() {
    return (dispatch) => {
        dispatch(requestBlocks());

        dbBlocks().listRecords()
        .then(blocks => dispatch(receiveBlocks(blocks.data)))
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const UPDATE_BLOCK = 'UPDATE_BLOCK';
export function updateBlock(id, block) {
    return {
        type: UPDATE_BLOCK,
        id,
        block,
    };
}

export const UPDATE_BLOCK_CONTROLLER = 'UPDATE_BLOCK_CONTROLLER';
export function updateBlockController(id, controller) {
    return {
        type: UPDATE_BLOCK_CONTROLLER,
        id,
        controller,
    };
}

export const UPDATE_BLOCK_MODEL = 'UPDATE_BLOCK_MODEL';
export function updateBlockModel(id, modelIndex, endpoint, params) {
    return {
        type: UPDATE_BLOCK_MODEL,
        id,
        modelIndex: parseInt(modelIndex, 10),
        endpoint,
        params,
    };
}

export const UPDATE_BLOCK_PARAM = 'UPDATE_BLOCK_PARAM';
export function updateBlockParam(id, paramIndex, param) {
    return {
        type: UPDATE_BLOCK_PARAM,
        id,
        paramIndex,
        param,
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_CREATE_BLOCK = 'REQUEST_CREATE_BLOCK';
function requestCreateBlock() {
    return {
        type: REQUEST_CREATE_BLOCK,
    };
}

export const RECEIVE_CREATED_BLOCK = 'RECEIVE_CREATED_BLOCK';
function receiveBlockCreated(block) {
    return {
        type: RECEIVE_CREATED_BLOCK,
        id: block.id,
    };
}

export const CLEAR_NEW_BLOCK_DATA = 'CLEAR_NEW_BLOCK_DATA';
function clearNewBlockData() {
    return {
        type: CLEAR_NEW_BLOCK_DATA,
        id: '_new',
    };
}

export function createBlock(block) {
    return (dispatch) => {
        dispatch(requestCreateBlock());

        const record = Object.assign({}, block);
        delete record.id;

        dbBlocks().createRecord(record)
        .then((res) => {
            dispatch(receiveBlockCreated(res.data));
            dispatch(clearNewBlockData());
            history.push(`/edit/block/${res.data.id}`);
            return res.data;
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_SAVE_BLOCK = 'REQUEST_SAVE_BLOCK';
function requestSaveBlock(id) {
    return {
        type: REQUEST_SAVE_BLOCK,
        id,
    };
}

export const RECEIVE_SAVED_BLOCK = 'RECEIVE_SAVED_BLOCK';
function receiveBlockSaved(id) {
    return {
        type: RECEIVE_SAVED_BLOCK,
        id,
    };
}

export function saveBlock(id, block) {
    return (dispatch) => {
        dispatch(requestSaveBlock(id));

        dbBlocks().getRecord(id)
        .then((data) => {
            const newBlock = Object.assign({}, data.data);
            newBlock.params = block.params;
            newBlock.models = block.models;
            newBlock.controller = block.controller;
            newBlock.name = block.name;

            dbBlocks().updateRecord(newBlock)
            .then(() => dispatch(receiveBlockSaved(id)))
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_DELETE_BLOCK = 'REQUEST_DELETE_BLOCK';
function requestDeleteBlock(id) {
    return {
        type: REQUEST_DELETE_BLOCK,
        id,
    };
}

export const RECEIVE_BLOCK_DELETED = 'RECEIVE_BLOCK_DELETED';
function receiveBlockDeleted(id) {
    return {
        type: RECEIVE_BLOCK_DELETED,
        id,
    };
}

export function deleteBlock(id) {
    return (dispatch) => {
        dispatch(requestDeleteBlock(id));

        dbBlocks().deleteRecord(id)
        .then(() => dispatch(receiveBlockDeleted(id)))
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
/**
 * Return an object containing the block and its parameters filled with the
 * values passed as input.
 */
function prepareInput(block, input) {
    const newInput = Object.assign({}, input);

    block.params.forEach((param) => {
        newInput[param.name] = input[param.name] || param.defaultValue;
    });

    return { block, input: newInput };
}

/**
 * Return an object containing the block, its parameters and the results of
 * fetching the models of that block.
 */
function fetchModels(args) {
    const input = args.input;
    const block = args.block;

    let count = 0;
    const total = block.models.length;
    const results = [];

    return new Promise((resolve) => {
        function finished() {
            count += 1;
            if (count >= total) {
                resolve({
                    block,
                    params: input,
                    models: results,
                });
            }
        }

        // Call finished() right away to account for the case where
        // there are no models to fetch.
        if (total === 0) {
            finished();
        }

        block.models.forEach((model) => {
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
    const block = args.block;
    const params = args.params;
    const models = args.models;

    const modelsData = {
        params,
        models,
    };

    return new Promise((resolve) => {
        let controller = block.controller;
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
 * Return the output of a block.
 *
 * Fetches the block metadata, prepare its parameters based on the input,
 * fetches the models and then run the controller and return its output.
 */
export function runBlock(args) {
    const id = args.id;
    const input = args.input;

    return dispatch => dispatch(fetchBlock(id))
        .then(block => prepareInput(block, input))
        .then(fetchModels)
        .then(runController)
        .catch(console.log.bind(console));
}
