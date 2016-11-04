import React from 'react';
import { Button, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { deleteBlock, fetchBlocks } from '../actions/blocks.jsx';
import { deleteReport, fetchReports } from '../actions/reports.jsx';
import Reports from '../components/reports.jsx';
import Blocks from '../components/blocks.jsx';


const HomePage = React.createClass({
    render() {
        return (
            <div>
                <PageHeader>
                    Mozilla Reports Builder <small>User documentation</small>
                </PageHeader>

                <LinkContainer to={{ pathname: '/edit/report/' }}>
                    <Button bsStyle="primary">Create new report</Button>
                </LinkContainer>

                <h2>All Reports</h2>
                <Reports
                  reports={this.props.reports}
                  fetchReports={() => this.props.dispatch(fetchReports())}
                  deleteReport={id => this.props.dispatch(deleteReport(id))}
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

const mapStateToProps = state => ({
    reports: state.reports,
    blocks: state.blocks,
});

export default connect(mapStateToProps)(HomePage);
