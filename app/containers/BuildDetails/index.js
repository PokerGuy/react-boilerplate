import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Details from '../../components/Details';
import { setDetails, newDetail } from './actions';
import { makeSelectDetails, makeSelectRepo } from './selectors';
import {makeSelectConnected, makeSelectCredentials} from '../App/selectors';
import {getCredentials, setConnection, setPage} from '../App/actions';
const awsIot = require('aws-iot-device-sdk');
const moment = require('moment-timezone');
let client;

export class BuildDetailsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.setDetails(this.props.params.repo, this.props.params.start);
    this.props.setConnection('disconnected');
    this.props.setPage('build_details');
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
          client.subscribe('repos/' + this.props.params.repo + '/' + this.props.params.start);
          this.props.setConnection('connected');
        });

        client.on('message', (topic, message) => {
          const string = new TextDecoder().decode(message);
          const msg = JSON.parse(string);
          console.log(msg);
          if (msg.type === 'new') {
            this.props.newDetail(msg.payload);
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
    const buildTime = moment.tz(parseInt(this.props.repo.start), 'America/Chicago').format('MMMM DD YYYY hh:mm:ss a');
    return (
      <article>
        <Helmet
          title="Build Details"
          meta={[
            { name: 'description', content: 'Build Details' },
          ]}
        />
        <div>
          <br />
          <Link to="/">Repos</Link> / <Link to={"/build/" + this.props.repo.repo}>{this.props.repo.repo}</Link>
          / {buildTime}
          <div>
            <br />
            <Details details={this.props.details} />
          </div>
        </div>
      </article>
    );
  }
}

BuildDetailsPage.propTypes = {
  setDetails: React.PropTypes.func,
  details: React.PropTypes.array,
  repo: React.PropTypes.object,
  setConnection: React.PropTypes.func,
  getCredentials: React.PropTypes.func,
  connectStatus: React.PropTypes.string,
  credentials: React.PropTypes.object,
  newDetail: React.PropTypes.func,
  setPage: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    setDetails: (repo, start) => dispatch(setDetails(repo, start)),
    setConnection: (status) => dispatch(setConnection(status)),
    getCredentials: () => dispatch(getCredentials()),
    newDetail: (detail) => dispatch(newDetail(detail)),
    setPage: (page) => dispatch(setPage(page)),
  };
}

const mapStateToProps = createStructuredSelector({
  details: makeSelectDetails(),
  querystringParams: makeSelectRepo(),
  repo: makeSelectRepo(),
  connectStatus: makeSelectConnected(),
  credentials: makeSelectCredentials(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailsPage);
