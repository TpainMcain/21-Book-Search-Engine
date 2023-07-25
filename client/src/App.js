import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost'
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Apollo Client configuration
const client = new ApolloClient({
  request: (operation) => {
    // Get the token from local storage
    const token = localStorage.getItem("id_token");

    // Set the authorization header with the token (if available)
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql", // The URI to the GraphQL server endpoint
});

function App() {
  return (
    // Wrapping the entire application with ApolloProvider to provide Apollo Client functionality to components
    <ApolloProvider client={client}>
      {/* Router component to handle client-side routing */}
      <Router>
        <>
          {/* The Navbar component that will be displayed on all pages */}
          <Navbar />
          {/* Switch component to render the first matching Route */}
          <Switch>
            {/* Route for the SearchBooks page (exact path: '/') */}
            <Route exact path='/' component={SearchBooks} />
            {/* Route for the SavedBooks page (exact path: '/saved') */}
            <Route exact path='/saved' component={SavedBooks} />
            {/* Default route for handling wrong page URLs */}
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
