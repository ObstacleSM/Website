import React from 'react';
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";

import { Section, MPElement } from '../components'

function query() {
    let ids = [
        "VigtxfASsGccuCT44mL5aLXO0Xd",
        "SoLC7FNpUNmMqmcysrmhPRVnAI6",
        "YZmwVT5ncfIpjs7wIaIz_5QYrR1",
        "o9F5nnz6tRddjPqDQedZ5Jiv2t9",
        "H8inGeTlqinAAMlaTd7HgZzMgP6",
        "_qKMIxcBWppEPff4T9MdAxZ6fkd",
        "JGQgvG7LMxdwgn3ZhV1CLF2OLDk",
        "OrXfqzCOv9RcuGLVdEM5FZHeC8g",
        "LT3kuPxcvlJyCdyWjI23ckeTHjb",
        "sw1ZNosde87RFoseiQnD0XHwhfc",
        "Yas8UkFhMtBuLzWgqjpzUTzuzsf",
        "sdplceQGlgGPImcMsoq6TlsCaHc",
        "PvsmCHpX0UjmraOHIZJm07ltrnf",
        "Wn_X844UTQbFbn4mtp99bXtAEAc",
        "lHJq9JkesparxpKYMeGPyoNjVOi",
        "tshEaiQf2tcfB45ysN9xDlf7Hnm",
        "4a1jkL2Zp0MdI4q27Bj33YFOQU6",
        "mod4bWmYtNVPZ67cellmRtb_Xgm",
        "E6xW_eunkud7lPnWDv6eByOqgL3",
        "OzsSxFwNpvCiDbJrzVqKrY6TCKf",
        "mKxX5edHlziky_p4OMrgy02nzn1",
        "5LWevOc7WS0qgAfCZlpgXx6R2M4",
        "3xWFg2Vs72JCNYf3LgrxtAEDRJ5",
        "aznSmO28giyYaRdYGw8lbJ8gVY3",
        "vyniqXBWAYsI0NoI7VMcfwUZC21",
        "b4NHXV3gDwgP_vEU3UsxdOkfgk5",
        "4kzRRaKpe_DFD4gTJZx7zRHp3j1",
        "_0g6ER2Z_5ZZbIPq9ZjBdJQWkIj",
        "Hdm11RCklIb1tovNwtaw8asWwIj",
        "TaxxcBlHMsKoB8LQCEVwFQFStF9",
        "_6OvwWJq_SasAw8xvcrJwFHh553",
        "UN8atzWf7QHzPVvJ9GdqAq_QnJ1",
        "c12MWFiidzLo1UB4kc6s_iuJDZ6",
        "QIQQU6QvyyQ0_PbAWAOvhyu3hqj",
        "BBvdoMcH1w231R18cn1g0NpUdM2",
        "p8M156g_ZnGWEnc3Uc8xhgzJema",
        "khKv63Qs1pbygtMPrrIcveseFh8",
        "7W8w5GPg70lPnwG2gYvz2yYkYx",
        "gb03fFBe6RRMwDCqVyK8_FU3yV1",
        "L1LFP0yN1_WuDxjGmbc0g7nnaE8"
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
