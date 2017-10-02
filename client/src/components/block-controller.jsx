import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Panel } from 'react-bootstrap';
import Codemirror from 'react-codemirror';


const BlockController = function (props) {
    let controller = props.children;

    if (!controller) {
        controller = `let transform = (data) => {
    // Add your code here.
    // 'data' is an object containing:
    //   * models: array of objects, each item being the return value of the corresponding model
    //   * input: object containing the values passed as parameters to this Block

    // Always return an object at the end of this function.
    return {
        type: 'table',
        title: 'My block title',
        data: [],
    };
};`;
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
