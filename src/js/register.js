import React, { Component } from 'react';
import '../css/register.css';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton';

class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: '',
            confirm: '',
            format: false,
            wrong: false,
            short: false
        }
    }

    handleChange = name => event => {
        this.setState({
			[name]: event.target.value,
		});
		event.preventDefault();
    }

    handleSubmit = event => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        this.setState({
            ...this.state,
            format: false,
            wrong: false,
            short: false
        }, () => {
            if(!re.test(this.state.username.toLowerCase())) {
                this.setState({
                    ...this.state,
                    format: true
                })
            } else if(this.state.password !== this.state.confirm || this.state.password.length <= 6) {
                if(this.state.password !== this.state.confirm){
                    this.setState({
                        ...this.state,
                        wrong: true
                    })
                }
                if(this.state.password.length < 6){
                    this.setState({
                        ...this.state,
                        short: true
                    })
                }
            } else  {
                const newUser = {
                    username: this.state.username,
                    password: this.state.password
                }
                console.log(newUser)
                this.props.userRegister(newUser)
            }
        })
        event.preventDefault();
    }


    render() {
        return(
            <div className="register">
                <div className="header">
					<h2>Register</h2>
					<IconButton className="closeButton" onClick={this.props.handleClose}>
						<Icon>close</Icon>
					</IconButton>
				</div>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        required
                        error={this.state.format}
                        className="loginInput"
                        id="username"
                        label="Email"
                        margin="normal"
                        value={this.state.username}
                        onChange={this.handleChange("username")}
                    />
                    <p className={this.state.format ? "visible" : ""}>Please enter a valid email address.</p>
                    <TextField
                        required
                        error={this.state.short}
                        className="loginInput"
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        value={this.state.password}
                        onChange={this.handleChange("password")}
                    />
                    <p className={this.state.short ? "visible" : ""}>Enter a password longer than 5 characters.</p>
                    <TextField
                        required
                        error={this.state.wrong}
                        className="loginInput"
                        id="confirm"
                        label="Confirm Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        value={this.state.confirm}
                        onChange={this.handleChange("confirm")}
                    />
                    <p className={this.state.wrong ? "visible" : ""}>Please check that the passwords match.</p>
                    <Button raised className="normal" color="primary" type="submit">Register</Button>
                </form>
            </div>
        )
    }
}

export default Register;