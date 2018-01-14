import React, { Component } from 'react';
import '../css/app.css';
import Crypto from './crypto.js'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import amber from 'material-ui/colors/amber';
import lightBlue from 'material-ui/colors/lightBlue';


const theme = createMuiTheme({
  palette: {
    primary: amber, // Purple and green play nicely together.
    secondary: lightBlue,
  },
});

class App extends Component {
	render() {
		return (
			<div className="app">
				<MuiThemeProvider theme={theme}>
					<Crypto/>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
