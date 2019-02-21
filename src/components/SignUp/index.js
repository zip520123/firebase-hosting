import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUNTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose'
const SignUpPage = () => (
  <>
    <h1>SignUp</h1>
    <SignUpForm></SignUpForm>
  </>
)
const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
}
class SignUpFormBase extends Component {
  constructor(props){
    super(props)
    this.state = {...INITIAL_STATE}
  }
  onSubmit = e => {
    const {username, email, passwordOne} = this.state
    this.props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne).then(auth => {
      this.setState({ ...INITIAL_STATE})
      this.props.history.push(ROUNTES.HOME)
    }).catch(error =>{
      this.setState({ error })
    })
    e.preventDefault();
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state
    const isInvaild = 
      passwordOne !== passwordTwo || 
      passwordOne === '' || 
      email === '' || 
      username === ''
    
    return (
      <form onSubmit={this.onSubmit}>
        <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Full Name" />
        <input name="email" value={email} onChange={this.onChange} type="text" placeholder="email" />
        <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="password" />
        <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="confirm password" />
        <button disabled={isInvaild} type="submit">Sign Up</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUNTES.SIGN_UP}>Sign up</Link>
  </p>
)
const SignUpForm = compose(withRouter,withFirebase,)(SignUpFormBase)
export default SignUpPage
export { SignUpForm , SignUpLink}