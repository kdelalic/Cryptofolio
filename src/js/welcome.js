import React, { Component } from 'react';
import '../css/welcome.css';
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Logo from '../img/logo.png'

class Welcome extends Component {

    render() {
        return(
            <div className="welcome">
                <Paper className="login">
                    <img src={Logo} alt="logo"/>
                    <h1>Cryptofolio</h1>
                    <div className="buttons">
                        <Button raised className="facebook" onClick={this.props.handleLogin("facebook")}><i className="fab fa-facebook-f"></i> <div>Sign-in with Facebook</div></Button>
                        <Button raised className="google" onClick={this.props.handleLogin("google")}><i className="fab fa-google"></i> <div>Sign-in with Google</div></Button>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default Welcome;