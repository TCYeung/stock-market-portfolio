import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import StockList from './StockList';
import getPortfolio from './getPortfolio';
import createTickerList from './createTickerList';
import getStockPrice from './getStockPrice';
import utilities from './utilities';
import AddStockForm from './AddStockForm';

function App() {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Tsz Chung');
  
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [tickerList, setTickerList] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [showAddStockForm, setAddStockForm] = useState(false);
  
  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    getPortfolio(setStocks);
  }, []);
  
  useEffect(() => {
    setTickerList(createTickerList(stocks));
  }, [stocks]);
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
  let promises = tickerList.map(ticker => getStockPrice(ticker));
  Promise.all(promises)
    .then(stocks => {
      const stockPrices = stocks.reduce((obj, stock) => {
        const info = {
          name: stock.data ? stock.data.longName : null,
          price: stock.data ? stock.data.regularMarketPrice : null
        };
        obj[stock.ticker] = info;
        return obj;
      }, {});
      setStockPrices(stockPrices);
    });
}, [tickerList]);

  useEffect(() => {
    let formatted = stocks.reduce((obj, stock) => {
      let info = { ticker: stock.ticker, shares: stock.shares, purchasePrice: stock.purchasePrice };
      if (typeof stockPrices[stock.ticker] !== "undefined") {
        info.name = stockPrices[stock.ticker].name;
        info.currentPrice = stockPrices[stock.ticker].price;
        info.purchaseValue = stock.shares * stock.purchasePrice;
        info.currentValue = info.shares * info.currentPrice;
        info.profit = info.currentValue - info.purchaseValue;
        info.formattedPurchaseValue = utilities.formatNumber(info.purchaseValue);
        info.formattedCurrentValue = utilities.formatNumber(info.currentValue);
        info.formattedProfit = utilities.formatNumber(info.profit);
      }
      obj[stock.ticker] = info;
      return obj;
    }, []);
    let array = [];
    Object.keys(formatted).map(function(key, index) {
      array.push(formatted[key]);
      return key;
    });
    setPortfolioData(array);
  }, [stocks, stockPrices]);

  const addStock = evt => {
    setAddStockForm(value => !value);
  };

  if (showAddStockForm) {
    return (<AddStockForm portfolio={getPortfolio} stocks={setStocks} setForm={setAddStockForm} / >);
  } else {
    return (
      <div className="App">
        <Card>
          <CardHeader className="card-header-color">
            <h4>{myName}'s Stock Portfolio</h4>
          </CardHeader>
          <CardBody>
            <StockList data={portfolioData} portfolio={getPortfolio} stocks={setStocks} />
          </CardBody>
          <CardFooter>
            <Button size="sm" onClick={addStock}>Add stock</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default App;