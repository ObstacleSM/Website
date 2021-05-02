import { gql } from "apollo-boost";
import React from 'react';
import { Query } from "react-apollo";
import { Route } from "react-router-dom";
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Link } from "react-router-dom";

import { Section, MPElement, Time } from '../components'

dayjs.extend(calendar);

function query(login) {
    return gql`
    {
        player(login: "${login}") {
            nickname,
            records {
                rank,
                time,
                map {
                    id,
                    name
                },
                updatedAt
            }
        }
    }
    `;
}

const Player = ({ match }) => (
    <Query query={query(match.params.login)}>
        {({ loading, error, data }) => {
            if (loading) return <Section title="Loading..." />;
            if (error) return <Section title="Error :(" subtitle="Try to refresh your page." />;

            if (!data.player) return <Section title="Player not found." />;

            return (
                <Section title={<MPElement name={data.player.nickname} />} subtitle={match.params.login}>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Time</th>
                                <th>Map</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.player.records && data.player.records.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.rank}</td>
                                    <td><Time time={record.time} /></td>
                                    <td><Link to={`/maps/${record.map.id}`}>{<MPElement name={record.map.name}/>}</Link></td>
                                    <td>{dayjs.unix(record.updatedAt).calendar(null, {calendar: { lastWeek: 'dddd [at] LT', sameElse: 'MMMM D, YYYY h:mm A'}})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
