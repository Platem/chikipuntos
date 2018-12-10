import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { CircularPreloader } from '../Preloader';
import { withAuthorization } from '../Session';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: { groups: [] },
      groups: [],
    }
  }

  createNewGroup(e) {
    e.preventDefault();
    const { user } = this.state;
    console.log(user);
    const newGroup = this.props.firebase.groups().push();
    const gid = newGroup.key;
    newGroup.set({
      name: 'New Group',
      people: [{
        uid: user.uid,
        score: 0,
        points: 10,
        roles: [ROLES.GROUP_ADMIN, ROLES.GROUP_USER]
      }]
    }, error => {
      if (!error) {
        this.props.firebase.user(user.uid).child(`groups/${gid}`).set({ gid: gid });
      }
    });
  }

  componentDidMount() {
    this.setState({ loading: true, });

    this.props.firebase.user(this.props.authUser.uid)
      .on('value', snapshot => {
        let user = snapshot.val();

        this.props.firebase.groups().once('value').then(snapshot => {
          let allGroups = snapshot.val();
          console.log(allGroups);

          let groups = [];
          for (let key in user.groups) {
            groups.push({
              ...allGroups[key],
              gid: key,
            });
          }

          this.setState({
            loading: false,
            user: {
              ...user,
              uid: this.props.authUser.uid
            },
            groups: groups,
          });
        });

      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.authUser.uif).off();
    this.props.firebase.groups().off();
  }

  render() {
    const { groups, loading } = this.state;

    return (
      <div className="container row">
        <ul className="collection with-header">
          <li className="collection-header">
            <div className="row">
              Groups <a href="#!" className="waves-effect waves-light btn" onClick={(e) => this.createNewGroup(e)}><i className="material-icons">add</i></a>
            </div>
          </li>
          {loading ? <CircularPreloader /> : (!groups || groups.length < 1 ? <li className="collection-item">No groups</li> : (
            groups.map(group => (
              <Link key={group.gid} className="collection-item" to={`${ROUTES.GROUP}/${group.gid}`}>
                <span className="title">{group.name}</span>
              </Link>
            )
            )))}
        </ul>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
