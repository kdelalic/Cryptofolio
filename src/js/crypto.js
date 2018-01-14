import React, { Component } from 'react'
import '../css/crypto.css';
import Progress from './progress.js'
import Modal from 'material-ui/Modal'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import AddCoin from './addcoin.js';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {checkPos, toMonth} from './helpers.js'
import socketIOClient from "socket.io-client";
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { formatDate } from './helpers.js'
import Logo from '../img/logo.png'

const endpoint = "wss://streamer.cryptocompare.com";
const socket = socketIOClient(endpoint);

class Crypto extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
		    open: false,
		    convertCurrency: 'USD',
		    subscriptions: {},
		};
  	}

  	componentWillUpdate(nextProps, nextState) {
  		if(nextState.subscriptions !== this.state.subscriptions){
  			

	    	socket.on("m", data => {
	    		// console.log(data)

	    		for(var key in nextState.subscriptions) {
	    			const response = data.split("~")
	    			const newPrice = parseFloat(response[5])
	    			const symbol = this.state.coins[key].value.substring(this.state.coins[key].value.indexOf("(")+1,this.state.coins[key].value.indexOf(")")).toUpperCase()
	    			if(!isNaN(newPrice) && (newPrice > (this.state.coins[key].currentPrice * 0.5) && (newPrice < this.state.coins[key].currentPrice * 1.5)) && response[2] === symbol){
		    			this.setState({
		    				...this.state,
		    				coins: {
		    					...this.state.coins,
		    					[key]: {
		    						...this.state.coins[key],
		    						currentPrice: newPrice,
		    						profit: parseFloat(((newPrice - this.state.coins[key].price) * this.state.coins[key].amount).toFixed(2))
		    					}
		    				}
		    			})
	    			}
		 		}
		    });	    	
  		}
  	}

	handleOpen = () => {
	  this.setState({ ...this.state, open: true });
	};

	handleClose = () => {
	  this.setState({ ...this.state, open: false });
	};

	coinData = (dataFromChild, key) => {
		const addSub = "5~CCCAGG~" + dataFromChild.value.substring(dataFromChild.value.indexOf("(")+1,dataFromChild.value.indexOf(")")) + "~" + this.state.convertCurrency
        this.setState({
        	...this.state,
        	subscriptions: {
        		...this.state.subscriptions, 
        		[key]: addSub
        	},
        	coins: {
        		...this.state.coins,
        		[key]: dataFromChild
        	},
        }, () => {
        	socket.emit('SubAdd', { subs: this.state.subscriptions } ); 
	        this.handleClose();
        })
    };

    handleChange = event => {
    	socket.emit('SubRemove', { subs: this.state.subscriptions } ); 
		this.setState({
    		...this.state,
    		convertCurrency: event.target.value
    	}, () => {
    		const newSub = {}
	    	for (var key in this.state.subscriptions) {
	    		const splitSub = this.state.subscriptions[key].split("~")
	    		newSub[key] = splitSub[0] + "~" + splitSub[1] + "~" + splitSub[2] + "~" + event.target.value
	    	}
	    	this.setState({
	    		...this.state,
	    		subscriptions: newSub
	    	}, () => {
	    		socket.emit('SubAdd', { subs: this.state.subscriptions } ); 
	    	})
    	})
	}

	render() {
		const { coins } = this.state;
		return (
			<div className="crypto">
				<AppBar position="static" color="primary">
			        <Toolbar>
			          <IconButton color="contrast" aria-label="Menu">
			            <MenuIcon />
			          </IconButton>
			          <a href="/" className="logo"><img src={Logo}/></a>
			          <Typography type="title" color="inherit" className="middleTitle">
			            UNDER DEVELOPMENT ({formatDate()})
			          </Typography>
			          <div className="rightSettings">
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
				          <Button color="contrast">Login</Button>
			          </div>
			        </Toolbar>
			    </AppBar>
				<Progress coins={this.state.coins} convertCurrency={this.state.convertCurrency}/>
				<div className="header">
					<Paper className="table">
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
							                <TableCell className="cell">
							                	<div className="main">{coin.value}</div>
							                	<div className="subMain">{"(" + toMonth(coin.date.substring(5, 7)) + " " + coin.date.substring(8, 10) + ", " + coin.date.substring(0, 4) + ")"}</div>
							                </TableCell>
							                <TableCell className="cell">
							                	<div className="main">{this.state.convertCurrency + " " + coin.currentPrice.toFixed(2)}</div>
							                	<div className="subMain">{coin.amount + " @ " + coin.currency.toUpperCase() + " " + coin.price}</div>
							                </TableCell>
							                <TableCell numeric className="main">{this.state.convertCurrency + " " + (coin.currentPrice * coin.amount).toFixed(2)}</TableCell>
							                <TableCell numeric className={"main" + checkPos(coin.profit)}>{this.state.convertCurrency + " " + coin.profit}</TableCell>
							                <TableCell numeric className={"main" + checkPos(((parseFloat((coin.currentPrice - coin.price) * coin.amount) / (coin.amount * coin.price)) * 100).toFixed(2))}>{((parseFloat((coin.currentPrice - coin.price) * coin.amount) / (coin.amount * coin.price)) * 100).toFixed(2) + "%"}</TableCell>
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
		        	<AddCoin coinData={this.coinData} handleClose={this.handleClose} />
		        </Modal>
			</div>
		);
	}
}

export default Crypto;