import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

import {
    verifyUserSignedIn,
    signInGithub,
    signOutGithub
} from '../actions/signin.jsx';


class Layout extends React.Component {
    componentWillMount() {
        this.props.dispatch(verifyUserSignedIn());
    }

    signIn() {
        this.props.dispatch(signInGithub());
    }

    signOut() {
        this.props.dispatch(signOutGithub());
    }

    render() {
        return <div className="app">
            <Header
                user={ this.props.user }
                signin={ this.signIn.bind(this) }
                signout={ this.signOut.bind(this) }
            />
            <Grid>
                <Row>
                    { this.props.children }
                </Row>
                <hr />
                <Footer />
            </Grid>
        </div>;
    }
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
});

export default connect(mapStateToProps)(Layout);
