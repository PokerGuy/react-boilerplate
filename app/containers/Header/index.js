import React from 'react';
import Logo from './synergy.png';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {makeSelectEnv, makeSelectCredentials, makeSelectUserPage, makeSelectConnected} from '../App/selectors';
import {makeSelectRepo} from '../Builds/selectors';
import {setEnv, setConnection, getCredentials} from '../App/actions';
import {loadRepos, newRepo, updateRepo} from '../HomePage/actions';
import {loadBuilds} from '../Builds/actions';
const awsIot = require('aws-iot-device-sdk');
let client;


const preventDefault = (fn, ...args) => (e) => {
  e.preventDefault();
  fn(...args);
};

export class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.setConnection('disconnected');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedEnv !== nextProps.selectedEnv) {
      switch(this.props.page) {
        case 'repos':
          this.props.loadRepos();
        case 'build':
          this.props.loadBuilds();
      }
      client.end(() => {
        console.log('Killed old client');
        client = null;
        this.props.setConnection('disconnected');
      });
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
    let select;
    if (this.props.page === 'repos' || this.props.page === 'build') {
      const envs = ['Sandbox', 'Test', 'Prod'];
      select = envs.map((env, i) => {
        if (env === this.props.selectedEnv) {
          return <span key={i} className="selected">{env}</span>
        } else {
          return <span key={i} className="not-select"><div href="#" onClick={preventDefault(this.props.setEnv, env)}>{env}</div></span>
        }
      });
    }
    return (
      <div>
        <img src={Logo}/> <br/>
        Serverless DevOps the Easy Way <br/>
        <div className="select-row">
          {select}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  selectedEnv: React.PropTypes.string,
  setEnv: React.PropTypes.func,
  page: React.PropTypes.string,
  connectStatus: React.PropTypes.string,
  loadRepos: React.PropTypes.func,
  loadBuilds: React.PropTypes.func,
  getCredentials: React.PropTypes.func,
  setConnection: React.PropTypes.func,
  newRepo: React.PropTypes.func,
  updateRepo: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    setEnv: (env) => dispatch(setEnv(env)),
    setConnection: (conn) => dispatch(setConnection(conn)),
    loadRepos: () => dispatch(loadRepos()),
    loadBuilds: () => dispatch(loadBuilds()),
    getCredentials: () => dispatch(getCredentials()),
    newRepo: (payload) => dispatch(newRepo(payload)),
    updateRepo: (payload) => dispatch(updateRepo(payload)),
  };
}

const mapStateToProps = createStructuredSelector({
  selectedEnv: makeSelectEnv(),
  page: makeSelectUserPage(),
  connectStatus: makeSelectConnected(),
  //repo: makeSelectRepo(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
