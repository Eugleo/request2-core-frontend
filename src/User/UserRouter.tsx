import React from 'react';
import { Route, Routes } from 'react-router';

import { EditUser } from './EditUser';
import { NewUser } from './NewUser';
import { UserList } from './UserList';

export function UserRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<UserList />} />
      <Route path=":id/edit" element={<EditUser />} />
      <Route path="new" element={<NewUser />} />
    </Routes>
  );
}
