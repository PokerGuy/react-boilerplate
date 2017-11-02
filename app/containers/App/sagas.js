import { take, put, call, select, cancel, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_ENV, SET_USERPAGE } from './constants';
import { makeSelectURL, makeSelectUserPage } from './selectors';
import { NEW_REPO, UPDATE_REPO } from '../HomePage/constants';
import { NEW_BUILD, UPDATE_BUILD } from '../Builds/constants';
import { NEW_DETAIL } from '../BuildDetails/constants';
const awsIot = require('aws-iot-device-sdk');
let client;
let credentials;
let subscriptions = [];


//  https://github.com/redux-saga/redux-saga/blob/master/docs/advanced/Channels.md
//  https://medium.com/@pierremaoui/using-websockets-with-redux-sagas-a2bf26467cab
//  https://medium.com/@ebakhtarov/bidirectional-websockets-with-redux-saga-bfd5b677c7e7
//  https://youfoundron.com/blog/websockets-in-redux-using-sagas
//  http://www.codeblocq.com/2017/08/How-to-receive-messages-from-web-sockets-using-redux-saga/

const axios = require('axios');

function callCreds(url) {
  return new Promise((fulfill, reject) => {
    axios.get(`${url}/iot`)
      .then((result) => {
        console.log('in axios and credentials are');
        console.log(result.data);
        fulfill(result.data);
      }).catch((err) => {
        reject(err);
      });
  });
}

function initClient(page) {
  return eventChannel(emitter => {
    console.log('setting up the client');
    console.log('here are the credentials');
    console.log(credentials);
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
      console.log(`the length of subscriptions is ${subscriptions.length}`);
      subscriptions.forEach((sub) => {
        client.unsubscribe(sub);
      });
      switch (page) {
        case 'repos':
          client.subscribe('repos');
          subscriptions.push('repos');
          break;
      }
    });

    client.on('error', (err) => {
      console.log('ERROR');
      console.log(err);
      //  Probably bad credentials...
      localStorage.removeItem('credentials');
      client.end(() => {
        console.log('Killed the client.');
        client = null;
      });
    });

    client.on('message', (topic, message) => {
      const string = new TextDecoder().decode(message);
      const msg = JSON.parse(string);
      console.log(msg);
      switch (msg.type) {
        case 'new':
          return emitter({ type: NEW_REPO, repo: msg.payload });
        case 'update':
          return emitter({ type: UPDATE_REPO, repo: msg.payload });
        default:
          //  Do nothing
      }
    });

    return () => {
      console.log('Client off');
    };
  });

}

/* function* checkCredentials() {
  console.log('in checkCredentials');
  const url = yield select(makeSelectURL());
  const creds = yield callCreds(url);
  yield put(setCredentials(creds));
} */

function* envChange() {
  console.log('envChange');
}

function* pageChange() {
  console.log('pageChange');
  if (!credentials && localStorage.getItem('credentials')) {
    console.log('have credentials in localstorage...');
    credentials = JSON.parse(localStorage.getItem('credentials'));
  } else if (!credentials) {
    console.log('no local creds... calling to get them...');
    const url = yield select(makeSelectURL());
    credentials = yield call(callCreds, url);
    console.log('The credentials are:');
    console.log(credentials);
    localStorage.credentials = JSON.stringify(credentials);
    console.log('got the new credentials');
  } else {
    console.log('already have credentials in memory');
  }
  const page = yield select(makeSelectUserPage());
  const channel = yield call(initClient, page);
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
