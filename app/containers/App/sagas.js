/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GET_CLIENT } from './constants';
import { setClient } from './actions';

const axios = require('axios');

function callCreds() {
  return new Promise(function(fulfill, reject) {
    axios.get('https://r2hx7xn3i2.execute-api.us-west-2.amazonaws.com/sandbox/iot')
      .then(function(result) {
        fulfill(result.data)
      }).catch(function(err) {
      reject(err)
    })
  })
}

function* checkCredentials() {
  if (localStorage.credentials) {
    yield put(setClient(JSON.parse(localStorage.credentials)));
  } else {
    const creds = yield callCreds();
    localStorage.credentials = JSON.stringify(creds);
    yield put(setClient(creds));
  }
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
  const watcher = yield takeLatest(GET_CLIENT, checkCredentials);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  globalSaga,
];
