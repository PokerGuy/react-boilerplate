/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GET_CREDENTIALS } from './constants';
import { setCredentials } from './actions';
const api_url = process.env.API_URL || 'https://sandbox.api.magickpics.com';

const axios = require('axios');

function callCreds() {
  return new Promise(function(fulfill, reject) {
    axios.get(api_url + '/iot')
      .then(function(result) {
        fulfill(result.data)
      }).catch(function(err) {
      reject(err)
    })
  })
}

function* checkCredentials() {
    const creds = yield callCreds();
    yield put(setCredentials(creds));
}

function* doTest() {
  yield put(test());
}

/**
 * Root saga manages watcher lifecycle
 */
export function* globalSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(GET_CREDENTIALS, checkCredentials);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  globalSaga,
];
