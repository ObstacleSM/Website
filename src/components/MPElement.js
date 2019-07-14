import React from 'react';

function MPHtml(name) {
    return { __html:  window.MPStyle.Parser.toHTML(name)};
}

export class MPElement extends React.Component {
    render() {
        return <span className="mp-element" dangerouslySetInnerHTML={MPHtml(this.props.name)}></span>;
    }
}
