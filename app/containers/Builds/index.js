import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import BuildList from '../../components/BuildList';
import { setRepo, updateBuild, newBuild } from './actions';
import { makeSelectBuilds } from './selectors';
import {makeSelectConnected, makeSelectCredentials} from '../App/selectors';
import {getCredentials, setConnection, setHeaders} from '../App/actions';
const awsIot = require('aws-iot-device-sdk');
let client;

export class BuildPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.setRepo(this.props.params.repo);
    this.props.setConnection('disconnected');
    this.props.setHeaders(true);
  }

  componentWillUnmount() {
    client.end(function(){
      console.log('killed the old client');
      client = null;
    });
  }

  componentWillReceiveProps(nextProps) {
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
          client.subscribe('repos/' + this.props.params.repo);
          this.props.setConnection('connected');
        });

        client.on('message', (topic, message) => {
          const string = new TextDecoder().decode(message);
          const msg = JSON.parse(string);
          console.log(msg);
          if (msg.type === 'new') {
            this.props.newBuild(msg.payload);
          } else if (msg.type === 'update') {
            this.props.updateBuild(msg.payload);
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
    return (
      <article>
        <Helmet
          title="Builds"
          meta={[
            {name: 'description', content: 'Build Status'},
          ]}
        />
        <div>
          <br/>
          <Link to="/">Repos</Link> / {this.props.params.repo}
          <BuildList builds={this.props.builds} />
        </div>
      </article>
    );
  }
}

BuildPage.propTypes = {
  loadRepos: React.PropTypes.func,
  setRepo: React.PropTypes.func,
  setConnection: React.PropTypes.func,
  getCredentials: React.PropTypes.func,
  builds: React.PropTypes.array,
  connectStatus: React.PropTypes.string,
  credentials: React.PropTypes.object,
  updateBuild: React.PropTypes.func,
  newBuild: React.PropTypes.func,
  setHeaders: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    setRepo: (repo) => dispatch(setRepo(repo)),
    setConnection: (status) => dispatch(setConnection(status)),
    getCredentials: () => dispatch(getCredentials()),
    updateBuild: (build) => dispatch(updateBuild(build)),
    newBuild: (build) => dispatch(newBuild(build)),
    setHeaders: (headers) => dispatch(setHeaders(headers)),
  };
}

const mapStateToProps = createStructuredSelector({
  builds: makeSelectBuilds(),
  connectStatus: makeSelectConnected(),
  credentials: makeSelectCredentials(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(BuildPage);
