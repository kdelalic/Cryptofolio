import React, { Component } from 'react'
import '../css/crypto.css';
import Progress from './progress.js'
import Modal from 'material-ui/Modal'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import AddCoin from './addcoin.js';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { checkPos, toMonth } from './helpers.js'
import socketIOClient from "socket.io-client";
import axios from 'axios'
import { base } from './base.js'

class Crypto extends Component {
	constructor(props) {
		super(props);

		this.endpoint="wss://streamer.cryptocompare.com";
		this.socket = socketIOClient(this.endpoint);
		this.firebaseRef = base.initializedApp.firebase_;
		this.userID = this.firebaseRef.auth().currentUser.uid;

		this.state = {
			open: false,
			convertCurrency: 'USD',
			[this.userID]: {
				subscriptions: {},
				coins: {}
			}
		};
	}

	componentWillMount() {
		this.userRef = base.syncState(this.userID, {
			context: this,
			state: this.userID
		});
		axios.get("https://api.fixer.io/latest?base=USD")
			.then(response => {
				const CAD = response.data["rates"]["CAD"];

				this.setState({
				  	...this.state,
					CAD: CAD
				});
			})
			.catch(err => {               
	        	console.log(err)
		});
	}

	componentWillUnmount() {
		base.removeBinding(this.userRef);
		this.socket.emit('SubRemove', { subs: this.state[this.userID].subscriptions });
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state[this.userID] !== undefined && nextState[this.userID] !== undefined && nextState[this.userID].subscriptions !== this.state[this.userID].subscriptions) {
			this.socket.on("m", data => {
				for (var key in nextState[this.userID].subscriptions) {
					const response = data.split("~")
					const newPrice = parseFloat(response[5])
					const symbol = this.state[this.userID].coins[key].value.substring(this.state[this.userID].coins[key].value.indexOf("(") + 1, this.state[this.userID].coins[key].value.indexOf(")")).toUpperCase()
					if (!isNaN(newPrice) && (newPrice > (this.state[this.userID].coins[key].currentPrice * 0.5) && (newPrice < this.state[this.userID].coins[key].currentPrice * 1.5)) && response[2] === symbol) {
						this.setState({
							...this.state,
							[this.userID]: {
								...this.state.userID,
								coins: {
									...this.state.coins,
									[key]: {
										...this.state[this.userID].coins[key],
										currentPrice: newPrice,
										profit: parseFloat(((newPrice - this.state[this.userID].coins[key].price * (this.state[this.userID].coins[key].currency.toUpperCase() === "USD" && this.state.convertCurrency === "CAD" ? this.state.CAD : this.state[this.userID].coins[key].currency.toUpperCase() === "CAD" && this.state.convertCurrency === "USD" ? 1 / this.state.CAD : 1)) * this.state[this.userID].coins[key].amount).toFixed(2))
									}
								}
							}
						})
					}
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.convertCurrency !== nextProps.convertCurrency) {
			this.socket.emit('SubRemove', { subs: this.state[this.userID].subscriptions });
			this.setState({
				...this.state,
				convertCurrency: nextProps.convertCurrency
			}, () => {
				const newSub = {}
				for (var key in this.state[this.userID].subscriptions) {
					const splitSub = this.state[this.userID].subscriptions[key].split("~")
					newSub[key] = splitSub[0] + "~" + splitSub[1] + "~" + splitSub[2] + "~" + this.state.convertCurrency
				}
				this.setState({
					...this.state,
					[this.userID]: {
						...this.state.userID,
						subscriptions: newSub
					}
				}, () => {
					this.socket.emit('SubAdd', { subs: this.state[this.userID].subscriptions });
				})
			})
		}
	}

	handleOpen = () => {
		this.setState({ ...this.state, open: true });
	};

	handleClose = () => {
		this.setState({ ...this.state, open: false }, () => {
			
		});
	};

	coinData = (dataFromChild, key) => {
		const addSub = "5~CCCAGG~" + dataFromChild.value.substring(dataFromChild.value.indexOf("(") + 1, dataFromChild.value.indexOf(")")) + "~" + this.state.convertCurrency
		this.setState({
			...this.state,
			[this.userID]: {
				...this.state.userID,
				subscriptions: {
					...this.state[this.userID].subscriptions,
					[key]: addSub
				},
				coins: {
					...this.state.coins,
					[key]: dataFromChild
				},
			}
		}, () => {
			this.socket.emit('SubAdd', { subs: this.state[this.userID].subscriptions });
			this.handleClose();
		})
	};

	handleChange = event => {
		this.socket.emit('SubRemove', { subs: this.state[this.userID].subscriptions });
		this.setState({
			...this.state,
			convertCurrency: event.target.value
		}, () => {
			const newSub = {}
			for (var key in this.state[this.userID].subscriptions) {
				const splitSub = this.state[this.userID].subscriptions[key].split("~")
				newSub[key] = splitSub[0] + "~" + splitSub[1] + "~" + splitSub[2] + "~" + event.target.value
			}
			this.setState({
				...this.state,
				subscriptions: newSub
			}, () => {
				this.socket.emit('SubAdd', { subs: this.state[this.userID].subscriptions });
			})
		})
	}

	render() {
		const { coins } = this.state[this.userID];
		return (
			<div className="crypto">
				<Progress coins={this.state[this.userID].coins} convertCurrency={this.state.convertCurrency} CAD={this.state.CAD} />
				<div className="header container">
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
											<TableCell>
												<div className="main">{coin.value}</div>
												<div className="subMain">{"(" + toMonth(coin.date.substring(5, 7)) + " " + coin.date.substring(8, 10) + ", " + coin.date.substring(0, 4) + ")"}</div>
											</TableCell>
											<TableCell className="currentPrice">
												<div className="main">{this.state.convertCurrency + " " + coin.currentPrice.toFixed(2)}</div>
												<div className="subMain">{coin.amount + " @ " + coin.currency.toUpperCase() + " " + coin.price}</div>
											</TableCell>
											<TableCell numeric className="main">{this.state.convertCurrency + " " + (coin.currentPrice * coin.amount).toFixed(2)}</TableCell>
											<TableCell numeric className={"main" + checkPos(coin.profit)}>{this.state.convertCurrency + " " + coin.profit}</TableCell>
											<TableCell numeric className={"main" + checkPos(((coin.profit / (coin.amount * coin.currentPrice)) * 100).toFixed(2))}>{((coin.profit / (coin.amount * coin.currentPrice)) * 100).toFixed(2) + "%"}</TableCell>
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