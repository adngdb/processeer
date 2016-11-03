import {
    CLEAR_NEW_VIEW_DATA,
    RECEIVE_CREATED_VIEW,
    RECEIVE_VIEW_CONTENT,
    REMOVE_VIEW_CONTENT,
    RECEIVE_VIEW_DELETED,
    RECEIVE_VIEW_META,
    RECEIVE_VIEWS,
    REQUEST_VIEW_META,
    REQUEST_RUNNING_VIEW,
    UPDATE_VIEW,
    UPDATE_VIEW_META,
    UPDATE_VIEW_INPUT,
} from '../actions/views.jsx';


function view(state = {
    isFetching: false,
    isRunning: false,
    didInvalidate: false,
    isPickingBlock: false,
    id: null,
    blocks: [],
    name: '',
    slug: '',
    input: {},
    title: '',
    content: '',
}, action) {
    switch (action.type) {
    case RECEIVE_VIEW_CONTENT:
        return Object.assign({}, state, {
            isRunning: false,
            id: action.id,
            content: action.content,
            title: action.title,
        });
    case REMOVE_VIEW_CONTENT:
        return Object.assign({}, state, {
            content: null,
        });
    case UPDATE_VIEW:
        return Object.assign({}, state, action.view);
    case RECEIVE_VIEW_META:
    case UPDATE_VIEW_META:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            id: action.id,
            blocks: action.blocks,
            name: action.name,
            slug: action.slug,
        });
    case REQUEST_VIEW_META:
        return Object.assign({}, state, {
            isFetching: true,
            didInvalidate: false,
        });
    case REQUEST_RUNNING_VIEW:
        return Object.assign({}, state, {
            isRunning: true,
        });
    case CLEAR_NEW_VIEW_DATA:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            blocks: [],
            name: '',
            slug: '',
        });
    case UPDATE_VIEW_INPUT:
        return Object.assign({}, state, {
            input: action.input,
        });
    default:
        return state;
    }
}

export default function views(state = {}, action) {
    let newViews;
    switch (action.type) {
    case RECEIVE_VIEW_CONTENT:
    case UPDATE_VIEW_META:
    case RECEIVE_VIEW_META:
    case REQUEST_VIEW_META:
    case REQUEST_RUNNING_VIEW:
    case UPDATE_VIEW:
    case CLEAR_NEW_VIEW_DATA:
    case UPDATE_VIEW_INPUT:
        return Object.assign({}, state, {
            [action.id]: view(state[action.id], action),
        });
    case RECEIVE_VIEWS:
        newViews = {};
        action.views.forEach((elem) => {
            const subAction = Object.assign({}, elem, { type: RECEIVE_VIEW_META });
            newViews[subAction.id] = view(state[subAction.id], subAction);
        });
        return newViews;
    case RECEIVE_VIEW_DELETED:
        newViews = Object.assign({}, state);
        if (Object.hasOwnProperty.call(newViews, action.id)) {
            delete newViews[action.id];
        }
        return newViews;
    default:
        return state;
    }
}
