import utilities from './utilities';
import { AiFillDelete } from 'react-icons/ai'

function StockListItem(props) {
  
  const { stock } = props;
  const purchaseValueStr = utilities.formatNumber(stock.purchaseValue);
  const currentValueStr = utilities.formatNumber(stock.currentValue);
  
  const purchasePriceStr = utilities.formatNumber(stock.purchasePrice);
  const currentPriceStr = utilities.formatNumber(stock.currentPrice);
  
  const profitStr = utilities.formatNumber(stock.profit);
  const profitClass = stock.profit < 0 ? 'loss' : 'profit';
  
  const deleteStock = evt => {
    let ticker = evt.currentTarget.getAttribute('data-ticker')
    
    const api = 'https://omrdkfwqj6.execute-api.us-east-1.amazonaws.com/prod/delete-stock';
    
    const fetchOptions = {
      method: 'POST',
      cache: 'default',
      body: JSON.stringify({ticker: ticker})
    };
  
    fetch(api, fetchOptions)
      .then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(function(response) {
        props.portfolio(props.stocks);
      })
      .catch(function(error) {
        console.log(error);
      });
    };
  
  return (
    <tr>
      <td> <div onClick={deleteStock} data-ticker={stock.ticker} > <AiFillDelete /> </div> </td>
      <td>{stock.ticker}</td>
      <td>{stock.name}</td>
      <td>{stock.shares}</td>
      <td className="money">{purchasePriceStr}</td>
      <td className="money">{purchaseValueStr}</td>
      <td className="money">{currentPriceStr}</td>
      <td className="money">{currentValueStr}</td>
      <td className={"money "+profitClass}>{profitStr}</td>
    </tr>
  );
}

export default StockListItem;