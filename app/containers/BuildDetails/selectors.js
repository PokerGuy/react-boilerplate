/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('build_details');

const makeSelectRepo = () => createSelector(
  selectHome,
  (homeState) => homeState.get('repo')
);

const makeSelectBuilds = () => createSelector(
  selectHome,
  (homeState) => homeState.get('builds')
);

export {
  selectHome,
  makeSelectRepo,
  makeSelectBuilds,
};
