import React, { Component } from 'react';
import '../css/loader.css'

const Loader = (WrappedComponent) => {
	return class Loader extends Component {
		render() {
			console.log(this.props)
			return this.props.coins ? <div className='loader'></div> : <WrappedComponent {...this.props}/>
		}
	}
}

export default Loader