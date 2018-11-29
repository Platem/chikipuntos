import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import M from 'materialize-css';
import SignOutButton from '../SignOut';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  user: null
}

class NavigationBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.dropdown();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.dropdown();
  }

  dropdown() {
    M.Dropdown.init(document.querySelectorAll('#nav-user-dropdown'));
  }

  render() {
    let user = this.props.authUser;

    return (
      <nav>
        <div className="nav-wrapper">
          <Link className="brand-logo" to={ROUTES.LANDING}>Chikipuntos</Link>
          <Menu user={user} />
        </div>
        <UserDropDown user={user} firebase={this.props.firebase} />
      </nav>
    );
  }
}

const Menu = (props) => {
  if (props.user) {
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
            {props.user.email}<i className="material-icons right">arrow_drop_down</i>
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
