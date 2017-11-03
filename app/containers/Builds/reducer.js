import { fromJS } from 'immutable';

import {
  SET_REPO,
  RECEIVED_BUILDS,
  NEW_BUILD,
  UPDATE_BUILD,
  CLEAR_BUILDS,
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
    case CLEAR_BUILDS:
      return state.set('builds', []);
    case RECEIVED_BUILDS:
      return state.set('builds', action.builds);
    case NEW_BUILD:
      return state.set('builds', [...state.get('builds'), action.build]);
    case UPDATE_BUILD:
      const update = state.get('builds').map((build) => {
        if (build.build_start === action.build.build_start) {
          return action.build;
        }
        return build;
      });
      return state.set('builds', update);
    default:
      return state;
  }
}

export default buildReducer;
