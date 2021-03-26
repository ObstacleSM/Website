import React from 'react';
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

import { Section, MPElement } from '../components'

function query() {
    let ids = [
        "6C8HDufOHzbI7FoB3eD2aEY6vS0",
        "tWHajrwuH7RVi3yeVSGAaNpfnTi",
        "tQmTxHrnDM6qUvunx9kHiDrrP4e",
        "Z5pllGSfGlK28sJQ_KlfhLjZVxe",
        "S8GjpuLwpYOx7UBAeWXtJCW2Ux7",
        "Z2PR76_8zErjb4epylAFxr22Txk",
        "9KStj4pyYcGCh5it3RyxknCivY2",
        "F5fuVcSktfjDXUfrWqeCyEHm1Mf",
        "6PXtcE7c2CxqDJ5x1wunQWCeFlm",
        "087vFZb4CZG5BRcZs4CEUmDOjl8",
        "6zUMaRRg8iUx50Yxm6EV5mfOoLk",
        "yFm4Tc1OP2KuMYFW7T5b_6fE_Qb",
        "qeWe3KGTsHX1o0MGPYsWtBCXKii",
        "vDnx7ltWa1evYq6YiKfQfLLBwH7",
        "hpTtDnYgxgJ0lC10zUahbgjtK8k",
        "vHiZ8_E3eSpBoIj6OL9dQrZZ392",
        "oC9QOCM35x2KQ9nSTvlRlkY5ohh",
        "Lt6Gupy1lwYgTZOVbK8T9mcKkLi",
        "ASThUURs9zykfx8MCgBJt9Whmge",
        "QWxpMkZi6CZG5QWJ2VZcipOEbN5",
        "1yOJv29h19C5YcLyL8UVsYI4UMb",
        "u9P150iPQFpyWvPRCPRnO_jhPMi",
        "_Ut5rQcIaXofWeNnMSPWRLLgrPd",
        "i2lVwtATUJJxXid9ZcIYQIlLKef",
        "Kj2ysLanqkuEWZ26u5toU1nNkfj",
        "r02OZ7zIe7v_q6oZ2zoVvqohV_a",
        "L6r7D6AMRYCTOY99LWhLp11YLue",
        "VRcdCIn6xQoyJLCBC9t4nJGp9r2",
        "TdBAjuL3x00U58CO1ZI_c7PGtNf",
        "CMKVp9n0fWSOTCCmR095g82AHK2",
        "ixBefHzfRome1bEmDAjgYDBgBPa",
        "p8WHk9UsbsvcmH0c6VUXM3gavW5",
        "LMbviw6I560njeLKTJnId7gSsod",
        "CI_U4OIyuQhsWTgPea1UITvRfB3",
        "_fIxZGPnCTXL9tdGXU2n65TqJ3i",
        "UGo6K7KnJozQYK3TrvkrlKPojKk",
        "klwRt4OrySHEYRwIKs0Z3DgI8_9",
        "eH6P0VNttVwWEi5fXqOXrJ85pl0",
        "pgazhe10v6mfQPeD1y0zpoPzpNf",
        "bbhxiAxp4tv9HfOYQxrsb3XhDj6"
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

export class Garbago extends React.Component {
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

                    // Get all the unique players of each map and their record
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
                                idx = players.length - 1;
                            }

                            players[idx].ranks.push({rank: record.rank, map: data[map_id].name, map_id: data[map_id].id});
                        }
                    }

                    for (let player in players) {
                        console.log(players[player]);
                        players[player].score = players[player].ranks.length;
                    }

                    players.sort((a, b) => (b.score - a.score));

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
                        <Section title="Garbago">
                            <table className="table is-fullwidth is-hoverable">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Score</th>
                                        <th>Player</th>
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
                                                <td className="score">{player.score}</td>
                                                <td className="nickname"><Link to={`/players/${player.login}`}>{<MPElement name={player.nickname}/>}</Link></td>
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
