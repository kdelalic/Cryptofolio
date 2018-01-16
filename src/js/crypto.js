import React, { Component } from 'react'
import '../css/crypto.css';
import Progress from './progress.js'
import Modal from 'material-ui/Modal'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import Typography from 'material-ui/Typography'
import AddCoin from './addcoin.js';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { checkPos, toMonth } from './helpers.js'
import socketIOClient from "socket.io-client";
import axios from 'axios'
import { base } from './base.js'

const endpoint = "wss://streamer.cryptocompare.com";
const socket = socketIOClient(endpoint);

class Crypto extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			loginOpen: false,
			convertCurrency: 'USD',
			subscriptions: {},
			coins: {}
		};

		this.firebaseRef = base.initializedApp.firebase_;
	}

	componentWillMount() {
		this.coinsRef = base.syncState('coins', {
			context: this,
			state: 'coins'
		});
		this.subsRef = base.syncState('subscriptions', {
			context: this,
			state: 'subscriptions'
		});
		socket.emit('SubAdd', { subs: this.state.subscriptions });
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
		base.removeBinding(this.coinsRef);
		base.removeBinding(this.subsRef);
		socket.emit('SubRemove', { subs: this.state.subscriptions });
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.subscriptions !== this.state.subscriptions) {
			socket.on("m", data => {
				// console.log(data)
				for (var key in nextState.subscriptions) {
					const response = data.split("~")
					const newPrice = parseFloat(response[5])
					const symbol = this.state.coins[key].value.substring(this.state.coins[key].value.indexOf("(") + 1, this.state.coins[key].value.indexOf(")")).toUpperCase()
					if (!isNaN(newPrice) && (newPrice > (this.state.coins[key].currentPrice * 0.5) && (newPrice < this.state.coins[key].currentPrice * 1.5)) && response[2] === symbol) {
						this.setState({
							...this.state,
							coins: {
								...this.state.coins,
								[key]: {
									...this.state.coins[key],
									currentPrice: newPrice,
									profit: parseFloat(((newPrice - this.state.coins[key].price * (this.state.coins[key].currency.toUpperCase() === "USD" && this.state.convertCurrency === "CAD" ? this.state.CAD : this.state.coins[key].currency.toUpperCase() === "CAD" && this.state.convertCurrency === "USD" ? 1 / this.state.CAD : 1)) * this.state.coins[key].amount).toFixed(2))
								}
							}
						})
					}
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.user !== nextProps.user) {
			this.setState({
				...this.state,
				user: nextProps.user
			})
		}
		if (this.props.convertCurrency !== nextProps.convertCurrency) {
			socket.emit('SubRemove', { subs: this.state.subscriptions });
			console.log(nextProps.convertCurrency)
			this.setState({
				...this.state,
				convertCurrency: nextProps.convertCurrency
			}, () => {
				const newSub = {}
				for (var key in this.state.subscriptions) {
					const splitSub = this.state.subscriptions[key].split("~")
					newSub[key] = splitSub[0] + "~" + splitSub[1] + "~" + splitSub[2] + "~" + this.state.convertCurrency
				}
				this.setState({
					...this.state,
					subscriptions: newSub
				}, () => {
					socket.emit('SubAdd', { subs: this.state.subscriptions });
				})
			})
		}
	}

	handleOpen = () => {
		this.setState({ ...this.state, open: true });
	};

	handleClose = () => {
		this.setState({ ...this.state, open: false });
	};

	coinData = (dataFromChild, key) => {
		const addSub = "5~CCCAGG~" + dataFromChild.value.substring(dataFromChild.value.indexOf("(") + 1, dataFromChild.value.indexOf(")")) + "~" + this.state.convertCurrency
		this.handleClose();

		const userID = this.firebaseRef.auth().currentUser.uid;
		this.setState({
			...this.state,
			[userID] : {
				...this.state.userID,
				subscriptions: {
					...this.state.subscriptions,
					[key]: addSub
				},
				coins: {
					...this.state.coins,
					[key]: dataFromChild
				},
			}
		}, () => {
			socket.emit('SubAdd', { subs: this.state.subscriptions });
		})
	};

	handleChange = event => {
		socket.emit('SubRemove', { subs: this.state.subscriptions });
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
				socket.emit('SubAdd', { subs: this.state.subscriptions });
			})
		})
	}

	handleNotLogin = () => {
		this.setState({
			loginOpen: true,
		});
	}

	handleNotLoginClose = () => {
		this.setState({
			loginOpen: false,
		});
	}

	render() {
		const { coins } = this.state;
		return (
			<div className="crypto">
				<Progress coins={this.state.coins} convertCurrency={this.state.convertCurrency} CAD={this.state.CAD} />
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
					<Button fab mini color="primary" aria-label="add" onClick={this.state.user !== null ? this.handleOpen : this.handleNotLogin} className="add">
						<AddIcon />
					</Button>
					<Modal
						aria-labelledby="not-logged-in"
						aria-describedby="not-logged-in"
						open={this.state.loginOpen}
						onClose={this.handleNotLoginClose}
						>
						<div>
							<Typography type="subheading" id="simple-modal-description">
								Please login to use this function.
							</Typography>
							<Button raised onClick={this.handleNotLoginClose} color="primary">
								OK
							</Button>
						</div>
					</Modal>
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