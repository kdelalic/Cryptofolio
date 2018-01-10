import React, { Component } from 'react';
import '../css/progress.css';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

Array.prototype.contains = function(elem) {
	for (var i in this){
		if (this[i] === elem) return true;
	}
	return false;
}

class Progress extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
		    initial: 0,
		    profit: 0,
		    holdings: 0,
		    change: 0,
		    addedCoins: []
		};
  	}

  	componentWillReceiveProps(nextProps) {
  		if (nextProps.coins !== this.props.coins) {
  			Object.keys(nextProps.coins).map((key) => {
  				const coin = nextProps.coins[key]

  				if(!this.state.addedCoins.contains(key) && coin.profit !== undefined){
  					const { addedCoins } = this.state
  					addedCoins.push(key)
	  				const profit = this.state.profit + coin.profit
	  				const initial = this.state.initial + coin.price * coin.amount
	  				const holdings = initial + profit
	  				const change = profit / initial  * 100
				
  					this.setState({
	  					initial: initial,
	  					profit: profit,
	  					holdings: holdings,
	  					change: change,
	  					currency: coin.currency,
	  				})
	  			}
  			})
  		}
  	}

  	checkPos = (num) => {
		if (num > 0) {
			return " positive"
		} else if (num < 0) {
			return " negative"
		} else {
			return ""
		}
	};

	render() {
		const currency = this.state.currency === undefined ? "" : this.state.currency.toUpperCase();
		return (
			<div className="progress">
				<Paper>
			    	<Table>
				        <TableHead>
					        <TableRow>
					            <TableCell numeric>Initial Investment</TableCell>
					            <TableCell numeric>Profit/Loss</TableCell>
					            <TableCell numeric>Total Holdings</TableCell>
					            <TableCell numeric>Change</TableCell>
					        </TableRow>
				        </TableHead>
				        <TableBody children={TableRow}>
			                <TableRow>
				                <TableCell numeric className={this.checkPos(this.state.initial)}>{currency + " " + this.state.initial.toFixed(2)}</TableCell>
				                <TableCell numeric className={this.checkPos(this.state.profit)}>{currency + " " + this.state.profit.toFixed(2)}</TableCell>
				                <TableCell numeric className={this.checkPos(this.state.holdings)}>{currency + " " + this.state.holdings.toFixed(2)}</TableCell>
				                <TableCell numeric className={this.checkPos(this.state.change)}>{this.state.change.toFixed(2) + "%"}</TableCell>
				            </TableRow>
				        </TableBody>
			      	</Table>
			    </Paper>
			</div>
		);
	}
}

export default Progress;
