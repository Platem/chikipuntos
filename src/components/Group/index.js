import React, { Component } from 'react';

import { withAuthorization } from '../Session';

import { CircularPreloader } from '../Preloader';

class GroupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gid: props.match.params.id,
      loading: false,
      group: {},
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.group(this.state.gid).on('value', snapshot => {
      let group = snapshot.val();

      this.props.firebase.users().once('value').then(snapshot => {
        let allUsers = snapshot.val();
        console.log(allUsers);

        let users = [];
        for (let key in group.people) {
          let uid = group.people[key].uid;
          console.log("kasbdkas")
          users.push({
            ...allUsers[uid],
            uid: uid,
            score: group.people[key].score,
          });
        }

        console.log(users);

        this.setState({
          loading: false,
          group: {
            ...group,
            gid: this.state.gid,
          },
          people: users,
        });
      });
    })
  }

  componentWillUnmount() {
    this.props.firebase.group(this.props.match.params.id).off();
    this.props.firebase.users().off();
  }

  render() {
    const { loading, group, people } = this.state;

    return (
      <div className="container row">
        {(loading || !people) ? <CircularPreloader /> : (
          <div className="container row">
            <h1>{group.name}</h1>
            <PeopleList people={people} />
          </div>
        )}
      </div>
    );
  }
}

const PeopleList = ({ people }) => (
  <table className="responsible-table highlight">
    <thead>
      <tr>
        <th>name</th>
        <th>score</th>
        <th>actions</th>
      </tr>
    </thead>
    <tbody>
      {people.map(person => (
        <tr key={person.uid}>
          <td>{person.username}</td>
          <td>{person.score}</td>
          <td></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(GroupPage);
