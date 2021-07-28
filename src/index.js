import React from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache()
});

const EXCHANGE_RATES = gql`
  query GetExchangeRates($currency: String!) {
    rates(currency: $currency) {
      currency
      rate
    }
  }
`;


function ExchangeRates({ currency }) {

  const { loading, error, data } = useQuery(EXCHANGE_RATES, {
    variables: { currency },
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (data.rates == null) {
    return <p>No currencys match search</p>;
  }
  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}


function App() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  return (
    <div>
      <h2>Search Crypto to See its Exchange Rates</h2>
      <input
        type="text"
        placeholder="Search defaults to USD"
        value={searchTerm}
        onChange={handleChange}
      />
      <ExchangeRates currency={searchTerm || 'USD'}/>
    </div>
  );
}


render(

  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
