/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const makeSelectClient = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('client')
);

const makeSelectConnected = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('connected')
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
  makeSelectClient,
  makeSelectConnected,
  makeSelectLocationState,
};
