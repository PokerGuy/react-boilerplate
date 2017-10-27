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
import {getCredentials, setConnection} from '../App/actions';
const awsIot = require('aws-iot-device-sdk');
let client;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    console.log(this.props.url);
    this.props.loadRepos();
    this.props.setConnection('disconnected');
  }

  componentWillUnmount() {
    client.end(function(){
      console.log('killed the old client');
      client = null;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.env !== nextProps.env) {
      this.props.setConnection('disconnected');
      this.props.loadRepos();
    }
    if ((nextProps.connectStatus === 'disconnected' || nextProps.connectStatus === 'newcredentials') && !client) {
      //Need a client
      let credentials = localStorage.credentials;
      if (credentials) {
        credentials = JSON.parse(credentials);
        //Try to use the localStorage credentials...
        client = awsIot.device({
          region: credentials.region,
          protocol: 'wss',
          accessKeyId: credentials.accessKey,
          secretKey: credentials.secretKey,
          sessionToken: credentials.sessionToken,
          port: 443,
          host: credentials.iotEndpoint,
        });
        client.on('connect', () => {
          console.log('CONNECTED!!');
          client.subscribe('repos');
          this.props.setConnection('connected');
        });

        client.on('message', (topic, message) => {
          const string = new TextDecoder().decode(message);
          const msg = JSON.parse(string);
          console.log(msg);
          if (msg.type === 'new') {
            this.props.newRepo(msg.payload);
          } else if (msg.type === 'update') {
            this.props.updateRepo(msg.payload);
          }
        });

        client.on('close', () => {
          console.log('client closed');
        });

        client.on('error', (error) => {
          console.log('ERROR');
          //Probably bad credentials...
          localStorage.removeItem('credentials');
          this.props.setConnection('disconnected');
          this.props.getCredentials();
          client.end(function(){
            console.log('killed the old client');
            client = null;
          })
        });
      } else {
        //No local credentials... Try and get some...
        this.props.getCredentials();
      }
    }
    if ((this.props.credentials !== nextProps.credentials) && nextProps.connectStatus !== 'connected') {
      localStorage.credentials = JSON.stringify(nextProps.credentials);
      this.props.setConnection('newcredentials');
    }
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
};

export function mapDispatchToProps(dispatch) {
  return {
    loadRepos: (url) => dispatch(loadRepos(url)),
    newRepo: (evt) => dispatch(newRepo(evt)),
    updateRepo: (repo) => dispatch(updateRepo(repo)),
    setConnection: (status) => dispatch(setConnection(status)),
    getCredentials: () => dispatch(getCredentials()),
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
