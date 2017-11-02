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
  render() {
    let select;
    if (this.props.page === 'repos' || this.props.page === 'build') {
      const envs = ['Sandbox', 'Test', 'Prod'];
      select = envs.map((env, i) => {
        if (env === this.props.selectedEnv) {
          return <span key={i} className="selected">{env}</span>;
        }
        return <span key={i} className="not-select"><div href="#" onClick={preventDefault(this.props.setEnv, env)}>{env}</div></span>;
      });
    }
    return (
      <div>
        <img src={Logo} /> <br />
        Serverless DevOps the Easy Way <br />
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
