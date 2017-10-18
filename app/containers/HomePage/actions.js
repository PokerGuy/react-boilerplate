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
  LOAD_REPOS,
  RECEIVED_REPOS,
  GET_CREDENTIALS,
  SET_CREDENTIALS,
  NEW_REPO,
  UPDATE_REPO,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

export function loadRepos() {
  return {
    type: LOAD_REPOS,
  };
}

export function receivedRepos(repos) {
  return {
    type: RECEIVED_REPOS,
    repos: repos,
  };
}

export function getCredentials(creds) {
  return {
    type: GET_CREDENTIALS,
    credentials: creds,
  };
}

export function setCredentials(creds) {
  return {
    type: SET_CREDENTIALS,
    credentials: creds,
  };
}

export function newRepo(repo) {
  console.log('in the action');
  return {
    type: NEW_REPO,
    repo: repo,
  };
}

export function updateRepo(repo) {
  console.log(repo);
  return {
    type: UPDATE_REPO,
    repo: repo,
  };
}
