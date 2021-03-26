import React from 'react';
import logo from '../obs.svg';
import { Link } from "react-router-dom";


export function Header() {
    return (
        <nav className="navbar is-dark has-shadow">
            <div className="container">
                <div className="navbar-brand">
                    <Link to="/" className="navbar-item">
                        <img src={logo} id="logo" alt="Obstacle" width="40" height="40"/>
                        <p id="brand">OBSTACLE</p>
                    </Link>
                    <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div id="navbarExampleTransparentExample" className="navbar-menu">
                    <div className="navbar-start">
                        <Link to="/servers" className="navbar-item">Servers</Link>
                        <Link to="/" className="navbar-item">Latest records</Link>
                        <Link to="/rankings" className="navbar-item">OCS Ranks</Link>
                        <Link to="/garbago" className="navbar-item">Garbago</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
