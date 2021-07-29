import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});

const EXCHANGE_RATES = gql`
  query GetRates {
    rates(currency: "USD") {
      currency
    }
  }
`;

const SELECT_CURRENCY = gql`
  query GetExchangeRates($currency: String!) {
    rates(currency: $currency) {
      currency
      rate
    }
  }
`;

function ExchangeRates({ currency }) {
  const { loading, error, data } = useQuery(SELECT_CURRENCY, {
    variables: { currency },
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (data.rates == null) {
    return <p>No currency match search</p>;
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
  const { error, loading, data } = useQuery(EXCHANGE_RATES);
  const methods = useForm();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error : {error}</p>;

  if (data == null) {
    return <p>No Data</p>;
  }
  const options = [];
  data.rates.forEach((rate) => {
    options.push({ value: rate.currency, label: rate.currency });
  });
  console.log(options);

  return (
    <div>
      <h2>Search Crypto to See its Exchange Rates</h2>
      <Controller
        control={methods.control}
        defaultValue='USD'
        name="Search Crypto"
        render={({ value, ref }) => (
          <Select
            inputRef={ref}
            options={options}
            value={options.find((c) => c.value === value)}
            onChange={(val) => setSearchTerm(val.value)}
          />
        )}
      />

      <ExchangeRates currency={searchTerm || "USD"} />
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
