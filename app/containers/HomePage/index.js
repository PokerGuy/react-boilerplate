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
import H2 from 'components/H2';
import ReposList from '../../components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos, getCredentials, setCredentials, newRepo, connected, disconnected, updateRepo } from './actions';
import { makeSelectRepos, makeSelectCredentials, makeSelectConnected } from './selectors';
const awsIot = require('aws-iot-device-sdk');
let client;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.loadRepos();
    if (localStorage.credentials) {
      this.props.setCredentials(JSON.parse(localStorage.credentials));
    } else {
      this.props.getCredentials();
    }
  }

  componentWillUnmount() {
    client.end(function () {
      console.log('disconnected for good...');
      client = null;
    })
  }

  render() {
    if (this.props.credentials && !client) {
      client = awsIot.device({
        region: this.props.credentials.region,
        protocol: 'wss',
        accessKeyId: this.props.credentials.accessKey,
        secretKey: this.props.credentials.secretKey,
        sessionToken: this.props.credentials.sessionToken,
        port: 443,
        host: this.props.credentials.iotEndpoint,
      });
      client.on('connect', () => {
        this.props.connected();
        client.subscribe('repos');
      });
      client.on('message', (topic, message) => {
        const string = new TextDecoder().decode(message);
        const msg = JSON.parse(string);
        if (msg.type === 'new') {
          this.props.newRepo(msg.payload);
        } else if (msg.type === 'update') {
          this.props.updateRepo(msg.payload);
        }
      });
      client.on('close', () => {
        console.log('Bye...');
        this.props.disconnected();
      });
      client.on('error', (error) => {
        console.log(error);
        client = null;
        this.props.getCredentials();
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
    getCredentials: () => dispatch(getCredentials()),
    setCredentials: (evt) => dispatch(setCredentials(evt)),
    newRepo: (evt) => dispatch(newRepo(evt)),
    connected: () => dispatch(connected()),
    disconnected: () => dispatch(disconnected()),
    updateRepo: (repo) => dispatch(updateRepo(repo)),
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  credentials: makeSelectCredentials(),
  connectStatus: makeSelectConnected(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
