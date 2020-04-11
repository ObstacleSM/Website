import React from 'react';
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

import { Section, MPElement } from '../components'

function query() {
    let ids = [
        "kFlqlIojUu3p_dmdwAYvmq2sDC8",
        "wXSC1Hv25r_Nx9zpM2T3NBC3kS5",
        "9HpPMPNybjO9lPbhGvX30G9lDya",
        "zjMelPq2UOwreYmU6I_Ozlk78S0",
        "xj_D_jM4D3FjvdSY3ev6hQrPILd",
        "EQwFfKpQ5mAOF_RFtnqu5yjt7ki",
        "neChJMtteb6k84v4e6KcjhbVbhj",
        "kz9I37UK0tPakQJEG4Js3MPzrAb",
        "5acHygCbNhGvxbV4FA9oa6dh1C6",
        "AmCnEfrQyOOrz6UvUkPHRr62Egm",
    ];

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

export class Rankings extends React.Component {
    state = {
        active: -1
    }

    render() {
        return (
            <Query query={query()}>
                {({ loading, error, data }) => {
                    if (loading) return <Section title="Loading..." />;
                    if (error) return <Section title="Error :(" subtitle="Try to refresh your page." />;

                    let players = [];

                    // Get all the unique players of each map
                    for (let map_id in data) {
                        for (let record of data[map_id].records) {
                            let idx = players.findIndex((p) => p.login === record.player.login);
                            if (idx === -1) {
                                players.push({
                                    login: record.player.login,
                                    nickname: record.player.nickname,
                                    ranks: [],
                                    score: 0,
                                    rank: 0
                                });
                            }
                        }
                    }

                    let map_number = 1;
                    for (let map_id in data) {
                        for (let record of data[map_id].records) {
                            let idx = players.findIndex((p) => p.login === record.player.login);
                            players[idx].ranks.push({rank: record.rank, map: data[map_id].name, map_id: data[map_id].id});
                        }

                        const last_rank = data[map_id].records[data[map_id].records.length - 1].rank;

                        for (let player in players) {
                            if (players[player].ranks.length < map_number) {
                                players[player].ranks.push({rank: last_rank, map: data[map_id].name, map_id: data[map_id].id});
                            }
                        }
                        map_number++;
                    }

                    for (let player in players) {
                        if (players[player].ranks.length < map_number - 1) {
                            console.error(player, players[player]);
                        }

                        const ranks = players[player].ranks.sort((a, b) => a.rank - b.rank);
                        players[player].worst = ranks.pop();
                        players[player].score = ranks.reduce(( acc, rank ) => acc + rank.rank, 0) / ranks.length;
                        ranks.push(players[player].worst); // lol
                    }

                    players.sort((a, b) => (a.score - b.score));

                    let rank = 0;
                    let old_score = 0;
                    let old_rank = 0;
                    for (let player of players) {
                        rank += 1;

                        player.rank = old_score === player.score ? old_rank : rank;

                        old_score = player.score;
                        old_rank = player.rank;
                    }

                    return (
                        <Section title="OCS Ranked season">
                            <table className="table is-fullwidth is-hoverable">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Score</th>
                                        <th>Player</th>
                                        <th>Worst rank</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map((player, pindex) => {
                                        const score_row = (
                                            <tr key={pindex} style={{cursor: 'pointer'}} onClick={() => {
                                                    if (this.state.active !== pindex) {
                                                        this.setState({active: pindex});
                                                    } else {
                                                        this.setState({active: -1});
                                                    }
                                                }}>
                                                <td className="rank">{player.rank}</td>
                                                <td className="score">{player.score.toFixed(2)}</td>
                                                <td className="nickname"><Link to={`/players/${player.login}`}>{<MPElement name={player.nickname}/>}</Link></td>
                                                <td className="worst">{player.worst.rank}</td>
                                            </tr>
                                        );

                                        if (this.state.active !== pindex)
                                            return score_row;

                                        const subranks = player.ranks.map((rank, rindex) => (
                                            <tr key={players.length + pindex * player.ranks.length + rindex}>
                                                <td></td>
                                                <td className="rank">{rank.rank}</td>
                                                <td><Link to={`/maps/${rank.map_id}`}>{<MPElement name={rank.map}/>}</Link></td>
                                                <td></td>
                                            </tr>
                                        ));

                                        return [
                                            score_row,
                                            ...subranks];
                                    })}
                                </tbody>
                            </table>
                        </Section>
                    );
                }}
            </Query>);
    }
}
