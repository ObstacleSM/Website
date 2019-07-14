import { gql } from "apollo-boost";
import React from 'react';
import { Query } from "react-apollo";
import { Route } from "react-router-dom";

import { Section, MPElement } from '../components'


function query(login) {
    return gql`
    {
        player(login: "${login}") {
            nickname
        }
    }
    `;
}

const Player = ({ match }) => (
    <Query query={query(match.params.login)}>
        {({ loading, error, data }) => {
            if (loading) return <Section title="Loading..." />;
            if (error) return <Section title="Error :(" />;

            if (!data.player) return <Section title="Player not found." />;

            return (
                <Section title={<MPElement name={data.player.nickname} />} subtitle={match.params.login}>

                </Section>
            );
        }}
    </Query>
);

const NoPlayer = () => (
    <Section title="Players" subtitle="Please find a player." />
);

export const Players = ({ match }) => (
    <div>
        <Route path={`${match.path}/:login`} component={Player} />
        <Route exact path={match.path} component={NoPlayer} />
    </div>
);