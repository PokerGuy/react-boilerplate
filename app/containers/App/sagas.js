import { take, put, call, fork, select, cancel, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_ENV, SET_USERPAGE } from './constants';
import { setCredentials } from './actions';
import { makeSelectURL } from './selectors';
import { newRepo, updateRepo } from '../HomePage/actions';
const awsIot = require('aws-iot-device-sdk');
let client;
let credentials;


//  https://github.com/redux-saga/redux-saga/blob/master/docs/advanced/Channels.md
//  https://medium.com/@pierremaoui/using-websockets-with-redux-sagas-a2bf26467cab
//  https://medium.com/@ebakhtarov/bidirectional-websockets-with-redux-saga-bfd5b677c7e7
//  https://youfoundron.com/blog/websockets-in-redux-using-sagas
//  http://www.codeblocq.com/2017/08/How-to-receive-messages-from-web-sockets-using-redux-saga/

const axios = require('axios');

function* callCreds() {
  const url = yield select(makeSelectURL());
  return new Promise((fulfill, reject) => {
    axios.get(`${url}/iot`)
      .then((result) => {
        fulfill(result.data);
      }).catch((err) => {
        reject(err);
      });
  });
}

function* watchClient(client) {
  const channel = eventChannel(emmiter => {
    client.on('connect', () => {
      console.log('CONNECTED!!');
      client.subscribe('repos');
    });

    client.on('message', (topic, message) => {
      const string = new TextDecoder().decode(message);
      const msg = JSON.parse(string);
      console.log(msg);
      if (msg.type === 'new') {
        this.props.newRepo(msg.payload);
      } else if (msg.type === 'update') {
        this.props.updateRepo(msg.payload);
      }
    });

    client.on('close', () => {
      console.log('client closed');
    });

    client.on('error', (error) => {
      console.log('ERROR');
      console.log(error);
      //  Probably bad credentials...
      localStorage.removeItem('credentials');
      this.props.setConnection('disconnected');
      this.props.getCredentials();
      client.end(() => {
        console.log('killed the old client');
        client = null;
      });
    });
  });

  while (true) {
    const msg = yield take(channel);
    if (msg.type === 'new') {
      yield put(newRepo(msg));
    } else if (msg.type === 'update') {
      yield put(updateRepo(msg));
    }
  }
}

function* setupClient() {
  if (!credentials && localStorage.getItem('credentials')) {
    console.log('have credentials in localstorage...');
    credentials = JSON.parse(localStorage.getItem('credentials'));
  } else if (!credentials) {
    console.log('no local creds... calling to get them...');
    credentials = yield call(callCreds());
    localStorage.credentials = JSON.stringify(credentials);
    console.log('got the new credentials');
  } else {
    console.log('already have credentials in memory');
  }
  console.log('setting up the client');
  client = awsIot.device({
    region: credentials.region,
    protocol: 'wss',
    accessKeyId: credentials.accessKey,
    secretKey: credentials.secretKey,
    sessionToken: credentials.sessionToken,
    port: 443,
    host: credentials.iotEndpoint,
  });
  return eventChannel(emit => {

    const receiveMsg = (event) => {
      emit(event.payload);
    };

    const updateEvent = (event) => {
      emit(event.payload);
    };

    const unsubscribe = () => {
      client.end(() => {
        console.log('killed the client...');
      });
    };
  });
}

function* checkCredentials() {
  console.log('in checkCredentials');
  const url = yield select(makeSelectURL());
  const creds = yield callCreds(url);
  yield put(setCredentials(creds));
}

function* envChange() {
  console.log('envChange');
}

function* pageChange() {
  console.log('pageChange');
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
