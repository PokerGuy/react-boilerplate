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
  SET_DETAILS,
  LOAD_DETAILS,
  RECEIVED_DETAILS,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  repo: null,
  start: null,
  details: null,
});

function buildDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DETAILS:
      return state
        .set('repo', action.repo)
        .set('start', action.start);
    case RECEIVED_DETAILS:
      return state.set('details', action.details);
    default:
      return state;
  }
}

export default buildDetailsReducer;
