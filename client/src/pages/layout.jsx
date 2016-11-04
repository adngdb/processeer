import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

import { verifyUserSignedIn, signInGithub, signOutGithub } from '../actions/signin.jsx';


const Layout = React.createClass({
    componentWillMount() {
        this.props.dispatch(verifyUserSignedIn());
    },

    render() {
        return (
            <div className="app">
                <Header
                    user={this.props.user}
                    signin={() => this.props.dispatch(signInGithub())}
                    signout={() => this.props.dispatch(signOutGithub())}
                />
                <Grid>
                    <Row>
                        { this.props.children }
                    </Row>
                    <hr />
                    <Footer />
                </Grid>
            </div>
        );
    },
});

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Layout);
