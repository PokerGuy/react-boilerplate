/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  GET_CREDENTIALS,
  SET_CREDENTIALS,
  SET_CONNECTION,
  SET_ENV,
} from './constants';

export function getCredentials() {
  return {
    type: GET_CREDENTIALS,
  }
}


export function setCredentials(credentials) {
  return {
    type: SET_CREDENTIALS,
    credentials: credentials,
  }
}

export function setConnection(status) {
  return {
    type: SET_CONNECTION,
    status: status,
  }
}

export function setEnv(env) {
  return {
    type: SET_ENV,
    env: env,
  }
}
