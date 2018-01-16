import React, { Component } from 'react';
import '../css/welcome.css';
import Login from './login.js'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Logo from '../img/logo.png'

class Welcome extends Component {

    userPass = dataFromChild => {
        this.props.userPass(dataFromChild)
    }

    userRegister = dataFromChild => {
        this.props.userRegister(dataFromChild)
    }

    render() {
        return(
            <div className="welcome">
                <Paper className="login">
                    <img src={Logo} alt="logo"/>
                    <h1>Cryptofolio</h1>
                    <Login userPass={this.userPass} userRegister={this.userRegister}/>
                    <div className="buttons">
                        <Button raised className="facebook" onClick={this.props.handleLogin("facebook")}><i className="fab fa-facebook-f"></i> <div>Facebook</div></Button>
                        <Button raised className="google" onClick={this.props.handleLogin("google")}><i className="fab fa-google"></i> <div>Google</div></Button>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default Welcome;