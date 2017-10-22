/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReposList from '../../components/ReposList';
import { loadRepos, newRepo, updateRepo } from './actions';
import { makeSelectRepos } from './selectors';
import { makeSelectClient, makeSelectConnected } from '../App/selectors';
import { getClient, connected, disconnected } from '../App/actions';
const awsIot = require('aws-iot-device-sdk');
let client;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.loadRepos();
    if (this.props.client) {
      console.log('Already have a client...');
    } else {
      console.log('need to get a client');
      this.props.getClient();
    }
  }

  componentWillUnmount() {
    // Unsubscribe here...
  }

  render() {
    if (this.props.client) {
      console.log('got a client!');

      this.props.client.on('connect', () => {
        console.log('connected');
        this.props.connected();
        this.props.client.subscribe('repos');
      });

      this.props.client.on('message', (topic, message) => {
        const string = new TextDecoder().decode(message);
        const msg = JSON.parse(string);
        if (msg.type === 'new') {
          this.props.newRepo(msg.payload);
        } else if (msg.type === 'update') {
          this.props.updateRepo(msg.payload);
        }
      });

      this.props.client.on('close', () => {
        console.log('Bye...');
        this.props.disconnected();
      });

      this.props.client.on('error', (error) => {
        console.log(error);
        localStorage.removeItem('credentials');
        this.props.getClient();
        this.props.disconnected();
      });
    }

    let connStatus = <div>Disconnected: Repos</div>
    if (this.props.connectStatus) {
      connStatus = <div>Connected: Repos</div>
    }
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
          {connStatus} <br />
          <ReposList repos={this.props.repos} />
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
  connectStatus: React.PropTypes.bool,
  connected: React.PropTypes.func,
  disconnected: React.PropTypes.func,
  updateRepo: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadRepos: () => dispatch(loadRepos()),
    newRepo: (evt) => dispatch(newRepo(evt)),
    connected: () => dispatch(connected()),
    disconnected: () => dispatch(disconnected()),
    updateRepo: (repo) => dispatch(updateRepo(repo)),
    getClient: () => dispatch(getClient()),
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  connectStatus: makeSelectConnected(),
  client: makeSelectClient(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
