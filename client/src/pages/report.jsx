import React from 'react';
import { Button, ButtonGroup, Glyphicon, Panel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { fetchBlock } from '../actions/blocks.jsx';
import { fetchReport, runReport, removeReportContent, updateReportInput } from '../actions/reports.jsx';
import Report from '../components/report.jsx';
import ReportInput from '../components/report-input.jsx';
import Loader from '../components/loader.jsx';


const ReportPage = React.createClass({
    componentWillMount() {
        this.checkReport(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkReport(nextProps);
    },

    checkReport(props) {
        const reportId = props.params.reportId;
        const report = props.reports[reportId];

        if (!report) {
            props.dispatch(fetchReport(reportId));
        }
        else if (report && report.blocks.length) {
            if (!props.blocks[report.blocks[0]]) {
                props.dispatch(fetchBlock(report.blocks[0]));
            }
            else if (!report.isRunning && !report.isFetching && !report.content) {
                props.dispatch(runReport(report));
            }
        }
    },

    runReport() {
        const reportId = this.props.params.reportId;
        const report = this.props.reports[reportId];

        this.props.dispatch(removeReportContent(reportId));
        this.props.dispatch(runReport(report));
    },

    updateInput(key, value) {
        const reportId = this.props.params.reportId;
        const input = this.props.reports[reportId].input || {};

        input[key] = value;
        this.props.dispatch(updateReportInput(reportId, input));
    },

    render() {
        const reportId = this.props.params.reportId;
        const report = this.props.reports[reportId];

        let title = 'Report';

        let content;
        let params = null;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            if (report.blocks.length) {
                const firstBlock = this.props.blocks[report.blocks[0]];
                if (firstBlock && !firstBlock.isFetching) {
                    params = <ReportInput block={firstBlock} input={report.input} updateInput={this.updateInput} />;
                }
            }

            title = report.name || title;
            content = <Report report={report} />;
        }

        return (
            <Panel header={title}>
                <ButtonGroup>
                    <Button onClick={this.runReport}><Glyphicon glyph="refresh" /> Run</Button>
                    <LinkContainer to={{ pathname: `/edit/report/${reportId}` }}>
                        <Button><Glyphicon glyph="edit" /> Edit</Button>
                    </LinkContainer>
                </ButtonGroup>
                {params}
                {content}
            </Panel>
        );
    },
});

const mapStateToProps = state =>
     ({
         reports: state.reports,
         blocks: state.blocks,
     })
;

export default connect(mapStateToProps)(ReportPage);
