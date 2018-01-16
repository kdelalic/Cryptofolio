import React, { Component } from 'react';
import '../css/app.css';
import Crypto from './crypto.js'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import amber from 'material-ui/colors/amber';
import lightBlue from 'material-ui/colors/lightBlue';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Logo from '../img/logo.png'
import Button from 'material-ui/Button';
import { base } from './base.js'
import Welcome from './welcome.js'
import {CircularProgress} from 'material-ui/Progress'

const theme = createMuiTheme({
	palette: {
		primary: amber,
		secondary: lightBlue,
	},
});

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			convertCurrency: 'USD',
			open: false,
			anchorEl: null,
			user: null,
			loading: true
		};

		this.firebaseRef = base.initializedApp.firebase_;
	}
	componentWillMount() {
		this.firebaseRef.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					...this.state,
					user: user,
					loading: false,
				})
			} else {
				this.setState({
					...this.state,
					loading: false
				})
			}
		});
	}

	handleChange = event => {
		this.setState({
			...this.state,
			convertCurrency: event.target.value
		})
	}

	handleOpen = () => {
		this.setState({ ...this.state, open: true });
	};

	handleClose = () => {
		this.setState({ ...this.state, open: false });
	};

	handleOpenLogin = event => {
		this.setState({ ...this.state, anchorEl: event.currentTarget });
	};

	handleLogin = site => event => {
		var provider = null
		if(site === "facebook") {
			provider = new this.firebaseRef.auth.FacebookAuthProvider();
		} else if (site === "google") {
			provider = new this.firebaseRef.auth.GoogleAuthProvider();
		}

		this.firebaseRef.auth().signInWithPopup(provider).then(result => {
			this.setState({
				...this.state,
				user: result.user
			})
		});
		
		this.setState({ ...this.state, anchorEl: null });
		event.preventDefault();
	};

	handleClose = () => {
		this.setState({ ...this.state, anchorEl: null });
	};

	handleLogout = () => {
		this.firebaseRef.auth().signOut().then( () => {
			this.setState({
				user: null
			})
		  }).catch(function(error) {
			console.log("LOGOUT ERROR" + error)
		});
	}

	userPass = dataFromChild => {
		this.firebaseRef.auth().signInWithEmailAndPassword(dataFromChild.username, dataFromChild.password).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode + ": " + errorMessage)
		});
		
	}

	userRegister = dataFromChild => {
		this.firebaseRef.auth().createUserWithEmailAndPassword(dataFromChild.username, dataFromChild.password).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode + ": " + errorMessage)
		});
	}

	render() {
		return (
			<div className="app">
				<MuiThemeProvider theme={theme}>
					<AppBar position="static" color="primary">
						<Toolbar>
							<a href="/" className="logo"><img src={Logo} alt="logo" /></a>
							{this.state.user && <div className="rightSettings">
								<FormControl className="currencySelect">
									<InputLabel htmlFor="convertCurrency">Currency</InputLabel>
									<Select
										value={this.state.convertCurrency}
										onChange={this.handleChange}
										input={<Input name="convertCurrency" id="convertCurrency" />}
									>
										<MenuItem value={"USD"}>USD</MenuItem>
										<MenuItem value={"CAD"}>CAD</MenuItem>
									</Select>
								</FormControl>
								<Button color="contrast" onClick={this.handleLogout}>Logout</Button>
							</div>}
						</Toolbar>
					</AppBar>
					{this.state.loading ? <CircularProgress className="loading" color="accent" /> : (this.state.user === null ? <Welcome handleLogin={this.handleLogin} userPass={this.userPass} userRegister={this.userRegister}/> : <Crypto convertCurrency={this.state.convertCurrency}/>) }
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
