import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import M from 'materialize-css';

import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div className="container row">
    <h1 className="center">Sign In</h1>
    <SignInForm />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form className="col s12" onSubmit={this.onSubmit}>
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
        <button disabled={isInvalid} className="btn btn-large col s12 m4 offset-m4 l4 offset-l4 xl2 offset-xl5 waves-effect waves-light" type="submit" name="action">Submit
          <i className="material-icons right">send</i>
        </button>
        {error && <p className="col s12 center">{error.message}</p>}
      </form>
    );
  }
}

const SignInLink = () => (
  <p className="col s12 center">
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm, SignInLink };
