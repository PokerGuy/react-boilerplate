/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import ReposList from '../../components/ReposList';
import {loadRepos, newRepo, updateRepo} from './actions';
import {makeSelectRepos} from './selectors';
import {makeSelectConnected, makeSelectCredentials, makeSelectURL, makeSelectEnv} from '../App/selectors';
import {getCredentials, setConnection, setPage} from '../App/actions';
const awsIot = require('aws-iot-device-sdk');
let client;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.loadRepos();
    this.props.setPage('repos');
  }

  render() {
    let connStatus = <div>Disconnected: Repos</div>;
    if (this.props.connectStatus === 'connected') {
      connStatus = <div>Connected: Repos</div>
    }
    return (
      <article>
        <Helmet
          title="Repos"
          meta={[
            {name: 'description', content: 'Status of Repos'},
          ]}
        />
        <div>
          <br />
          {connStatus} <br />
          <ReposList repos={this.props.repos}/>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loadRepos: React.PropTypes.func,
  credentials: React.PropTypes.object,
  repos: React.PropTypes.array,
  getCredentials: React.PropTypes.func,
  setCredentials: React.PropTypes.func,
  newRepo: React.PropTypes.func,
  connectStatus: React.PropTypes.string,
  updateRepo: React.PropTypes.func,
  url: React.PropTypes.string,
  setLocation: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadRepos: (url) => dispatch(loadRepos(url)),
    newRepo: (evt) => dispatch(newRepo(evt)),
    updateRepo: (repo) => dispatch(updateRepo(repo)),
    setConnection: (status) => dispatch(setConnection(status)),
    getCredentials: () => dispatch(getCredentials()),
    setPage: (page) => dispatch(setPage(page)),
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  connectStatus: makeSelectConnected(),
  credentials: makeSelectCredentials(),
  url: makeSelectURL(),
  env: makeSelectEnv(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
