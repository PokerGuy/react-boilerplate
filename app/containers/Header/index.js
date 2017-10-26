import React from 'react';
import Logo from './synergy.png';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <img src={Logo}/> <br/>
        Serverless DevOps the Easy Way <br/>
        <div className="select-row">
          <span className="selected">Sandbox</span>
          <span className="not-select">Test</span>
          <span className="not-select">Prod</span>
        </div>
      </div>
    );
  }
}

export default Header;
