import React, { Component } from 'react';
import '../css/register.css';
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon'
import IconButton from 'material-ui/IconButton';

class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: '',
            confirm: '',
            wrong: false
        }
    }

    handleChange = name => event => {
        this.setState({
			[name]: event.target.value,
		});
		event.preventDefault();
    }

    handleSubmit = event => {
        if(this.state.password !== this.state.confirm){
            this.setState({
                ...this.state,
                wrong: true
            })
        } else {
            const newUser = {
                username: this.state.username,
                password: this.state.password
            }
            this.props.userRegister(newUser)
            this.props.handleClose
        }
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
                    <TextField
                        required
                        className="loginInput"
                        id="confirm"
                        label="Confirm Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        value={this.state.confirm}
                        onChange={this.handleChange("confirm")}
                    />
                    <p className={this.state.wrong ? "wrong" : ""}>Please check that the passwords match.</p>
                    <Button raised className="normal" color="primary" type="submit">Register</Button>
                </form>
            </div>
        )
    }
}

export default Register;