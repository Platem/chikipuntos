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
        {user.roles.includes(ROLES.ADMIN) ?
          (loading ? <p className="center">Loading ...</p> : <UserList users={users} />) :
          <p className="center">Restricted access ...</p>
        }
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul className="collection">
    {users.map(user => (
      <li key={user.uid} className="collection-item avatar">
        <img src="images/.jpg" alt="" className="circle"></img>
        <span className="title">{user.username} ({user.email})</span>
        <p className="id">{user.uid}</p>
        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
      </li>
    ))}
  </ul>
);

const condition = authUser => !!authUser;

const AdminPage = compose(
  withAuthorization(condition),
)(AdminPageBase);

export default AdminPage;
