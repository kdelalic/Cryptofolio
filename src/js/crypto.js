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


class Crypto extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
		    open: false,
		    convertCurrency: 'USD',
		    subscriptions: {},
		    endpoint: "wss://streamer.cryptocompare.com",
		};
  	}

  	componentWillUpdate(nextProps, nextState) {
  		if(nextState.subscriptions !== this.state.subscriptions){
  			const { endpoint } = this.state;
	    	const socket = socketIOClient(endpoint);
	    	console.log(this.state.subscriptions)
  			socket.emit('SubRemove', { subs: this.state.subscriptions }, (data) => {
  				socket.emit('SubAdd', { subs: nextState.subscriptions } ); 
	    	socket.on("m", data => {
	    		Object.keys(nextState.subscriptions).map((key) => {
	    			const response = data.split("~")
	    			const newPrice = parseFloat(response[5])
	    			const symbol = this.state.coins[key].value.substring(this.state.coins[key].value.indexOf("(")+1,this.state.coins[key].value.indexOf(")")).toUpperCase()
	    			if(!isNaN(newPrice) && !(Math.abs(newPrice - this.state.coins[key].currentPrice) > newPrice * 0.2) && !(Math.abs(newPrice - this.state.coins[key].currentPrice) > newPrice * 0.8) && response[2] === symbol){
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
	    			return true
		 		})
		    });
  			} ); 
	    	
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
	        this.handleClose();
        })
    };

    updateCurrency = (dataFromChild) => {
    	this.setState({
    		...this.state,
    		convertCurrency: dataFromChild
    	}, () => {
    		const newSub = {}
	    	for (var key in this.state.subscriptions) {
	    		const splitSub = this.state.subscriptions[key].split("~")
	    		newSub[key] = splitSub[0] + "~" + splitSub[1] + "~" + splitSub[2] + "~" + dataFromChild
	    	}
	    	this.setState({
	    		...this.state,
	    		subscriptions: newSub
	    	}, () => {
	    	})
    	})
    	
    }

	render() {
		const { coins } = this.state;
		return (
			<div className="crypto">
				<AppBar position="static">
			        <Toolbar>
			          <IconButton color="contrast" aria-label="Menu">
			            <MenuIcon />
			          </IconButton>
			          <Typography type="title" color="inherit">
			            Cryptofolio
			          </Typography>
			          <Typography type="title" color="inherit" className="middleTitle">
			            UNDER DEVELOPMENT
			          </Typography>
			          <Button color="contrast" className="loginButton">Login</Button>
			        </Toolbar>
			    </AppBar>
				<Progress coins={this.state.coins} updateCurrency={this.updateCurrency}/>
				<div className="header">
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
							                <TableCell className="cell">
							                	<div className="main">{coin.value}</div>
							                	<div className="subMain">{"(" + toMonth(coin.date.substring(5, 7)) + " " + coin.date.substring(8, 10) + ", " + coin.date.substring(0, 4) + ")"}</div>
							                </TableCell>
							                <TableCell className="cell">
							                	<div className="main">{this.state.convertCurrency + " " + coin.currentPrice}</div>
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
		        	<AddCoin coinData={this.coinData}/>
		        </Modal>
			</div>
		);
	}
}

export default Crypto;