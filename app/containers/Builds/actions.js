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
  SET_REPO,
  RECEIVED_BUILDS,
  LOAD_BUILDS,
  NEW_BUILD,
  UPDATE_BUILD,
  CLEAR_BUILDS,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function setRepo(repo) {
  return {
    type: SET_REPO,
    repo: repo,
  }
}

export function loadBuilds() {
  return {
    type: LOAD_BUILDS,
  }
}

export function receivedBuilds(builds) {
  return {
    type: RECEIVED_BUILDS,
    builds: builds,
  }
}

export function newBuild(build) {
  return {
    type: NEW_BUILD,
    build: build,
  }
}

export function updateBuild(build) {
  return {
    type: UPDATE_BUILD,
    build: build,
  }
}

export function clearBuilds() {
  return {
    type: CLEAR_BUILDS,
  }
}
