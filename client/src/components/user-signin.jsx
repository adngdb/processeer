import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function UserSignin({ user, signin, signout }) {
    if (user && !user.isFetching && !user.didInvalidate && user.authToken) {
        // A user is signed in.
        const signOut = (
            <Link to="/" onClick={signout}>
                <Glyphicon glyph="log-out" /> Sign out
            </Link>
        );
        if (user.username) {
            return (<span>Signed in as <strong>{user.username}</strong> - {signOut}</span>);
        }

        return <span>Signed in - {signOut}</span>;
    }

    if (user && user.isFetching) {
        return (<Button><Glyphicon glyph="time" /> Signing in</Button>);
    }

    return (
        <Button onClick={signin}>
            <Glyphicon glyph="log-in" /> Sign in with GitHub
        </Button>
    );
}
