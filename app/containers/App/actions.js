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
  GET_CLIENT,
  SET_CLIENT,
  CONNECTED,
  DISCONNECTED,
} from './constants';

export function getClient() {
  return {
    type: GET_CLIENT,
  };
}

export function setClient(credentials) {
  return {
    type: SET_CLIENT,
    credentials: credentials,
  };
}

export function connected() {
  return {
    type: CONNECTED,
  };
}

export function disconnected() {
  return {
    type: DISCONNECTED,
  };
}
