/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_REPOS } from './constants';
import { receivedRepos } from './actions';

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

export function* getRepos() {
  const repos = yield call(callRepos);
  yield put (receivedRepos(repos));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(LOAD_REPOS, getRepos);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  githubData,
];
