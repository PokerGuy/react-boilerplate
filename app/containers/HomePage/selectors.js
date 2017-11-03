import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectRepos = () => createSelector(
  selectHome,
  (homeState) => homeState.get('repos')
);

export {
  selectHome,
  makeSelectRepos,
};
