import React from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { IndexLinkContainer } from 'react-router-bootstrap';


export default function Header({ user, signin }) {
    let userSignIn = '';
    if (user && !user.isFetching && !user.didInvalidate && user.authToken) {
        // A user is signed in.
        userSignIn = `Signed in as ${user.username}`;
    }
    else {
        userSignIn = (<Button onClick={signin}>Sign in</Button>);
    }
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Mozilla Reports Builder</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <IndexLinkContainer to="/">
                        <NavItem>Documentation</NavItem>
                    </IndexLinkContainer>
                </Nav>
                <Navbar.Text pullRight>
                    {userSignIn}
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}
