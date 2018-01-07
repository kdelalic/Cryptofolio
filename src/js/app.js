import React, { Component } from 'react';
import '../css/app.css';
import Crypto from './crypto.js'
import Progress from './progress.js'

class App extends Component {
	render() {
		return (
			<div className="app">
				<Progress/>
				<Crypto/>
			</div>
		);
	}
}

export default App;
