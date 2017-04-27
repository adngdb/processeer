import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Glyphicon, PageHeader, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { createBlock, fetchBlock, updateBlockController, updateBlock, saveBlock, updateBlockParam } from '../../actions/blocks.jsx';
import { visitEditBlockPage } from '../../actions/history.jsx';
import BlockController from '../../components/block-controller.jsx';
import EditNav from '../../components/edit_nav.jsx';
import Loader from '../../components/loader.jsx';


const EditBlockPage = React.createClass({
    componentWillMount() {
        this.checkBlock(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkBlock(nextProps);
    },

    checkBlock(props) {
        const blockId = props.params.blockId;

        if (!blockId) {
            return;
        }

        if (props.history.block !== blockId) {
            props.dispatch(visitEditBlockPage(blockId));
        }

        if (!props.blocks[blockId]) {
            props.dispatch(fetchBlock(blockId));
        }
    },

    getBlock() {
        const blockId = this.props.params.blockId || '_new';
        return this.props.blocks[blockId];
    },

    getParam(paramIndex) {
        const block = this.getBlock();
        return block.params[paramIndex];
    },

    addParam() {
        const blockId = this.props.params.blockId || '_new';
        const block = this.getBlock();
        const params = block.params || [];

        params.push({});

        this.props.dispatch(updateBlock(blockId, {
            params,
        }));
    },

    removeParam(index) {
        const blockId = this.props.params.blockId || '_new';
        const block = this.props.blocks[blockId];
        const params = block.params;

        params.splice(index, 1);

        this.props.dispatch(updateBlock(blockId, {
            params,
        }));
    },

    updateParam(paramIndex, param) {
        const blockId = this.props.params.blockId || '_new';

        this.props.dispatch(updateBlockParam(
            blockId,
            paramIndex,
            param
        ));
    },

    updateParamName(e) {
        const paramIndex = e.target.dataset.index;
        const param = this.getParam(paramIndex);

        param.name = e.target.value;
        this.updateParam(paramIndex, param);
    },

    updateParamDefault(e) {
        const paramIndex = e.target.dataset.index;
        const param = this.getParam(paramIndex);

        param.defaultValue = e.target.value;
        this.updateParam(paramIndex, param);
    },

    updateParamRequired(e) {
        const paramIndex = e.target.dataset.index;
        const param = this.getParam(paramIndex);

        param.required = e.target.value;
        this.updateParam(paramIndex, param);
    },

    addModel() {
        const blockId = this.props.params.blockId || '_new';
        const block = this.props.blocks[blockId];
        const models = block.models;

        models.push({});

        this.props.dispatch(updateBlock(blockId, {
            models,
        }));
    },

    removeModel(index) {
        const blockId = this.props.params.blockId || '_new';
        const block = this.props.blocks[blockId];
        const models = block.models;

        models.splice(index, 1);

        this.props.dispatch(updateBlock(blockId, {
            models,
        }));
    },

    updateController(newCode) {
        const blockId = this.props.params.blockId;
        this.props.dispatch(updateBlockController(blockId, newCode));
    },

    updateBlock(data) {
        const blockId = this.props.params.blockId || '_new';
        this.props.dispatch(updateBlock(blockId, data));
    },

    updateBlockName(e) {
        this.updateBlock({
            name: e.target.value,
        });
    },

    saveBlock() {
        const blockId = this.props.params.blockId || '_new';
        const block = this.props.blocks[blockId];

        if (blockId === '_new') {
            this.props.dispatch(createBlock(block));
        }
        else {
            this.props.dispatch(saveBlock(blockId, block));
        }
    },

    render() {
        const blockId = this.props.params.blockId || '_new';
        let title = this.props.params.blockId || 'New Block';

        let block = this.props.blocks[blockId];
        if (!block) {
            block = {
                params: [],
                models: [],
            };
        }

        let content;
        if (!block || block.isFetching) {
            content = <Loader />;
        }
        else {
            title = block.name || title;

            const paramLines = (block.params || []).map((param, i) =>
                 (<tr key={i}>
                    <td>
                        <FormControl
                          type="text"
                          value={param.name}
                          data-index={i}
                          onChange={this.updateParamName}
                        />
                    </td>
                    <td>
                        <FormControl
                          type="text"
                          value={param.defaultValue}
                          data-index={i}
                          onChange={this.updateParamDefault}
                        />
                    </td>
                    <td>
                        <FormControl
                          type="text"
                          value={param.required}
                          data-index={i}
                          onChange={this.updateParamRequired}
                        />
                    </td>
                    <td>
                        <Button onClick={() => this.removeParam(i)}>
                            <Glyphicon glyph="remove" />
                        </Button>
                    </td>
                </tr>)
            );

            const modelLines = (block.models || []).map((model, i) => {
                const endpoint = model.endpoint || '';
                const params = model.params || {};
                return (<tr key={i}>
                    <td>
                        <Link to={{ pathname: `/edit/block/${blockId}/model/${i}` }}>
                            #{i}
                        </Link>
                    </td>
                    <td>{endpoint}</td>
                    <td>{Object.keys(params).length}</td>
                    <td>
                        <LinkContainer to={{ pathname: `/edit/block/${blockId}/model/${i}` }}>
                            <Button>Edit</Button>
                        </LinkContainer>
                    </td>
                    <td><Button onClick={() => this.removeModel(i)}>Remove</Button></td>
                </tr>);
            });

            content = (<div>
                <FormGroup controlId="blockName">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl type="text" value={block.name} onChange={this.updateBlockName} />
                </FormGroup>

                <Button bsStyle="primary" onClick={this.addParam} className="pull-right">
                    <Glyphicon glyph="plus" /> Add Param
                </Button>
                <h3>Params</h3>
                <Table striped hover>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Default</td>
                            <td>Required?</td>
                            <td />
                        </tr>
                    </thead>
                    <tbody>
                        {paramLines}
                    </tbody>
                </Table>

                <Button bsStyle="primary" onClick={this.addModel} className="pull-right">
                    <Glyphicon glyph="plus" /> Add Model
                </Button>
                <h3>Models</h3>
                <Table striped hover>
                    <thead>
                        <tr>
                            <td>Index</td>
                            <td>Endpoint</td>
                            <td># of params</td>
                            <td />
                            <td />
                        </tr>
                    </thead>
                    <tbody>
                        {modelLines}
                    </tbody>
                </Table>

                <BlockController
                  updateController={this.updateController}
                >{ block.controller }</BlockController>
            </div>);
        }

        // New history without the block, because we know it's the current one.
        const history = {
            report: this.props.history.report,
        };

        return (
            <div>
                <Button bsStyle="primary" onClick={this.saveBlock} className="pull-right">
                    <Glyphicon glyph="hdd" /> Save
                </Button>
                <PageHeader>Block Editor</PageHeader>
                <EditNav history={history} />
                <Panel header={title}>
                    {content}
                </Panel>
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

export default connect(mapStateToProps)(EditBlockPage);
