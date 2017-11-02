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
  NEW_REPO,
  UPDATE_REPO,
  CLEAR_REPOS,
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

export function newRepo(repo) {
  return {
    type: NEW_REPO,
    repo: repo,
  };
}

export function updateRepo(repo) {
  return {
    type: UPDATE_REPO,
    repo: repo,
  };
}

export function clearRepos() {
  return {
    type: CLEAR_REPOS,
  }
}
