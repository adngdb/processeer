import React from 'react';
import { Button } from 'react-bootstrap';


export default function UserSignin({ user, signin, signout }) {
    if (user && !user.isFetching && !user.didInvalidate && user.authToken) {
        // A user is signed in.
        const signOut = <span> <Button onClick={signout}>Sign out</Button></span>;
        if (user.username) {
            return (<span>{`Signed in as ${user.username}`}{signOut}</span>);
        }

        return <span>Signed in{signOut}</span>;
    }

    if (user && user.isFetching) {
        return (<Button>Signing in</Button>);
    }

    return (<Button onClick={signin}>Sign in</Button>);
}
