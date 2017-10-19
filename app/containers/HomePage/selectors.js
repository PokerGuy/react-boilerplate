/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectRepos = () => createSelector(
  selectHome,
  (homeState) => homeState.get('repos')
);

const makeSelectCredentials = () => createSelector(
  selectHome,
  (homeState) => homeState.get('credentials')
);

const makeSelectConnected = () => createSelector(
  selectHome,
  (homeState) => homeState.get('connected')
);

export {
  selectHome,
  makeSelectRepos,
  makeSelectCredentials,
  makeSelectConnected,
};
