import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div className="container row">
    <h1 className="center">Password Forget</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { email, error } = this.state;

    const isInvalid = email === '';

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
        <button disabled={isInvalid} className="btn btn-large col s12 m4 offset-m4 l4 offset-l4 xl2 offset-xl5 waves-effect waves-light" type="submit" name="action">Reset
          <i className="material-icons right">refresh</i>
        </button>
        {error && <p className="col s12 center">{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p className="col s12 center">
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
