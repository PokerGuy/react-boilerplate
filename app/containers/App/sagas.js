import { take, put, call, select, cancel, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_ENV, SET_USERPAGE } from './constants';
import { makeSelectURL, makeSelectUserPage } from './selectors';
import { makeSelectRepo } from '../Builds/selectors';
import { makeSelectDetailParams } from '../BuildDetails/selectors';
import { NEW_REPO, UPDATE_REPO } from '../HomePage/constants';
import { NEW_BUILD, UPDATE_BUILD } from '../Builds/constants';
import { NEW_DETAIL } from '../BuildDetails/constants';
import { loadRepos } from '../HomePage/actions';
const awsIot = require('aws-iot-device-sdk');
let client;
let credentials;
let page;
let repo;
let startTime;
let subscription;

const axios = require('axios');

function callCreds(url) {
  return new Promise((fulfill, reject) => {
    axios.get(`${url}/iot`)
      .then((result) => {
        fulfill(result.data);
      }).catch((err) => {
        reject(err);
      });
  });
}

function initClient() {
  return eventChannel((emitter) => {
    client = awsIot.device({
      region: credentials.region,
      protocol: 'wss',
      accessKeyId: credentials.accessKey,
      secretKey: credentials.secretKey,
      sessionToken: credentials.sessionToken,
      port: 443,
      host: credentials.iotEndpoint,
    });

    client.on('connect', () => {
      console.log('CONNECTED!');
      console.log(`on the ${page}`);
      subscribe();
    });

    client.on('error', (err) => {
      console.log('ERROR');
      console.log(err);
      //  Probably bad credentials...
      localStorage.removeItem('credentials');
    });

    client.on('close', () => {
      console.log('client closed');
    });

    client.on('message', (topic, message) => {
      const string = new TextDecoder().decode(message);
      const msg = JSON.parse(string);
      console.log(msg);
      switch (page) {
        case 'repos':
          if (msg.type === 'new') {
            return emitter({ type: NEW_REPO, repo: msg.payload });
          } else if (msg.type === 'update') {
            return emitter({ type: UPDATE_REPO, repo: msg.payload });
          }
          break;
        case 'build':
          if (msg.type === 'new') {
            return emitter({ type: NEW_BUILD, build: msg.payload });
          } else if (msg.type === 'update') {
            return emitter({ type: UPDATE_BUILD, build: msg.payload });
          }
          break;
        case 'build_details':
          return emitter({ type: NEW_DETAIL, detail: msg.payload });
        default:
        //  Do nothing
      }
    });

    return () => {
      console.log('Client off');
    };
  });
}

function subscribe() {
  if (subscription) {
    client.unsubscribe(subscription);
  }
  switch (page) {
    case 'repos':
      subscription = 'repos';
      client.subscribe(subscription);
      break;
    case 'build':
      subscription = `repos/${repo}`;
      client.subscribe(subscription);
      break;
    case 'build_details':
      subscription = `repos/${repo}/${startTime}`;
      client.subscribe(subscription);
  }
}

function* envChange() {
  console.log('envChange');
  page = yield select(makeSelectUserPage());
  //  Going to need new credentials since switching environments
  const url = yield select(makeSelectURL());
  credentials = yield call(callCreds, url);
  localStorage.credentials = JSON.stringify(credentials);
  //  Reload based on whatever page the user is on
  switch (page) {
    case 'repos':
      yield put(loadRepos());
      break;
  }
  const channel = yield call(initClient);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* pageChange() {
  console.log('pageChange');
  page = yield select(makeSelectUserPage());
  if (page === 'build') {
    repo = yield select(makeSelectRepo());
  } else if (page === 'build_details') {
    const details = yield select(makeSelectDetailParams());
    repo = details.repo;
    startTime = details.start;
  }
  console.log('getting a new client');
  if (!credentials && localStorage.getItem('credentials')) {
    credentials = JSON.parse(localStorage.getItem('credentials'));
  } else if (!credentials) {
    const url = yield select(makeSelectURL());
    credentials = yield call(callCreds, url);
    localStorage.credentials = JSON.stringify(credentials);
  }
  const channel = yield call(initClient);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}


/**
 * Root saga manages watcher lifecycle
 */
export function* globalSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const envWatcher = yield takeLatest(SET_ENV, envChange);
  const pageWatcher = yield takeLatest(SET_USERPAGE, pageChange);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(envWatcher, pageWatcher);
}
