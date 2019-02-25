import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account : {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
    
  </AuthUserContext.Consumer>
  
);
// const condition = authUser => authUser != null;
const condition = authUser => !!authUser;

// role-based authorization
// const condition = authUser => authUser.role === 'ADMIN';

// permission-based authorization
// const condition = authUser => authUser.permissions.canEditAccount;

export default withAuthorization(condition)(AccountPage);