import { gql } from "apollo-boost";
import React from 'react';
import { Query } from "react-apollo";
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar';
import { Link } from "react-router-dom";

import { Section, MPElement, Time } from '../components'

dayjs.extend(calendar);

function query(login) {
    return gql`
    {
        records {
            rank,
            time,
            player {
                login,
                nickname
            },
            map {
                id,
                name
            },
            updatedAt
        }
    }
    `;
}


export const Latest = ({ match }) => (
    <Query query={query(match.params.login)}>
    {({ loading, error, data }) => {
        if (loading) return <Section title="Loading..." />;
        if (error) return <Section title="Error :(" subtitle="Try to refresh your page." />;

        return (
            <Section title="Latest records">
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Time</th>
                            <th>Map</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.records && data.records.map((record, index) => (
                            <tr key={index}>
                                <td>{record.rank}</td>
                                <td><Link to={`/players/${record.player.login}`}>{<MPElement name={record.player.nickname}/>}</Link></td>
                                <td><Time time={record.time} /></td>
                                <td><Link to={`/maps/${record.map.id}`}>{<MPElement name={record.map.name}/>}</Link></td>
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
