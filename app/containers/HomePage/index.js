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
import {loadRepos, getCredentials, setCredentials} from './actions';
import {makeSelectRepos, makeSelectCredentials} from './selectors';
const awsIot = require('aws-iot-device-sdk');
let client;

function onConnect() {
  console.log('connected');
  client.subscribe('derp/#');
  console.log(client);
}

function onMessage(topic, message) {
  const string = new TextDecoder().decode(message);
  console.log(JSON.parse(string));
  console.log(message);
}

function onClose() {
  console.log('Buh Bye');
}
export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.loadRepos();
    if (localStorage.credentials) {
      console.log('Already have credentials');
      this.props.setCredentials(JSON.parse(localStorage.credentials));
    } else {
      this.props.getCredentials();
    }
  }

  render() {
    if (this.props.credentials && !client) {
      console.log('Got credentials');
      console.log(this.props.credentials);
      console.log(this.props.credentials.region);
      /* client = awsIot.device({
        region: this.props.credentials.region,
        protocol: 'wss',
        accessKeyId: this.props.credentials.accessKey,
        secretKey: this.props.credentials.secretKey,
        sessionToken: this.props.credentials.sessionToken,
        port: 443,
        host: this.props.credentials.iotEndpoint
      }); */
      try {
        client = awsIot.device({
          region: this.props.credentials.region,
          protocol: 'wss',
          accessKeyId: 'derp',
          secretKey: this.props.credentials.secretKey,
          sessionToken: this.props.credentials.sessionToken,
          port: 443,
          host: this.props.credentials.iotEndpoint
        });
      } catch(err) {
        console.log(err);
      }
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
          <br/>
          Repos <br/>
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
    getCredentials: (evt) => dispatch(getCredentials()),
    setCredentials: (evt) => dispatch(setCredentials(evt)),
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  credentials: makeSelectCredentials(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
