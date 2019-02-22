import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp'
import { withFirebase } from '../Firebase'
import { PasswordForgetLink } from '../PasswordForget';
import * as ROUNTES from '../../constants/routes'
const SignInPage = () => (
  <>
    <h1>Sign In</h1>
    <SignInForm />
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
    console.log(this.state.email, this.state.password)
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
    console.log(this.state.email, this.state.password)
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
const SignInForm = compose(withRouter,withFirebase)(SignInFormBase)
export default SignInPage
export { SignInForm }
