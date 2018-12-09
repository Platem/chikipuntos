import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';

import * as ROLES from '../../constants/roles';

class AdminPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      user: { roles: [] },
    };
  }

  componentDidMount() {
    this.setState({ loading: true, });

    this.props.firebase.user(this.props.authUser.uid).on('value', snapshot => {
      this.setState({
        user: snapshot.val(),
      });
    });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.authUser.uid).off();
    this.props.firebase.users().off();
  }

  render() {
    const { user, users, loading } = this.state;

    return (
      <div className="container row">
        <h1 className="center">Admin</h1>
        {user.roles.includes(ROLES.APP_ADMIN) ?
          (loading ? <p className="center">Loading ...</p> : <UserList users={users} firebase={this.props.firebase} />) :
          <p className="center">Restricted access ...</p>
        }
      </div>
    );
  }
}

const UserList = ({ users, firebase }) => (
  <table className="highlight responsive-table">
    <thead>
      <tr>
        <th>username</th>
        <th>email</th>
        {/* <th>active</th>
        <th>actions</th> */}
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.uid}>
          <td>{user.username}</td>
          <td>{user.email}</td>
          {/* <td>
            <div className="switch">
              <label htmlFor="">
                <input checked={user.active} type="checkbox" />
                <span className="lever"></span>
              </label>
            </div>
          </td>
          <td>
            <a className="waves-effect waves-light btn red" onClick={() => firebase.removeUser(user.uid)}><i className="material-icons">delete</i></a>
          </td> */}
        </tr>
      ))}
    </tbody>
  </table>
);

const condition = authUser => !!authUser;

const AdminPage = compose(
  withAuthorization(condition),
)(AdminPageBase);

export default AdminPage;
