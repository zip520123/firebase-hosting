import React, { Component } from 'react';
import { AuthUserContext, withAuthorization, withAuthentication } from '../Session';

class MessagePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName : '',
            loading: false,
            currentMsg: '',
            msg: [],
            error: null
        }
    }
    componentDidMount() {
        this.props.firebase.user(this.props.authUser.uid).once('value')
        .then((snapshot)=>{
            console.log(snapshot)
            // var userName = snapshot.val()
            // this.setState({userName})
        })
        .catch(error =>{
            this.setState({ error })
        })

        // this.props.firebase.getMessage().on('value', snapshot => {
            // const msgObject = snapshot.val()

            // const msgList = Object.keys(msgObject).map(key => ({
            //     ...msgObject[key],
                
            // }))
        // })
        
    }
    componentWillUnmount(){
        this.props.firebase.getMessage().off()
    }
    sendMsg = (e) => {
        e.preventDefault()
        const { currentMsg } = this.state
        const { authUser } = this.props
        // this.props.firebase.addMessage(authUser.uid , currentMsg)
        // this.props.firebase.message.child(authUser.uid).set({
        //      : currentMsg
        // })
    }
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        const { userName, currentMsg, error } = this.state
        const isInvalid = currentMsg === ''
        return (
        <>
            {/* <AuthUserContext.Consumer>
                {authUser => (<>
                    <h1>Msg page :{authUser.email}</h1>
                    <h1>Msg page :{authUser.uid}</h1>
                    </>
                )}
            </AuthUserContext.Consumer> */}
            <h1>name: {userName}</h1>
            <form onSubmit={this.sendMsg}>
                <input type="text" name="currentMsg" value={currentMsg} onChange={this.onChange} placeholder="send msg"/>
                <button disabled={isInvalid} type="submit">
                    send
                </button>
                {error && <p>{error.message}</p>}
            </form>
        </>
            
                
        )
    }
}
const condition = authUser => !!authUser

export default withAuthentication(withAuthorization(condition)(MessagePage))