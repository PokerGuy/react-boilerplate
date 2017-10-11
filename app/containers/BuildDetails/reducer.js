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
  SET_REPO,
  LOAD_BUILDS,
  RECEIVED_BUILDS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  repo: null,
  builds: null,
});

function buildReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REPO:
      return state.set('repo', action.repo);
    case RECEIVED_BUILDS:
      return state.set('builds', action.builds);
    default:
      return state;
  }
}

export default buildReducer;
