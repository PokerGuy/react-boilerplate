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
  SET_CONNECTION,
  SET_CREDENTIALS,
  SET_ENV,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  connected: 'disconnected',
  credentials: null,
  selectedEnv: 'Sandbox',
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONNECTION:
      return state.set('connected', action.status);
    case SET_CREDENTIALS:
      return state.set('credentials', action.credentials);
    case SET_ENV:
      return state.set('selectedEnv', action.env);
    default:
      return state;
  }
}

export default appReducer;
