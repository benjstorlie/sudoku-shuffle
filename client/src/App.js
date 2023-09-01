import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GameProvider from './utils/GameContext';

import Container from 'react-bootstrap/Container'

import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Game from "./pages/Game"
import Header from './components/nav/Header';
import Footer from './components/nav/Footer';

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <GameProvider>
        <Router>
          <div className="flex-column justify-flex-start min-100-vh">
            <Header />
            <Container fluid id="main">
              <Routes>
                <Route path="/" element={<Game />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/me" element={<Profile />} />
                <Route path="/profiles/:profileId" element={<Profile />} />
              </Routes>
            </Container>
            <Footer />
          </div>
        </Router>
      </GameProvider>
    </ApolloProvider>
  );
}

export default App;
