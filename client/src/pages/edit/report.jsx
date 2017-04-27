import React from 'react';
import { Button, ButtonGroup, FormGroup, FormControl, ControlLabel, Glyphicon, PageHeader, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { fetchBlocks } from '../../actions/blocks.jsx';
import { visitEditReportPage } from '../../actions/history.jsx';
import { createReport, fetchReport, saveReport, updateReport } from '../../actions/reports.jsx';
import Loader from '../../components/loader.jsx';
import BlockPicker from '../../components/block-picker.jsx';


const EditReportPage = React.createClass({
    componentWillMount() {
        this.props.dispatch(fetchBlocks());
        this.checkReport(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkReport(nextProps);
    },

    checkReport(props) {
        const reportId = props.params.reportId;

        if (!reportId) {
            return;
        }

        if (props.history.report !== reportId) {
            props.dispatch(visitEditReportPage(reportId));
        }

        if (!props.reports[reportId]) {
            props.dispatch(fetchReport(reportId));
        }
    },

    updateReport(data) {
        const reportId = this.props.params.reportId || '_new';

        this.props.dispatch(updateReport(reportId, data));
    },

    updateReportName(e) {
        this.updateReport({ name: e.target.value });
    },

    saveReport() {
        const reportId = this.props.params.reportId || '_new';
        const report = this.props.reports[reportId];

        if (reportId === '_new') {
            this.props.dispatch(createReport(
                report.blocks,
                report.name
            ));
        }
        else {
            this.props.dispatch(saveReport(
                reportId,
                report.blocks,
                report.name
            ));
        }
    },

    addBlock(id) {
        const reportId = this.props.params.reportId || '_new';
        const report = this.props.reports[reportId];

        const newReport = {
            blocks: report.blocks,
        };
        newReport.blocks.push(id);

        this.props.dispatch(updateReport(reportId, newReport));
    },

    openBlockPicker() {
        const reportId = this.props.params.reportId || '_new';
        this.props.dispatch(updateReport(reportId, {
            isPickingBlock: true,
        }));
    },

    closeBlockPicker() {
        const reportId = this.props.params.reportId || '_new';
        this.props.dispatch(updateReport(reportId, {
            isPickingBlock: false,
        }));
    },

    render() {
        const reportId = this.props.params.reportId || '_new';
        let title = this.props.params.reportId || 'New Report';

        let report = this.props.reports[reportId];
        if (!report) {
            report = {
                blocks: [],
            };
        }

        let content;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            title = report.name || title;

            const links = report.blocks.map((id, i) => {
                const block = this.props.blocks[id];
                title = id;
                if (block) {
                    title = block.name || id;
                }
                return <li key={i}><Link to={{ pathname: `/edit/block/${id}` }}>{title}</Link></li>;
            });
            content = (<div>
                <FormGroup controlId="reportName">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={report.name} onChange={this.updateReportName} />
                </FormGroup>
                <p>Blocks: </p>
                <ul>
                    {links}
                </ul>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.openBlockPicker}>
                        <Glyphicon glyph="plus" /> Add Block
                    </Button>
                    <Button bsStyle="primary" onClick={this.saveReport}>
                        <Glyphicon glyph="hdd" /> Save
                    </Button>
                    <LinkContainer to={{ pathname: `/report/${reportId}` }}>
                        <Button bsStyle="primary"><Glyphicon glyph="refresh" /> Run</Button>
                    </LinkContainer>
                </ButtonGroup>
                <BlockPicker
                  blocks={this.props.blocks}
                  show={report.isPickingBlock}
                  onHide={this.closeBlockPicker}
                  addBlock={this.addBlock}
                />
            </div>);
        }

        return (
            <div>
                <PageHeader>Report Editor</PageHeader>
                <Panel header={title}>
                    {content}
                </Panel>
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         reports: state.reports,
         blocks: state.blocks,
         history: state.history,
         created: state.created,
     })
;

export default connect(mapStateToProps)(EditReportPage);
