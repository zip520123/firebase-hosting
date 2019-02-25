import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp'
import { withFirebase } from '../Firebase'
import { PasswordForgetLink } from '../PasswordForget';
import * as ROUNTES from '../../constants/routes'
const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;
const SignInPage = () => (
  <>
    <h1>Sign In</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <PasswordForgetLink />
    <SignUpLink />
  </>
)
const INITIAL_STATE = {
  email:'',
  password:'',
  error: null
}
class SignInFormBase extends Component {
  constructor(props){
    super(props)
    this.state = { ...INITIAL_STATE }
  }
  onSubmit = e => {
    e.preventDefault()
    const {email, password} = this.state
    this.props.firebase
    .doSignInWithEmailAndPassword(email, password)
    .then(()=>{
      this.setState({...INITIAL_STATE})
      this.props.history.push(ROUNTES.HOME)
    })
    .catch(error=>{
      this.setState({error})
    })
    
  }
  onChange = e => {
    this.setState({ [e.target.name]:e.target.value})
  }
  render(){
    const { email, password, error } = this.state
    const isInvalid = password === '' || email ===''
    return (
      <form onSubmit={this.onSubmit}>
        <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email Address" />
        <input name="password" value={password} onChange={this.onChange} type="password" placeholder="Password" />
        <button disabled={isInvalid} type="submit">Sign In</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
class SignInGoogleBase extends Component {
  constructor(props){
    super(props)
    this.state = { error : null}
  }
  onSubmit = e => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase
          .user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: []
          })
        
      })
      .then(() => {
        this.setState({ error: null })
        this.props.history.push(ROUNTES.HOME)
      })
      .catch(error =>{
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS
        }
        this.setState({ error })
      })
    e.preventDefault()
  }
  render(){
    const { error } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign in with Google</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.props.firebase.doSignInWithFacebook()
    .then(socialAuthUser => {
      // Create a user in your Firebase Realtime Database too
      return this.props.firebase
        .user(socialAuthUser.user.uid)
        .set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: []
        })
    })
    .then(() => {
      this.setState( {error: null} )
      this.props.history.push(ROUNTES.HOME)
    })
    .catch(error => {
      this.setState({ error })
    })
  }
  render(){
    const { error } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <button type="subimit">Sign In with Facebook</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
const SignInForm = compose(withRouter,withFirebase)(SignInFormBase)
const SignInGoogle = compose(withRouter,withFirebase,)(SignInGoogleBase)
const SignInFacebook = compose(withRouter, withFirebase)(SignInFacebookBase)
export default SignInPage
export { SignInForm, SignInGoogle, SignInFacebook }
