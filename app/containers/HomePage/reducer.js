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
  LOAD_REPOS,
  RECEIVED_REPOS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  repos: null,
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVED_REPOS:
      return state.set('repos', action.repos);
    default:
      return state;
  }
}

export default homeReducer;
