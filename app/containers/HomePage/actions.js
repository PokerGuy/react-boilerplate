import {
  LOAD_REPOS,
  RECEIVED_REPOS,
  NEW_REPO,
  UPDATE_REPO,
  CLEAR_REPOS,
} from './constants';

export function loadRepos() {
  return {
    type: LOAD_REPOS,
  };
}

export function receivedRepos(repos) {
  return {
    type: RECEIVED_REPOS,
    repos,
  };
}

export function newRepo(repo) {
  return {
    type: NEW_REPO,
    repo,
  };
}

export function updateRepo(repo) {
  return {
    type: UPDATE_REPO,
    repo,
  };
}

export function clearRepos() {
  return {
    type: CLEAR_REPOS,
  };
}
