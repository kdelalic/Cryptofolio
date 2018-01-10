import React, { Component } from 'react'
import '../css/crypto.css';
import Progress from './progress.js'
import Modal from 'material-ui/Modal'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import AddCoin from './addcoin.js';
import axios from 'axios'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';



class Crypto extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
		    open: false,
		};
  	}

	getCurrentPrice = (key) => {
		const { coins } = this.state;
		var url = "https://min-api.cryptocompare.com/data/price?fsym=" + coins[key].value.substring(coins[key].value.indexOf("(")+1,coins[key].value.indexOf(")")).toUpperCase() + "&tsyms=" + coins[key].currency.toUpperCase();
		axios.get(url)
			.then(response => {
				const price = response.data[coins[key].currency.toUpperCase()];
				const profit = parseFloat(((price - coins[key].price) * coins[key].amount).toFixed(2))

				this.setState({
				  ...this.state,
				  coins: {
				    ...this.state.coins,
				    [key]: {
				      ...this.state.coins[key],
				      currentPrice: price,
				      profit: profit,
				    },
				  },
				});
			})
			.catch(err => {               
	        	console.log(err)
	        });		
	};

	checkPos = (num) => {
		if (num > 0) {
			return " positive"
		} else if (num < 0) {
			return " negative"
		} else {
			return ""
		}
	};

	handleOpen = () => {
	  this.setState({ ...this.state, open: true });
	};

	handleClose = () => {
	  this.setState({ ...this.state, open: false });
	};

	coinData = (dataFromChild, key) => {
		const newCoins = {
			...this.state.coins
		};
		newCoins[key] = dataFromChild
        this.setState({
        	...this.state,
        	coins: newCoins
        }, () => {
        	this.getCurrentPrice(key);
        	this.setState({
				...this.state,
			})
	        this.handleClose();
        })
    };

	render() {
		const { coins } = this.state;
		return (
			<div className="crypto">
				<Progress coins={this.state.coins}/>
				<div class="header">
					<Paper>
				    	<Table>
					        <TableHead children={TableRow}>
						        <TableRow>
						            <TableCell>Coin</TableCell>
						            <TableCell numeric>Current Price</TableCell>
						            <TableCell numeric>Total Value</TableCell>
						            <TableCell numeric>Profit/Loss</TableCell>
						            <TableCell numeric>Change</TableCell>
						        </TableRow>
					        </TableHead>
					        <TableBody children={TableRow}>
						        {coins && Object.keys(coins).map((key, index) => {
									const coin = coins[key]
						            return (
						                <TableRow key={`coin-${index}`}>
							                <TableCell className="coin">{coin.value}</TableCell>
							                <TableCell numeric className="price">{coin.currency.toUpperCase() + " " + coin.currentPrice}</TableCell>
							                <TableCell numeric className="total">{coin.currency.toUpperCase() + " " + (coin.currentPrice * coin.amount).toFixed(2)}</TableCell>
							                <TableCell numeric className={"profit" + this.checkPos(coin.profit)}>{coin.currency.toUpperCase() + " " + coin.profit}</TableCell>
							                <TableCell numeric className={"change" + this.checkPos(((parseFloat((coin.currentPrice - coin.price) * coin.amount) / (coin.amount * coin.price)) * 100).toFixed(2))}>{((parseFloat((coin.currentPrice - coin.price) * coin.amount) / (coin.amount * coin.price)) * 100).toFixed(2) + "%"}</TableCell>
						                </TableRow>
						            );
						        })}
					        </TableBody>
				      	</Table>
				    </Paper>
					<Button fab mini color="primary" aria-label="add" onClick={this.handleOpen} className="add">
				        <AddIcon />
				    </Button>
			    </div>
				<Modal
		          aria-labelledby="Add Coin"
		          aria-describedby="Add a Coin"
		          open={this.state.open}
		          onClose={this.handleClose}
		        >
		        	<AddCoin coinData={this.coinData}/>
		        </Modal>
			</div>
		);
	}
}

export default Crypto;