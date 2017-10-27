/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_REPO } from './constants';
import { receivedBuilds } from './actions';
import { makeSelectRepo } from './selectors';
import { makeSelectURL } from '../App/selectors';

const axios = require('axios');

function callBuilds(repo, url) {
  return new Promise(function(fulfill, reject) {
    axios.get(url + '/build/' + repo)
      .then(function(result) {
        fulfill(result.data)
      }).catch(function(err) {
        reject(err)
    })
  })
}

export function* getBuilds() {
  const repo = yield select(makeSelectRepo());
  const url = yield select(makeSelectURL());
  const builds = yield call(callBuilds, repo, url);
  yield put(receivedBuilds(builds));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* buildData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(SET_REPO, getBuilds);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  buildData,
];
