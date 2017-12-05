/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const makeSelectConnected = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('connected')
);

const makeSelectCredentials = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('credentials')
);

const makeSelectEnv = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('selectedEnv')
);

const makeSelectUserPage = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('page')
);

const makeSelectURL = () => createSelector(
  selectGlobal,
  (globalState) => {
    const env = globalState.get('selectedEnv');
    switch (env.toLowerCase()) {
      case 'sandbox':
        return 'https://sandbox.api.magickpics.com/synergy';
      case 'test':
        return 'https://test.api.magickpics.com/synegy';
      case 'prod':
        return 'https://api.magickpics.com/synergy';
      default:
        return 'https://sandbox.api.magickpics.com/synergy';
    }
  }
);

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  selectGlobal,
  makeSelectConnected,
  makeSelectCredentials,
  makeSelectLocationState,
  makeSelectEnv,
  makeSelectURL,
  makeSelectUserPage,
};
