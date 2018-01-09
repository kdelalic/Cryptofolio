import React, { Component } from 'react';
import '../css/progress.css';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

class Progress extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
		    initial: 0,
		    profit: 0,
		    holdings: 0,
		    change: "0%"
		};
  	}

  	componentWillReceiveProps(nextProps) {
  		if (nextProps.coins !== this.props.coins) {
  			nextProps && Object.keys(nextProps.coins).map((key) => {
  				const coin = nextProps.coins[key]
  				console.log(coin.currentPrice)
  				this.setState({
  					initial: this.state.initial + coin.price * coin.amount,
  					profit: parseFloat(this.state.profit + (coin.currentPrice - coin.price) * coin.amount).toFixed(2),
  					holdings: this.state.profit + this.state.holdings,
  					change: this.state.initial / this.state.profit * 100 + "%"
  				})
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
		return (
			<div className="progress">
				<Paper>
			    	<Table>
				        <TableHead>
					        <TableRow>
					            <TableCell numeric>Initial Investment</TableCell>
					            <TableCell numeric>Profit/Loss</TableCell>
					            <TableCell numeric>Total Holdings</TableCell>
					            <TableCell numeric>24hr Change</TableCell>
					        </TableRow>
				        </TableHead>
				        <TableBody children={TableRow}>
			                <TableRow>
				                <TableCell numeric className={this.checkPos(this.state.initial)}>{this.state.initial}</TableCell>
				                <TableCell numeric className={this.checkPos(this.state.profit)}>{this.state.profit}</TableCell>
				                <TableCell numeric className={this.checkPos(this.state.holdings)}>{this.state.holdings}</TableCell>
				                <TableCell numeric className={this.checkPos(this.state.change)}>{this.state.change}</TableCell>
				            </TableRow>
				        </TableBody>
			      	</Table>
			    </Paper>
			</div>
		);
	}
}

export default Progress;
