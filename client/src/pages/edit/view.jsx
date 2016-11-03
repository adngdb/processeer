import React from 'react';
import { Button, ButtonGroup, FormGroup, FormControl, ControlLabel, Glyphicon, PageHeader, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { fetchBlocks } from '../../actions/blocks.jsx';
import { visitEditViewPage } from '../../actions/history.jsx';
import { createView, fetchView, saveView, updateView } from '../../actions/views.jsx';
import Loader from '../../components/loader.jsx';
import BlockPicker from '../../components/block-picker.jsx';


const EditViewPage = React.createClass({
    componentWillMount() {
        this.props.dispatch(fetchBlocks());
        this.checkView(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkView(nextProps);
    },

    checkView(props) {
        const viewId = props.params.viewId;

        if (!viewId) {
            return;
        }

        if (props.history.view !== viewId) {
            props.dispatch(visitEditViewPage(viewId));
        }

        if (!props.views[viewId]) {
            props.dispatch(fetchView(viewId));
        }
    },

    updateView(data) {
        const viewId = this.props.params.viewId || '_new';

        this.props.dispatch(updateView(viewId, data));
    },

    updateViewName(e) {
        this.updateView({ name: e.target.value });
    },

    updateViewSlug(e) {
        this.updateView({ slug: e.target.value });
    },

    saveView() {
        const viewId = this.props.params.viewId || '_new';
        const view = this.props.views[viewId];

        if (viewId === '_new') {
            this.props.dispatch(createView(
                view.blocks,
                view.name,
                view.slug
            ));
        }
        else {
            this.props.dispatch(saveView(
                viewId,
                view.blocks,
                view.name,
                view.slug
            ));
        }
    },

    addBlock(id) {
        const viewId = this.props.params.viewId || '_new';
        const view = this.props.views[viewId];

        const newView = {
            blocks: view.blocks,
        };
        newView.blocks.push(id);

        this.props.dispatch(updateView(viewId, newView));
    },

    openBlockPicker() {
        const viewId = this.props.params.viewId || '_new';
        this.props.dispatch(updateView(viewId, {
            isPickingBlock: true,
        }));
    },

    closeBlockPicker() {
        const viewId = this.props.params.viewId || '_new';
        this.props.dispatch(updateView(viewId, {
            isPickingBlock: false,
        }));
    },

    render() {
        const viewId = this.props.params.viewId || '_new';
        let title = this.props.params.viewId || 'New View';

        let view = this.props.views[viewId];
        if (!view) {
            view = {
                blocks: [],
            };
        }

        let content;
        if (!view || view.isFetching) {
            content = <Loader />;
        }
        else {
            title = view.name || view.slug || title;

            const links = view.blocks.map((id, i) => {
                const block = this.props.blocks[id];
                title = id;
                if (block) {
                    title = block.name || block.slug || id;
                }
                return <li key={i}><Link to={{ pathname: `/edit/block/${id}` }}>{title}</Link></li>;
            });
            content = (<div>
                <FormGroup controlId="viewName">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={view.name} onChange={this.updateViewName} />
                </FormGroup>
                <FormGroup controlId="viewSlug">
                    <ControlLabel>Slug</ControlLabel>
                    <FormControl value={view.slug} onChange={this.updateViewSlug} />
                </FormGroup>
                <p>Blocks: </p>
                <ul>
                    {links}
                </ul>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.openBlockPicker}>
                        <Glyphicon glyph="plus" /> Add Block
                    </Button>
                    <Button bsStyle="primary" onClick={this.saveView}>
                        <Glyphicon glyph="hdd" /> Save
                    </Button>
                    <LinkContainer to={{ pathname: `/view/${viewId}` }}>
                        <Button bsStyle="primary"><Glyphicon glyph="refresh" /> Run</Button>
                    </LinkContainer>
                </ButtonGroup>
                <BlockPicker
                  blocks={this.props.blocks}
                  show={view.isPickingBlock}
                  onHide={this.closeBlockPicker}
                  addBlock={this.addBlock}
                />
            </div>);
        }

        return (
            <div>
                <PageHeader>View Editer</PageHeader>
                <Panel header={title}>
                    {content}
                </Panel>
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         views: state.views,
         blocks: state.blocks,
         history: state.history,
         created: state.created,
     })
;

export default connect(mapStateToProps)(EditViewPage);
