import React, { Component } from 'react';
import '../css/progress.css';
import Paper from 'material-ui/Paper';
import { checkPos } from './helpers.js'

class Progress extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	convertCurrency: 'USD',
		    initial: 0,
		    profit: 0,
		    holdings: 0,
		    change: 0,
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
			var profit = 0
			var initial = 0
			var holdings = 0
			var change = 0
			for (var key in nextProps.coins){
  				const coin = nextProps.coins[key]
  				if(coin.profit !== undefined){
	  				profit = profit + coin.profit
	  				initial = initial + coin.price * coin.amount
	  				holdings = initial + profit
	  				change = profit / initial  * 100
	  			}
			}
			this.setState({
				...this.state,
				initial: initial,
				profit: profit,
				holdings: holdings,
				change: change,
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
