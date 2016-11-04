import {
    REQUEST_USER_SIGNIN_GITHUB,
    RECEIVE_USER_TOKEN_GITHUB,
    RECEIVE_USER_NAME_GITHUB,
    RECEIVE_USER_SIGNOUT_GITHUB,
} from '../actions/signin.jsx';


export default function user(state = {
    isFetching: false,
    didInvalidate: false,
    authenticated: false,
    username: null,
    authToken: null,
}, action) {
    switch (action.type) {
    case REQUEST_USER_SIGNIN_GITHUB:
        return Object.assign({}, state, {
            isFetching: true,
        });
    case RECEIVE_USER_TOKEN_GITHUB:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            authToken: action.token,
            authenticated: true,
        });
    case RECEIVE_USER_NAME_GITHUB:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            username: action.username,
        });
    case RECEIVE_USER_SIGNOUT_GITHUB:
        return Object.assign({}, state, {
            authenticated: false,
            username: null,
            authToken: null,
        });
    default:
        return state;
    }
}
