import React from 'react';

import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

const AdminPage = () => (
  <div className="container row">
    <h1 className="center">Admin</h1>
    <p className="center">
      Restricted area! Only users with the admin role are authorized.
    </p>
  </div>
);

const condition = authUser =>
  authUser && authUser.roles && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(AdminPage);
