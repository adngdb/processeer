import hello from 'hellojs';

import { fetchReports } from './reports.jsx';
import { fetchBlocks } from './blocks.jsx';
import db from '../db.jsx';


export const REQUEST_USER_SIGNIN_GITHUB = 'REQUEST_USER_SIGNIN_GITHUB';
function requestSignInGithub() {
    return {
        type: REQUEST_USER_SIGNIN_GITHUB,
    };
}

export const RECEIVE_USER_TOKEN_GITHUB = 'RECEIVE_USER_TOKEN_GITHUB';
function receiveGithubToken(token) {
    return {
        type: RECEIVE_USER_TOKEN_GITHUB,
        token,
    };
}

export const RECEIVE_USER_NAME_GITHUB = 'RECEIVE_USER_NAME_GITHUB';
function receiveGithubUsername(username) {
    return {
        type: RECEIVE_USER_NAME_GITHUB,
        username,
    };
}

export const RECEIVE_USER_SIGNOUT_GITHUB = 'RECEIVE_USER_SIGNOUT_GITHUB';
function receiveSignedOut() {
    return {
        type: RECEIVE_USER_SIGNOUT_GITHUB,
    };
}

function onGithubTokenReceived(token) {
    return (dispatch) => {
        dispatch(receiveGithubToken(token));

        // Setting a token will re-synchronize the database. We thus want to
        // refresh the lists of reports and blocks once that's done.
        db.setUserToken(token)
        .then(dispatch(fetchReports()))
        .then(dispatch(fetchBlocks()));
    };
}

function requestGithubUsername() {
    return (dispatch) => {
        hello('github').api('me')
        .then((user) => {
            dispatch(receiveGithubUsername(user.name));
        });
    };
}

export function signInGithub() {
    return (dispatch) => {
        dispatch(requestSignInGithub());

        hello('github').login()
        .then((res) => {
            dispatch(onGithubTokenReceived(res.authResponse.access_token));
            dispatch(requestGithubUsername());
        }, console.log.bind(console));
    };
}

export function signOutGithub() {
    return (dispatch) => {
        hello('github').logout()
        .then(() => {
            dispatch(receiveSignedOut());
        }, console.log.bind(console));
    };
}

export function verifyUserSignedIn() {
    return (dispatch) => {
        const auth = hello('github').getAuthResponse();

        const currentTime = (new Date()).getTime() / 1000;
        if (auth && auth.access_token && auth.expires > currentTime) {
            // A user is already signed in, signal it.
            dispatch(onGithubTokenReceived(auth.access_token));
            dispatch(requestGithubUsername());
        }
    };
}
