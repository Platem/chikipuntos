import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import M from 'materialize-css';

import * as ROUTES from '../../constants/routes';

const NavigationBase = (props) => {
  return (
    <AuthUserContext.Consumer>
      {authUser =>
        <div>
          <nav className="blue-grey">
            <div className="nav-wrapper">
              <Link className="brand-logo" to={ROUTES.LANDING}>Chikipuntos</Link>
              <a href="#!" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
              <Menu mobile={false} user={authUser} />
            </div>
            <UserDropDown mobile={false} user={authUser} firebase={props.firebase} />
          </nav>
          <Menu mobile={true} user={authUser} />
          <UserDropDown mobile={true} user={authUser} firebase={props.firebase} />
        </div>
      }
    </AuthUserContext.Consumer>
  );
}

function updateSidenav() {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
}

function updateDropdown() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(elems, {
    coverTrigger: false,
    hover: true,
  });
}

class Menu extends Component {
  componentDidMount() {
    updateDropdown();
    updateSidenav();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    updateDropdown();
    updateSidenav();
  }

  render() {
    if (this.props.user) {
      return (
        <ul id={this.props.mobile ? "nav-mobile" : "nav-main"} className={this.props.mobile ? "sidenav" : "right hide-on-med-and-down"}>
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.ADMIN}>Admin</Link>
          </li>
          <li>
            <a id={this.props.mobile ? "nav-mobile-user-dropdown" : "nav-main-user-dropdown"} className="dropdown-trigger" href="#!" data-target={this.props.mobile ? "mobile-user-dropdown" : "main-user-dropdown"}>
              {this.props.user.email}<i className="material-icons right">arrow_drop_down</i>
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul id={this.props.sidenav ? "nav-mobile" : "nav-main"} className={this.props.mobile ? "sidenav" : "right hide-on-med-and-down"}>
          <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
          </li>
          <li>
            <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
          </li>
        </ul>
      );
    }
  }
}

const UserDropDown = (props) => {
  return (
    <ul id={props.mobile ? "mobile-user-dropdown" : "main-user-dropdown"} className="dropdown-content">
      <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>
      <li className="divider"></li>
      <li><a href="#!" onClick={props.firebase.doSignOut}>Log Out</a></li>
    </ul>
  );
}

const Navigation = compose(
  withRouter,
  withFirebase,
)(NavigationBase);

export default Navigation;
