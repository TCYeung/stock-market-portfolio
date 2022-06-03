import { useState, useEffect } from 'react';
import './App.css';
import { Button, Form, Input, Label } from 'reactstrap';
import StockList from './StockList';
import getPortfolio from './getPortfolio';
import createTickerList from './createTickerList';
import getStockPrice from './getStockPrice';
import utilities from './utilities';

function AddStockForm(props) {
  
  const [ticker, setTicker] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [shares, setShares] = useState('');
  const [isValid, setIsValid] = useState('');
  
  const addStock = evt => {
    const api = 'https://omrdkfwqj6.execute-api.us-east-1.amazonaws.com/prod/add-stock';
    
    const fetchOptions = {
      method: 'POST',
      cache: 'default',
      body: JSON.stringify({ticker: ticker, purchasePrice: purchasePrice, shares: shares})
    };
  
    fetch(api, fetchOptions)
      .then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(function(response) {
        console.log("add-stock complete");
        props.portfolio(props.stocks);
        props.setForm(false);
      })
      .catch(function(error) {
        console.log(error);
      });
    };

  const onChange = function(setFcn) {
    return function(evt) {
      setFcn(evt.currentTarget.value.toUpperCase());
    };
  };
  
  const cancelForm = evt => {
    props.setForm(false);
  };
  
  useEffect(() => {
    let isValid = (ticker.length > 0);              // ticker isn't blank
    isValid = isValid && (shares.length > 0);       // shares isn't blank
    isValid = isValid && (purchasePrice.length > 0);// purchasePrice isn't blank
    isValid = isValid && !/[^A-Z]/.test(ticker);    // ticker has letters only
    setIsValid(isValid);
  }, [ticker, shares, purchasePrice]);

  return (
    <div className="Form">
      <Form>
        <Label>Ticker:
          <Input value={ticker} onChange={onChange(setTicker)} />
        </Label>
        <Label>Purchase Price:
          <Input type="number" value={purchasePrice} onChange={onChange(setPurchasePrice)} />
        </Label>
        <Label>Number of Shares:
          <Input type="number" value={shares} onChange={onChange(setShares)} />
        </Label>
      </Form>
      <Button className="btn" onClick={cancelForm}>Cancel</Button>
      <Button className="btn" disabled={!isValid} onClick={addStock}>Submit</Button>
    </div>
  );
}

export default AddStockForm;