import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignInLink } from '../SignIn';
import { withFirebase } from '../Firebase';
import M from 'materialize-css';

import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <div className="container row">
    <h1 className="center">Sign Up</h1>
    <SignUpForm />
    <SignInLink />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    const { username, email, password } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    M.updateTextFields();
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      password,
      error,
    } = this.state;

    return (
      <form className="col s12" onSubmit={this.onSubmit}>
        <div className="input-field col s12 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
          <input
            name="username"
            id="username"
            type="text"
            value={username}
            onChange={this.onChange}
            className="validate"
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="input-field col s12 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
          <input
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={this.onChange}
            className="validate"
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field col s12 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
          <input
            name="password"
            id="password"
            type="password"
            value={password}
            onChange={this.onChange}
            className="validate"
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-large col s12 m4 offset-m4 l4 offset-l4 xl2 offset-xl5 waves-effect waves-light" type="submit" name="action">Submit
          <i className="material-icons right">send</i>
        </button>
        {error && <p className="col s12 center">{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="col s12 center">
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
