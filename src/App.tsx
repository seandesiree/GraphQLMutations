import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Posts from './Posts';

const client = new ApolloClient({
  uri: 'https://graphqlzero.almansi.me/api', 
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
    </ApolloProvider>
  );
};

export default App;
