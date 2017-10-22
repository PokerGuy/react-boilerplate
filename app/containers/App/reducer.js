/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';
const awsIot = require('aws-iot-device-sdk');

import {
  SET_CLIENT,
  CONNECTED,
  DISCONNECTED,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  client: null,
  connected: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLIENT:
      const client = awsIot.device({
        region: action.credentials.region,
        protocol: 'wss',
        accessKeyId: action.credentials.accessKey,
        secretKey: action.credentials.secretKey,
        sessionToken: action.credentials.sessionToken,
        port: 443,
        host: action.credentials.iotEndpoint,
      });
      return state
        .set('client', client);
    case CONNECTED:
      return state.set('connected', true);
    case DISCONNECTED:
      return state.set('connected', false);
    default:
      return state;
  }
}

export default appReducer;
