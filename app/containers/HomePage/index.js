/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReposList from '../../components/ReposList';
import { loadRepos } from './actions';
import { makeSelectRepos } from './selectors';
import { setPage } from '../App/actions';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.loadRepos();
    this.props.setPage('repos');
  }

  render() {
    return (
      <article>
        <Helmet
          title="Repos"
          meta={[
            { name: 'description', content: 'Status of Repos' },
          ]}
        />
        <div>
          <br />
          <ReposList repos={this.props.repos} />
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loadRepos: React.PropTypes.func,
  repos: React.PropTypes.array,
  setPage: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadRepos: (url) => dispatch(loadRepos(url)),
    setPage: (page) => dispatch(setPage(page)),
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
