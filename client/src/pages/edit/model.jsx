import React from 'react';
import { Button, ButtonGroup, Glyphicon, ControlLabel, FormControl, FormGroup, PageHeader, Panel, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import { createBlock, fetchBlock, updateBlockModel, saveBlock } from '../../actions/blocks.jsx';
import Loader from '../../components/loader.jsx';
import EditNav from '../../components/edit_nav.jsx';


class EditModelPage extends React.Component {
    componentWillMount() {
        this.checkBlock(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.checkBlock(nextProps);
    }

    checkBlock(props) {
        const blockId = props.match.params.blockId;

        if (!props.blocks[blockId]) {
            props.dispatch(fetchBlock(blockId));
        }
    }

    getBlock() {
        const blockId = this.props.match.params.blockId;
        return this.props.blocks[blockId];
    }

    getModel() {
        const block = this.getBlock();
        const modelIndex = this.props.match.params.modelIndex;
        return block.models[modelIndex];
    }

    updateModel(data) {
        const blockId = this.props.match.params.blockId;
        const modelIndex = this.props.match.params.modelIndex;
        const model = this.getModel();

        const endpoint = data.endpoint || model.endpoint;
        const params = data.params || model.params;

        this.props.dispatch(updateBlockModel(
            blockId,
            modelIndex,
            endpoint,
            params
        ));
    }

    updateModelEndpoint(e) {
        this.updateModel({
            endpoint: e.target.value,
        });
    }

    updateModelParamKey(e) {
        const model = this.getModel();
        const params = model.params;

        const paramIndex = e.target.dataset.index;

        params[paramIndex].key = e.target.value;
        this.updateModel({ params });
    }

    updateModelParamValue(e) {
        const model = this.getModel();
        const params = model.params;

        const paramIndex = e.target.dataset.index;

        params[paramIndex].value = e.target.value;
        this.updateModel({ params });
    }

    saveModel() {
        const blockId = this.props.match.params.blockId;
        const block = this.props.blocks[blockId];

        if (blockId === '_new') {
            this.props.dispatch(createBlock(block));
        }
        else {
            this.props.dispatch(saveBlock(blockId, block));
        }
    }

    addParam() {
        const model = this.getModel();
        const params = model.params;

        // Add a new, empty parameter.
        params.push({ key: '', value: '' });
        this.updateModel({ params });
    }

    removeParam(index) {
        const model = this.getModel();
        const params = model.params;

        params.splice(index, 1);
        this.updateModel({ params });
    }

    render() {
        const blockId = this.props.match.params.blockId;
        const modelIndex = this.props.match.params.modelIndex;
        const block = this.props.blocks[blockId];

        let content;
        if (!block || block.isFetching) {
            content = <Loader />;
        }
        else {
            const model = block.models[modelIndex];
            model.params = model.params || [];
            model.endpoint = model.endpoint || '';

            const params = model.params.map((entry, i) =>
                 (<tr key={i}>
                    <td>
                        <FormControl
                          type="text"
                          value={entry.key}
                          data-index={i}
                          onChange={this.updateModelParamKey.bind(this)}
                        />
                    </td>
                    <td>
                        <FormControl
                          type="text"
                          value={entry.value}
                          data-index={i}
                          onChange={this.updateModelParamValue.bind(this)}
                        />
                    </td>
                    <td>
                        <Button onClick={() => this.removeParam(i)} title="Remove this parameter">
                            <Glyphicon glyph="remove" />
                        </Button>
                    </td>
                </tr>)
            );

            content = (<Panel header={blockId}>
                <form>
                    <FormGroup controlId="modelEndpoint">
                        <ControlLabel>URL</ControlLabel>
                        <FormControl
                          type="text"
                          value={model.endpoint}
                          onChange={this.updateModelEndpoint.bind(this)}
                        />
                    </FormGroup>
                    <h2>Parameters</h2>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <td>Key</td>
                                <td>Value</td>
                                <td />
                            </tr>
                        </thead>
                        <tbody>
                            {params}
                        </tbody>
                    </Table>
                    <ButtonGroup>
                        <Button onClick={this.addParam.bind(this)}>
                            <Glyphicon glyph="plus" /> Add Param
                        </Button>
                        <Button bsStyle="primary" onClick={this.saveModel.bind(this)}>
                            <Glyphicon glyph="hdd" /> Save
                        </Button>
                    </ButtonGroup>
                </form>
            </Panel>);
        }

        const history = {
            report: this.props.history.report,
            block: blockId,
        };

        return (
            <div>
                <PageHeader>Model Editor</PageHeader>
                <EditNav history={history} />
                {content}
            </div>
        );
    }
}


const mapStateToProps = state =>
     ({
         blocks: state.blocks,
         history: state.history,
     })
;

export default connect(mapStateToProps)(EditModelPage);
