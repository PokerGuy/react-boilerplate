/*
 * HomeReducer
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

import {
  RECEIVED_REPOS,
  NEW_REPO,
  UPDATE_REPO,
  CLEAR_REPOS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  repos: null,
  credentials: null,
  connected: false,
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_REPOS:
      return state.set('repos', []);
    case NEW_REPO:
      return state.set('repos', [...state.get('repos'), action.repo]);
    case RECEIVED_REPOS:
      return state.set('repos', action.repos);
    case UPDATE_REPO:
      const update = state.get('repos').map(function(repo) {
        if (repo.repo_name === action.repo.repo_name) {
          return action.repo;
        } else {
          return repo;
        }
      });
      return state.set('repos', update);
    default:
      return state;
  }
}

export default homeReducer;
