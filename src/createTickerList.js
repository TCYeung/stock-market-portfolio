function createTickerList(stocks) {
  let tickerList = stocks.reduce(function(previousValue, currentValue) {
    return [...previousValue, currentValue.ticker];
  }, []);
  return tickerList;
}

export default createTickerList;