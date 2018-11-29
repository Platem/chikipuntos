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
        <nav>
          <div className="nav-wrapper">
            <Link className="brand-logo" to={ROUTES.LANDING}>Chikipuntos</Link>
            <Menu user={authUser} />
          </div>
          <UserDropDown user={authUser} firebase={props.firebase} />
        </nav>
      }
    </AuthUserContext.Consumer>
  );
}

class Menu extends Component {
  componentDidMount() {
    M.AutoInit();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    M.AutoInit();
  }

  render() {
    if (this.props.user) {
      return (
        <ul id="nav-mobile" className="right">
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.ADMIN}>Admin</Link>
          </li>
          <li>
            <a id="nav-user-dropdown" className="dropdown-trigger" href="#!" data-target="user-dropdown">
              {this.props.user.email}<i className="material-icons right">arrow_drop_down</i>
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul id="nav-mobile" className="right">
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
    <ul id="user-dropdown" className="dropdown-content">
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
