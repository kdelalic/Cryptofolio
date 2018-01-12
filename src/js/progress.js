import React, { Component } from 'react';
import '../css/progress.css';
import Paper from 'material-ui/Paper';
import { checkPos } from './helpers.js'
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

function contains(obj, elem) {
	for (var i in obj){
		if (obj[i] === elem) return true;
	}
	return false;
}

class Progress extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	convertCurrency: 'USD',
		    initial: 0,
		    profit: 0,
		    holdings: 0,
		    change: 0,
		    addedCoins: []
		};
  	}

  	componentWillReceiveProps(nextProps) {
  		if (nextProps.convertCurrency !== this.props.convertCurrency) {
  			this.setState({
  				...this.state, 
  				convertCurrency: nextProps.convertCurrency
  			})
  		}
  		if (nextProps.coins !== this.props.coins) {
  			this.setState({
  				...this.state,
  				initial: 0,
			    profit: 0,
			    holdings: 0,
			    change: 0,
			    addedCoins: []
  			}, () => {
  				Object.keys(nextProps.coins).map((key) => {
	  				const coin = nextProps.coins[key]
	  				if(!contains(this.state.addedCoins, key) && coin.profit !== undefined){
	  					const { addedCoins } = this.state
	  					addedCoins.push(key)
		  				const profit = this.state.profit + coin.profit
		  				const initial = this.state.initial + coin.price * coin.amount
		  				const holdings = initial + profit
		  				const change = profit / initial  * 100
	  					this.setState({
	  						...this.state,
		  					initial: initial,
		  					profit: profit,
		  					holdings: holdings,
		  					change: change,
		  					addedCoins: addedCoins
		  				})
		  			}
  				})
  			})
  		}
  	}

	

	render() {
		const currency = this.state.convertCurrency === undefined ? "" : this.state.convertCurrency.toUpperCase();
		return (
			<div className="progress">
		        <div className="cards">
				    <Paper className="stat">
					    <div className="content">
					    	<h1 className={checkPos(this.state.initial)}>{currency + " " + this.state.initial.toFixed(2)}</h1>
					    	<h2>Initial Investment</h2>
				    	</div>
				    </Paper>
				    <Paper className="stat">
					    <div className="content">
					    	<h1 className={checkPos(this.state.profit)}>{currency + " " + this.state.profit.toFixed(2)}</h1>
					    	<h2>Profit/Loss</h2>
				    	</div>
				    </Paper>
				    <Paper className="stat">
					    <div className="content">
			                <h1 className={checkPos(this.state.holdings)}>{currency + " " + this.state.holdings.toFixed(2)}</h1>
			                <h2>Total Holdings</h2>
		                </div>
		            </Paper>
		            <Paper className="stat">
		            	<div className="content">
			                <h1 className={checkPos(this.state.change)}>{this.state.change.toFixed(2) + "%"}</h1>
			                <h2>Change</h2>
			            </div>
				    </Paper>
			    </div>
			</div>
		);
	}
}

export default Progress;
