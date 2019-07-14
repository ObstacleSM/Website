import React from 'react';

export class Section extends React.Component {
    render() {
        return (
            <section className="section">
                <div className="container">
                    { this.props.title ? <h1 className="title">{this.props.title}</h1> : null}
                    { this.props.subtitle ? <h2 className="subtitle">{this.props.subtitle}</h2> : null}
                    { this.props.children }
                </div>
            </section>
        );
    }
}
