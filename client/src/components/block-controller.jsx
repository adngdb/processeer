import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Panel } from 'react-bootstrap';
import Codemirror from 'react-codemirror';


const BlockController = function (props) {
    let controller = props.children;

    if (!controller) {
        controller = `let transform = (data, callback) => {
    // Add your code here.

    let td = {
        type: 'table',
        title: 'My block title',
        data: [],
    };
    callback(td);
};
application.setInterface({transform: transform});`;
    }

    const options = {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
    };

    return (
        <section>
            <h3>Controller</h3>
            <Panel>
                <Codemirror
                  value={controller}
                  options={options}
                  onChange={props.updateController}
                  fill
                />
            </Panel>
        </section>
    );
};

export default BlockController;
