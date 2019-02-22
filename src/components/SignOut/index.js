import React from 'react'
import { withFirebase } from '../Firebase'
const SignOutButton = ({firebase}) => (
    <button type="button" onClick={()=>{
        console.log("sign out")
        firebase.doSignOut()}
    }>
     Sign Out
    </button>
)
export default withFirebase(SignOutButton)
    