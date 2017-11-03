import { fromJS } from 'immutable';

import {
  SET_DETAILS,
  RECEIVED_DETAILS,
  CLEAR_DETAILS,
  NEW_DETAIL,
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
    case CLEAR_DETAILS:
      return state
        .set('details', null);
    case NEW_DETAIL:
      return state.set('details', [...state.get('details'), action.detail]);
    default:
      return state;
  }
}

export default buildDetailsReducer;
