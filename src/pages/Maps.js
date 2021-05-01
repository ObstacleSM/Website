import { gql } from "apollo-boost";
import React from 'react';
import { Query } from "react-apollo";
import { Route } from "react-router-dom";
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar';
import { Link } from "react-router-dom";

import { Section, MPElement, Time } from '../components'

dayjs.extend(calendar);

function query(id) {
    return gql`
    {
        map(id: "${id}") {
            name,
            records {
                rank,
                time,
                player {
                    login,
                    nickname
                },
                updatedAt
            }
        }
    }
    `;
}

const Map = ({ match }) => (
    <Query query={query(match.params.id)}>
        {({ loading, error, data }) => {
            if (loading) return <Section title="Loading..." />;
            if (error) return <Section title="Error :(" subtitle="Try to refresh your page." />;

            if (!data.map) return <Section title="Map not found." />;

            return (
                <Section title={<MPElement name={data.map.name} />} subtitle={match.params.id}>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Time</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map.records.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.rank}</td>
                                    <td><Link to={`/players/${record.player.login}`}>{<MPElement name={record.player.nickname}/>}</Link></td>
                                    <td><Time time={record.time} /></td>
                                    <td>{dayjs.unix(record.updatedAt).calendar()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            );
        }}
    </Query>
);

const NoMap = () => (
    <Section title="Maps" subtitle="Please find a Map." />
);

export const Maps = ({ match }) => (
    <div>
        <Route path={`${match.path}/:id`} component={Map} />
        <Route exact path={match.path} component={NoMap} />
    </div>
);
