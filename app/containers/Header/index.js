import React from 'react';
import Logo from './synergy.png';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {makeSelectEnv} from '../App/selectors';
import {setEnv} from '../App/actions';


const preventDefault = (fn, ...args) => (e) => {
  e.preventDefault();
  fn(...args);
};

export class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    console.log('in the header ');
    console.log(this.props);
    const envs = ['Sandbox', 'Test', 'Prod'];
    const select = envs.map((env, i) => {
      console.log(this.props.selectedEnv);
      if (env === this.props.selectedEnv) {
        return <span key={i} className="selected">{env}</span>
      } else {
        return <span key={i} className="not-select"><div href="#" onClick={preventDefault(this.props.setEnv, env)}>{env}</div></span>
      }
    });
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
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    setEnv: (env) => {
      dispatch(setEnv(env));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  selectedEnv: makeSelectEnv(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Header);
