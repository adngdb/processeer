import React from 'react';


export default function Footer() {
    return (
        <p className="text-center">
            Made by {' '}
            <a href="http://adrian.gaudebert.fr/home_en">
                <span className="glyphicon glyphicon-user" /> Adrian
            </a> - {' '}
            <a href="https://github.com/adngdb/tyrannoeil">
                <span className="glyphicon glyphicon-education" /> Source code
            </a>
        </p>
    );
}
