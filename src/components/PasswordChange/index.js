import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form className="col s12" onSubmit={this.onSubmit}>
        <div className="input-field col s12 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
          <input
            name="passwordOne"
            id="passwordOne"
            type="password"
            value={passwordOne}
            onChange={this.onChange}
            className="validate"
          />
          <label htmlFor="passwordOne">New Password</label>
        </div>
        <div className="input-field col s12 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
          <input
            name="passwordTwo"
            id="passwordTwo"
            type="password"
            value={passwordTwo}
            onChange={this.onChange}
            className="validate"
          />
          <label htmlFor="passwordTwo">Confirm New Password</label>
        </div>
        <button disabled={isInvalid} className="btn btn-large col s12 m4 offset-m4 l4 offset-l4 xl2 offset-xl5 waves-effect waves-light" type="submit" name="action">Reset
            <i className="material-icons right">Update</i>
        </button>
        {error && <p className="col s12 center">{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
