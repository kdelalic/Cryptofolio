import React, { Component } from 'react';
import '../css/addcoin.css';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import coins from './coins.json';
import { LinearProgress } from 'material-ui/Progress';
import axios from 'axios'
import { formatDate } from './helpers.js'

const suggestions = coins;

function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
	  type="search"
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 1,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
});

var id = 1;

class AddCoin extends Component {

	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	value: 'Bitcoin (BTC)',
	    	amount: 2,
	    	price: 14000,
			currency: 'usd',
			priceType: 'per',
			date: formatDate(),
			suggestions: [],
  		};
  	}

	handleSuggestionsFetchRequested = ({ value }) => {
		this.setState({
		  suggestions: getSuggestions(value),
		});
	};

	handleSuggestionsClearRequested = () => {
		this.setState({
		  suggestions: [],
		});
	};

	handleChange = (event, { newValue }) => {
		this.setState({
		  value: newValue,
		});
		event.preventDefault()
	};

	handleInput = name => event => {
	    this.setState({
	      [name]: event.target.value,
	    });
  		event.preventDefault();
  	};

  	getCurrentPrice = event => {
		var url = "https://min-api.cryptocompare.com/data/price?fsym=" + this.state.value.substring(this.state.value.indexOf("(")+1,this.state.value.indexOf(")")).toUpperCase() + "&tsyms=" + this.state.currency.toUpperCase();
		this.setState({
		  	...this.state,
			loading: true
		});
		
		axios.get(url)
			.then(response => {
				const price = response.data[this.state.currency.toUpperCase()];
				const profit = parseFloat(((price - this.state.price) * this.state.amount).toFixed(2))

				this.setState({
				  	...this.state,
					currentPrice: price,
					profit: profit,
					loading: false
				}, () => {
					this.props.coinData(this.state, this.state.value.substring((this.state.value).indexOf("(")+1,(this.state.value).indexOf(")")) + "-" + id);
  					id++;
				});
			})
			.catch(err => {               
	        	console.log(err)
	        });		
  		event.preventDefault();
	};

	render() {
		const { classes } = this.props;
		return (
			<div className="addcoin">
				<div className="header"><h2>Add a Coin</h2></div>
				{this.state.loading && <LinearProgress />}
				<form autoComplete="off" onSubmit={this.getCurrentPrice}>
					<Autosuggest required id="required"
				        theme={{
				          container: classes.container,
				          suggestionsContainerOpen: classes.suggestionsContainerOpen,
				          suggestionsList: classes.suggestionsList,
				          suggestion: classes.suggestion,
				        }}
				        className="autocomplete"
				        renderInputComponent={renderInput}
				        suggestions={this.state.suggestions}
				        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
				        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
				        renderSuggestionsContainer={renderSuggestionsContainer}
				        getSuggestionValue={getSuggestionValue}
				        renderSuggestion={renderSuggestion}
				        inputProps={{
				          autoFocus: true,
				          classes,
				          placeholder: 'Type to search for a coin',
				          value: this.state.value,
				          onChange: this.handleChange,
				        }}
				    />
				    <TextField
			          required
			          id="required"
			          type="number" 
			          step="0.00000001" 
			          label="Amount"
			          className="amount"
			          margin="normal"
			          color={"#e74c3c"}
			          value={this.state.amount}
			          onChange={this.handleInput('amount')}
			        />
			        <TextField
			          required
			          id="required"
			          type="number" 
			          step="0.00000001" 
			          label="Trade Price"
			          className="tradePrice"
			          margin="normal"
			          value={this.state.price}
			          onChange={this.handleInput('price')}
			        />
			        <FormControl className="currency">
				        <InputLabel htmlFor="currency">Currency</InputLabel>
				        <Select
				            value={this.state.currency}
				            onChange={this.handleInput('currency')}
				            input={<Input name="currency" id="currency" />}
				        >
				            <MenuItem value="usd">USD</MenuItem>
				            <MenuItem value="cad">CAD</MenuItem>
				            <MenuItem value="btc">BTC</MenuItem>
				            <MenuItem value="eth">ETH</MenuItem>
				        </Select>
			        </FormControl>
			        <FormControl className="priceType">
				        <InputLabel htmlFor="priceType">Price Type</InputLabel>
				        <Select
				            value={this.state.priceType}
				            onChange={this.handleInput('priceType')}
				            input={<Input name="priceType" id="priceType" />}
				        >
				            <MenuItem value="total">Total Value</MenuItem>
				            <MenuItem value="per">Per Unit</MenuItem>
				        </Select>
			        </FormControl>
			        <TextField
				        id="date"
				        label="Trade Date"
				        type="date"
				        value={this.state.date}
				        className="date"
				        InputLabelProps={{
				          shrink: true,
				        }}
				        onChange={this.handleInput('date')}
				    />
			        <Button raised type="submit" color="primary" className="addCoinButton" disabled={this.state.loading}>
				        Add Coin
				    </Button>
			    </form>
			</div>
		);
	}
}

AddCoin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddCoin);
