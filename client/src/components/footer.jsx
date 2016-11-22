import React from 'react';

import { Glyphicon } from 'react-bootstrap';


export default function Footer() {
    return (
        <p className="text-center">
            Made by {' '}
            <a href="http://adrian.gaudebert.fr/home_en">
                <Glyphicon glyph="user" /> Adrian
            </a> - {' '}
            <a href="https://github.com/adngdb/tyrannoeil">
                <Glyphicon glyph="education" /> Source code
            </a>
        </p>
    );
}
