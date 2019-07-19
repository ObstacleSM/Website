import React from 'react';
import { Section, MPElement } from '../components'

export class Servers extends React.Component {
    state = {
        servers: []
    }

    componentDidMount() {
        fetch('https://maniaplanet.com/webservices/servers/online?titleUids[]=obstacle@smokegun&length=25')
            .then(res => res.json())
            .then((data) => {
                this.setState({ servers: data })
            })
            .catch(console.log)
    }

    render() {
        return (
            <Section title="Servers">
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Players</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.servers.map((server, index) => (
                            <tr key={index}>
                                <td><a href={'maniaplanet://#join=' + server.login}>{<MPElement name={server.name}/>}</a></td>
                                <td>{server.player_count}/{server.player_max}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>
        );
    }
}
