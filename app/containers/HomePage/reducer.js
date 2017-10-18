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
  SET_CREDENTIALS,
  NEW_REPO,
  UPDATE_REPO,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  repos: null,
  credentials: null,
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_REPO:
      console.log(action.repo);
      return {
        ...state,
        repos: [...state.repos, action.repo],
      };
    case RECEIVED_REPOS:
      return state.set('repos', action.repos);
    case SET_CREDENTIALS:
      localStorage.credentials = JSON.stringify(action.credentials);
      return state.set('credentials', action.credentials);
    default:
      return state;
  }
}

export default homeReducer;
