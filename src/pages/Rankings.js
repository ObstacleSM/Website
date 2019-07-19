import React from 'react';
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

import { Section, MPElement } from '../components'

function query() {
    let ids = ['JserUfxpKkwXibm_be4zXcz0bEf', 'mHd7vtbizDeEhzBvR8dhIErJWq5', 'LiKJVD1tM5cQppGpSG9nqpBl804', 'i1F1Wzt9NtU0sjslRhySNf9lnac', 'ocQg777gmkg5owWza2BQkwORURl', 'H74MbHFihw_lDg7GWGjqbF7Qzng', 'ZLNQrvXf_f7bRXSju4GrR9bMNxa', '3d5axMHnu6uYgLEBQXgu6AFjau8', '7q_2KooViE3Lm2vLYdzSUqWiWQb', '4rN3fOhkc6ZqoLPSw58N53FqPmg']
    let q = '';

    for (let id of ids) {
        q += `
          map_${id}: map(id: "${id}") {
            ...mapFields
          }
        `;
    }

    return gql`
    {
        ${q}
    }

    fragment mapFields on Map {
        id
        name
        records {
            rank
            time
            player {
                login
                nickname
            }
        }
    }
    `;
}

export const Rankings = () => (
    <Query query={query()}>
        {({ loading, error, data }) => {
            if (loading) return <Section title="Loading..." />;
            if (error) return <Section title="Error :(" />;

            let players = [];

            // Get all the unique players of each map
            for (let map_id in data) {
                for (let record of data[map_id].records) {
                    let idx = players.findIndex((p) => p.login === record.player.login);
                    if (idx === -1) {
                        players.push({
                            login: record.player.login,
                            nickname: record.player.nickname,
                            ranks: []
                        });
                    }
                }
            }

            let map_number = 1;
            for (let map_id in data) {
                for (let record of data[map_id].records) {
                    let idx = players.findIndex((p) => p.login === record.player.login);
                    players[idx].ranks.push(record.rank);
                }

                const last_rank = data[map_id].records[data[map_id].records.length - 1].rank;

                for (let player in players) {
                    if (players[player].ranks.length < map_number) {
                        players[player].ranks.push(last_rank)
                    }
                }
                map_number++;
            }

            for (let player in players) {
                if (players[player].ranks.length < map_number - 1) {
                    console.error(player, players[player]);
                }

                const ranks = players[player].ranks.sort((a, b) => a - b);
                players[player].worst = ranks.pop();
                players[player].score = ranks.reduce(( p, c ) => p + c, 0) / ranks.length;
            }

            players.sort((a, b) => (a.score - b.score));

            let rank = 1;
            let old_score = 0;
            for (let player of players) {
                player.rank = rank;

                if (old_score !== player.score) {
                    rank += 1;
                }
                old_score = player.score;
            }


            return (
                <Section title="OCS Ranked season">
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Score</th>
                                <th>Player</th>
                                <th>Worst rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.rank}</td>
                                    <td>{player.score.toFixed(2)}</td>
                                    <td><Link to={`/players/${player.login}`}>{<MPElement name={player.nickname}/>}</Link></td>
                                    <td>{player.worst}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            );
        }}
    </Query>
);
