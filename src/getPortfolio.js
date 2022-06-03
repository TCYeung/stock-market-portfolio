function getPortfolio(setStocks) {
  const AWS_API_GATEWAY = 'https://omrdkfwqj6.execute-api.us-east-1.amazonaws.com/prod';
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + '/get-portfolio';
  
  const options = {
      method: 'POST',
      cache: 'default'
    };
  
  fetch(AWS_API_GATEWAY_GET_PORTFOLIO, options)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function(response) {
        let stockList = response.Items.map(item => {
          item.ticker = item.ticker.S;
          item.shares = item.shares.N;
          item.purchasePrice = item.purchasePrice.N;
          return item;
        });
        setStocks(stockList);
      })
      .catch(function(error) {
        console.log(error);
      });
}

export default getPortfolio;