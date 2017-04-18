import React from 'react';
import {IndexLink, Link} from 'react-router';

const Header = () => {
  return (
    <header className="primary-header">
      <div className="container">
        <a href="http://www.kenzan.com" target="_new"><img className="logo" src={`../../assets/logo-reg-2x.png`} /></a>
        <h1 className="title"><span className="k8color">K</span>r<span className="k8color">8</span>sswordz</h1>
        <nav className="header-border">
        </nav>
      </div>
    </header>
  );
};

export default Header;
