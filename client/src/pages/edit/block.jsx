import React from 'react';
import {
    Button,
    Glyphicon,
    PageHeader,
    Panel,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import {
    createBlock,
    fetchBlock,
    updateBlockController,
    updateBlock,
    saveBlock,
    updateBlockParam
} from '../../actions/blocks.jsx';
import { visitEditBlockPage } from '../../actions/history.jsx';
import BlockForm from '../../components/block-form.jsx';
import EditNav from '../../components/edit_nav.jsx';
import Loader from '../../components/loader.jsx';


class EditBlockPage extends React.Component {
    componentDidMount() {
        this.checkBlock(this.props);
    }

    componentDidUpdate(nextProps) {
        if (this.props !== nextProps) {
            this.checkBlock(nextProps);
        }
    }

    checkBlock(props) {
        const blockId = props.match.params.blockId;

        if (!blockId) {
            return;
        }

        if (props.history.block !== blockId) {
            props.dispatch(visitEditBlockPage(blockId));
        }

        if (!props.blocks[blockId]) {
            props.dispatch(fetchBlock(blockId));
        }
    }

    updateController = (blockId, newCode) => {
        this.props.dispatch(updateBlockController(blockId, newCode));
    }

    updateBlock = (blockId, data) => {
        this.props.dispatch(updateBlock(blockId, data));
    }

    updateBlockParam = (blockId, paramIndex, param) => {
        this.props.dispatch(updateBlockParam(
            blockId,
            paramIndex,
            param
        ));
    }

    saveBlock = () => {
        const blockId = this.props.match.params.blockId || '_new';
        const block = this.props.blocks[blockId];

        if (blockId === '_new') {
            this.props.dispatch(createBlock(block));
        }
        else {
            this.props.dispatch(saveBlock(blockId, block));
        }
    }

    render() {
        const blockId = this.props.match.params.blockId || '_new';
        let title = this.props.match.params.blockId || 'New Block';

        let block = this.props.blocks[blockId];
        if (!block) {
            block = {
                id: blockId,
                name: '',
                params: [],
                models: [],
            };
        }

        let content;
        if (block.isFetching) {
            content = <Loader />;
        }
        else {
            title = block.name || title;

            content = <BlockForm
                block={ block }
                updateBlock={ this.updateBlock }
                updateBlockParam={ this.updateBlockParam }
                updateController={ this.updateController }
            />;
        }

        // New history without the block, because we know it's the current one.
        const history = {
            report: this.props.history.report,
        };

        return <div>
            <Button
                bsStyle="primary"
                onClick={ this.saveBlock }
                className="pull-right"
            >
                <Glyphicon glyph="hdd" /> Save
            </Button>
            <PageHeader>Block Editor</PageHeader>
            <EditNav history={ history } />
            <Panel>
                <Panel.Heading>
                    <Panel.Title>{ title }</Panel.Title>
                </Panel.Heading>
                <Panel.Body>{ content }</Panel.Body>
            </Panel>
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        blocks: state.blocks,
        history: state.history,
    };
}

export default connect(mapStateToProps)(EditBlockPage);
