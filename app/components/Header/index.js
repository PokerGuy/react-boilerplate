import React from 'react';
import Logo from './synergy.png';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <img src={Logo} /> Serverless DevOps the Easy Way
      </div>
    );
  }
}

export default Header;
