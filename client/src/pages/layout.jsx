import React from 'react';
import { Alert, Button, Input, Navbar, Nav, NavItem, Grid, Row } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import { connect } from 'react-redux';


const Header = React.createClass({
    render() {
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
                        <IndexLinkContainer to="/"><NavItem>Documentation</NavItem></IndexLinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});


const Footer = React.createClass({
    render() {
        return (
            <p className="text-center">
                Made by {' '}
                <a href="http://adrian.gaudebert.fr/home_en">
                    <span className="glyphicon glyphicon-user" /> Adrian
                </a> - {' '}
                <a href="https://github.com/mozilla/bug-signatures-status">
                    <span className="glyphicon glyphicon-education" /> Source code
                </a> - {' '}
                <a href="https://crash-stats.mozilla.com/api/">
                    <span className="glyphicon glyphicon-cloud-download" /> Data source
                </a>
            </p>
        );
    }
});


const Layout = React.createClass({
    render() {
        return (
            <div className="app">
                <Header />
                <Grid>
                    <Row>
                        { this.props.children }
                    </Row>
                    <hr />
                    <Footer />
                </Grid>
            </div>
        );
    }
});

export default connect(x => x)(Layout);
