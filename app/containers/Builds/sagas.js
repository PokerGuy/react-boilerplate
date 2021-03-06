import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_REPO, LOAD_BUILDS } from './constants';
import { receivedBuilds, clearBuilds } from './actions';
import { makeSelectRepo } from './selectors';
import { makeSelectURL } from '../App/selectors';

const axios = require('axios');

function callBuilds(repo, url) {
  return new Promise((fulfill, reject) => {
    axios.get(`${url}/build/${repo}`)
      .then((result) => {
        fulfill(result.data);
      }).catch((err) => {
        reject(err);
      });
  });
}

export function* getBuilds() {
  yield put(clearBuilds());
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
  const reload = yield takeLatest(LOAD_BUILDS, getBuilds);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher, reload);
}

// Bootstrap sagas
export default [
  buildData,
];
