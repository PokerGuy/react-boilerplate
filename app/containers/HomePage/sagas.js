/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_REPOS, GET_CREDENTIALS } from './constants';
import { receivedRepos, setCredentials } from './actions';

const axios = require('axios');

function callRepos() {
  return new Promise(function(fulfill, reject) {
    axios.get('https://r2hx7xn3i2.execute-api.us-west-2.amazonaws.com/sandbox/locks')
      .then(function(result) {
        fulfill(result.data)
      }).catch(function(err) {
        reject(err)
    })
  })
}

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

function* getRepos() {
  const repos = yield call(callRepos);
  yield put (receivedRepos(repos));
}

function* getCreds() {
  const creds = yield call(callCreds);
  yield put(setCredentials(creds));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(LOAD_REPOS, getRepos);
  const credentialsWatcher = yield takeLatest(GET_CREDENTIALS, getCreds);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  githubData,
];
