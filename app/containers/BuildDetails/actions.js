/*
 * Home Actions
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
  SET_DETAILS,
  RECEIVED_DETAILS,
  LOAD_DETAILS,
  CLEAR_DETAILS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function setDetails(repo, start) {
  return {
    type: SET_DETAILS,
    repo: repo,
    start: start,
  }
}

export function loadDetails() {
  return {
    type: LOAD_DETAILS,
  }
}

export function receivedDetails(details) {
  return {
    type: RECEIVED_DETAILS,
    details: details,
  }
}

export function clearDetails() {
  return {
    type: CLEAR_DETAILS,
  }
}
