import React from 'react';
import { Glyphicon, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { IndexLinkContainer } from 'react-router-bootstrap';

import UserSignin from './user-signin.jsx';


export default function Header({ user, signin, signout }) {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/"><Glyphicon glyph="eye-open" /> Processeer</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Navbar.Text>
                    <a href="https://github.com/adngdb/processeer#processeer" target="_blank" rel="noopener noreferrer">
                        <Glyphicon glyph="new-window" /> Documentation
                    </a>
                </Navbar.Text>
                <Navbar.Text pullRight>
                    <UserSignin user={user} signin={signin} signout={signout} />
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}
