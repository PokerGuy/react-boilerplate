import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_REPOS } from './constants';
import { receivedRepos, clearRepos } from './actions';
import { makeSelectURL } from '../App/selectors';
const axios = require('axios');

function callRepos(url) {
  return new Promise((fulfill, reject) => {
    axios.get(`${url}/locks`)
      .then((result) => {
        fulfill(result.data);
      }).catch((err) => {
        reject(err);
      });
  });
}

function* getRepos() {
  yield put(clearRepos());
  const url = yield select(makeSelectURL());
  const repos = yield call(callRepos, url);
  yield put(receivedRepos(repos));
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
