import React from 'react';
import { Button, Glyphicon, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { deleteBlock, fetchBlocks } from '../actions/blocks.jsx';
import { deleteReport, fetchReports } from '../actions/reports.jsx';
import Reports from '../components/reports.jsx';
import Blocks from '../components/blocks.jsx';


class HomePage extends React.Component {
    render() {
        let createReportLink = null;
        let createBlockLink = null;
        let allBlocks = null;

        if (this.props.user.authenticated) {
            createReportLink = (
                <LinkContainer to={{ pathname: '/edit/report/' }} className="pull-right">
                    <Button bsStyle="primary">
                        <Glyphicon glyph="stats" /> Create new report
                    </Button>
                </LinkContainer>
            );
            createBlockLink = (
                <LinkContainer to={{ pathname: '/edit/block/' }} className="pull-right">
                    <Button bsStyle="primary">
                        <Glyphicon glyph="tasks" /> Create new block
                    </Button>
                </LinkContainer>
            );
            allBlocks = (<section>
                {createBlockLink}
                <h2>All Blocks</h2>
                <Blocks
                  blocks={this.props.blocks}
                  fetchBlocks={() => this.props.dispatch(fetchBlocks())}
                  deleteBlock={id => this.props.dispatch(deleteBlock(id))}
                  user={this.props.user}
                />
            </section>);
        }

        return (
            <div>
                <Jumbotron>
                    <h1>Build <em>Your</em> Reports!</h1>
                    <p>
                        With Processeer, you can make powerful Reports using
                        any publicly available data. Build Blocks by querying APIs,
                        transform the data, assemble your Blocks and enjoy!
                    </p>
                    <a href="https://github.com/adngdb/processeer#processeer" target="_blank" rel="noopener noreferrer">
                        <Button bsStyle="primary">
                            <Glyphicon glyph="new-window" /> Get started
                        </Button>
                    </a>
                </Jumbotron>

                {createReportLink}

                <h2>All Reports</h2>
                <Reports
                  reports={this.props.reports}
                  fetchReports={() => this.props.dispatch(fetchReports())}
                  deleteReport={id => this.props.dispatch(deleteReport(id))}
                  user={this.props.user}
                />

                {allBlocks}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    reports: state.reports,
    blocks: state.blocks,
    user: state.user,
});

export default connect(mapStateToProps)(HomePage);
