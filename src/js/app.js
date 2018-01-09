import React, { Component } from 'react';
import '../css/app.css';
import Crypto from './crypto.js'

class App extends Component {
	render() {
		return (
			<div className="app">
				<Crypto/>
			</div>
		);
	}
}

export default App;
