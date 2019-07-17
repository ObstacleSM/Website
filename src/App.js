import ApolloClient from "apollo-boost";
import React from 'react';
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route } from "react-router-dom";

import './sass/app.scss';

import { Header } from './components/Header.js'
import { Latest, Maps, Players, Rankings, Servers } from './pages'

const client = new ApolloClient({
    uri: "http://127.0.0.1:8080/graphql",
});

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Header />

                <Route exact path="/" component={Latest} />
                <Route path="/rankings" component={Rankings} />
                <Route path="/players" component={Players} />
                <Route path="/maps" component={Maps} />
                <Route path="/servers" component={Servers} />
            </BrowserRouter>
        </ApolloProvider>
    );
}


export default App;
