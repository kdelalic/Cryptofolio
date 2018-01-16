import React, { Component } from 'react';
import '../css/login.css';
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField';
import Register from './register.js'
import Modal from 'material-ui/Modal'

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: '',
            open: false
        }
    }

    handleOpen = () => {
        this.setState({
            ...this.state,
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            open: false
        })
    }

    handleChange = name => event => {
        this.setState({
			[name]: event.target.value,
		});
		event.preventDefault();
    }

    handleSubmit = event => {
        this.props.userPass(this.state)
        event.preventDefault();
    }

    userRegister = dataFromChild => {
        this.handleClose()
        this.props.userRegister(dataFromChild);
    }

    render() {
        return(
            <div className="loginForm">
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        required
                        className="loginInput"
                        id="username"
                        label="Email"
                        margin="normal"
                        value={this.state.username}
                        onChange={this.handleChange("username")}
                    />
                    <TextField
                        required
                        className="loginInput"
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        value={this.state.password}
                        onChange={this.handleChange("password")}
                    />
                    <Button raised className="normal" type="submit">Log in</Button>
                </form>
                <Button raised className="registerButton" color="primary" onClick={this.handleOpen}>REGISTER</Button>
                <Modal
                    aria-labelledby="Register"
                    aria-describedby="Register"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <Register handleClose={this.handleClose} userRegister={this.userRegister} />
                </Modal>
            </div>
        )
    }
}

export default Login;