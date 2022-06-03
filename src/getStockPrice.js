function getStockPrice(ticker) {
  
  const api = 'https://omrdkfwqj6.execute-api.us-east-1.amazonaws.com/prod/get-stock-price';
  
  const fetchOptions = {
    method: 'POST',
    cache: 'default',
    body: JSON.stringify({ticker: ticker})
  };
  
  return fetch(api, fetchOptions)
    .then(function(response) {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(function(response) {
      let data = { ticker: response.ticker,  data: response.data };
      return data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

export default getStockPrice;