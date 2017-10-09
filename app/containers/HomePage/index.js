/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {makeSelectLoading, makeSelectError} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from '../../components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import {loadRepos} from './actions';
import {makeSelectRepos} from './selectors';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.loadRepos();
  }

  render() {
    const repos = this.props.repos;

    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            {name: 'description', content: 'A React.js Boilerplate application homepage'},
          ]}
        />
        <div>
          <ReposList repos={this.props.repos} />
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loadRepos: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadRepos: (evt) => dispatch(loadRepos()),
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
