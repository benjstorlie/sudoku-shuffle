import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import logo from "./logo.svg";
import "./App.css";
import Header1 from './components/nav/Header';
import Footer from './components/nav/Footer';
import SudokuGrid from './components/game/SudokuGrid';
import GameProvider from './utils/GameContext'
import Controls from './components/game/Controls';

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
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <Header1 />
          <div className="container">
            <Routes>
              <Route path="/" element={
                <GameProvider> 
                  <SudokuGrid /> 
                  <Controls /> 
                </GameProvider>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/me" element={<Profile />} />
              <Route path="/profiles/:profileId" element={<Profile />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
