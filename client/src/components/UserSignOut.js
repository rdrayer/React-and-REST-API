import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({context}) => {
  //Removes cookies and state from authenticated user and redirects back to main courses page.
  context.actions.signOut();

  return (
    <Redirect to="/" />
  );
}
