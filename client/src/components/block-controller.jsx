import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Panel } from 'react-bootstrap';
import { Controlled as CodeMirror } from 'react-codemirror2';


export default class BlockController extends React.Component {
    onChange = (editor, data, value) => {
        this.props.updateController(value);
    }

    render() {
        let controller = this.props.children;

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

        return <section>
            <h3>Controller</h3>
            <Panel>
                <CodeMirror
                  value={controller}
                  options={options}
                  onBeforeChange={this.onChange}
                  fill
                />
            </Panel>
        </section>;
    }
}
