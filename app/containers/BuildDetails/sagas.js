/**
 * Gets the repositories of the user from Github
 */

import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_DETAILS } from './constants';
import { receivedDetails, clearDetails } from './actions';
import { makeSelectRepo } from './selectors';
import { makeSelectURL } from '../App/selectors';

const axios = require('axios');

function callBuilds(repo, start, url) {
  console.log(repo);
  console.log(start);
  return new Promise(function(fulfill, reject) {
    axios.get(url + '/build/' + repo + '/' + start)
      .then(function(result) {
        fulfill(result.data)
      }).catch(function(err) {
        reject(err)
    })
  })
}

export function* getDetails() {
  yield put(clearDetails());
  const repo = yield select(makeSelectRepo());
  const url = yield select(makeSelectURL());
  const details = yield call(callBuilds, repo.repo, repo.start, url);
  yield put(receivedDetails(details));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* buildDetailsData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(SET_DETAILS, getDetails);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  buildDetailsData,
];
