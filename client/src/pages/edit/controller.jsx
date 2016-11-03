import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Button, ButtonGroup, PageHeader, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Codemirror from 'react-codemirror';

import { createBlock, fetchBlock, updateBlockController, saveBlock } from '../../actions.jsx';
import Loader from '../../components/loader.jsx';
import EditNav from '../../components/edit_nav.jsx';


const EditControllerPage = React.createClass({
    componentWillMount() {
        this.checkBlock(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkBlock(nextProps);
    },

    checkBlock(props) {
        const blockId = props.params.blockId;

        if (!props.blocks[blockId]) {
            props.dispatch(fetchBlock(blockId));
        }
    },

    updateController(newCode) {
        const blockId = this.props.params.blockId;
        this.props.dispatch(updateBlockController(blockId, newCode));
    },

    saveController() {
        const blockId = this.props.params.blockId;
        const block = this.props.blocks[blockId];

        if (blockId === '_new') {
            this.props.dispatch(createBlock(block));
        }
        else {
            this.props.dispatch(saveBlock(blockId, block));
        }
    },

    render() {
        const blockId = this.props.params.blockId;
        const block = this.props.blocks[blockId];

        let content;
        if (!block || block.isFetching) {
            content = <Loader />;
        }
        else {
            let controller = block.controller;
            if (typeof controller === 'undefined') {
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
            content = (<Panel header={blockId}>
                <Codemirror
                  value={controller}
                  options={options}
                  onChange={this.updateController}
                  fill
                />
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.saveController}>Save</Button>
                </ButtonGroup>
            </Panel>);
        }

        const history = {
            view: this.props.history.view,
            block: blockId,
        };

        return (
            <div>
                <PageHeader>Controller Editer</PageHeader>
                <EditNav history={history} />
                {content}
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         blocks: state.blocks,
         history: state.history,
     })
;

export default connect(mapStateToProps)(EditControllerPage);
