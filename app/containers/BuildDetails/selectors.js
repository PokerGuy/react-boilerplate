/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { _ } from 'lodash';

const selectHome = (state) => state.get('build_details');

const makeSelectDetailParams = () => createSelector(
  selectHome,
  (homeState) => {
    return { repo: homeState.get('repo'), start: homeState.get('start') };
  }
);

const makeSelectDetails = () => createSelector(
  selectHome,
  (homeState) => homeState.get('details')
);

export {
  selectHome,
  makeSelectDetailParams,
  makeSelectDetails,
};
