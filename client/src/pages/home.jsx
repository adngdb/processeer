import React from 'react';
import { Button, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { deleteBlock, fetchBlocks } from '../actions/blocks.jsx';
import { deleteView, fetchViews } from '../actions/views.jsx';
import Views from '../components/views.jsx';
import Blocks from '../components/blocks.jsx';


const HomePage = React.createClass({
    render() {
        return (
            <div>
                <PageHeader>
                    Mozilla Reports Builder <small>User documentation</small>
                </PageHeader>

                <LinkContainer to={{ pathname: '/edit/view/' }}>
                    <Button bsStyle="primary">Create new view</Button>
                </LinkContainer>

                <h2>All Views</h2>
                <Views
                  views={this.props.views}
                  fetchViews={() => this.props.dispatch(fetchViews())}
                  deleteView={id => this.props.dispatch(deleteView(id))}
                />

                <LinkContainer to={{ pathname: '/edit/block/' }}>
                    <Button bsStyle="primary">Create new block</Button>
                </LinkContainer>

                <h2>All Blocks</h2>
                <Blocks
                  blocks={this.props.blocks}
                  fetchBlocks={() => this.props.dispatch(fetchBlocks())}
                  deleteBlock={id => this.props.dispatch(deleteBlock(id))}
                />
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         views: state.views,
         blocks: state.blocks,
     })
;

export default connect(mapStateToProps)(HomePage);
