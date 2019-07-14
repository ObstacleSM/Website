import React from 'react';


export class Time extends React.Component {
    render() {
        let { time } = this.props;
        if (!time) return null;

        const ms = Math.floor(time % 1000) / 10;
        let sec = Math.floor(time / 1000);
        let min = Math.floor(sec / 60);
        let hor = Math.floor(min / 60);
        sec = sec % 60;
        min = min % 60;

        const str = hor.toString().padStart(2, '0')
            + ':'
            + min.toString().padStart(2, '0')
            + ':'
            + sec.toString().padStart(2, '0')
            + '.'
            + ms.toString().padStart(2, '0');

        return str;
    }
}
