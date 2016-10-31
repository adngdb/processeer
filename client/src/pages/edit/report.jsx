import React from 'react';
import { Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Glyphicon, PageHeader, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { createReport, fetchReport, updateReport, saveReport, updateReportParam } from '../../actions.jsx';
import { visitEditReportPage } from '../../actions/history.jsx';
import Loader from '../../components/loader.jsx';
import EditNav from '../../components/edit_nav.jsx';


const EditReportPage = React.createClass({
    componentWillMount() {
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

    getReport() {
        const reportId = this.props.params.reportId || '_new';
        return this.props.reports[reportId];
    },

    getParam(paramIndex) {
        const report = this.getReport();
        return report.params[paramIndex];
    },

    addParam() {
        const reportId = this.props.params.reportId || '_new';
        const report = this.getReport();
        const params = report.params || [];

        params.push({});

        this.props.dispatch(updateReport(reportId, {
            params,
        }));
    },

    removeParam(index) {
        const reportId = this.props.params.reportId || '_new';
        const report = this.props.reports[reportId];
        const params = report.params;

        params.splice(index, 1);

        this.props.dispatch(updateReport(reportId, {
            params,
        }));
    },

    updateParam(paramIndex, param) {
        const reportId = this.props.params.reportId || '_new';

        this.props.dispatch(updateReportParam(
            reportId,
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
        const reportId = this.props.params.reportId || '_new';
        const report = this.props.reports[reportId];
        const models = report.models;

        models.push({});

        this.props.dispatch(updateReport(reportId, {
            models,
        }));
    },

    removeModel(index) {
        const reportId = this.props.params.reportId || '_new';
        const report = this.props.reports[reportId];
        const models = report.models;

        models.splice(index, 1);

        this.props.dispatch(updateReport(reportId, {
            models,
        }));
    },

    updateReport(data) {
        const reportId = this.props.params.reportId || '_new';
        this.props.dispatch(updateReport(reportId, data));
    },

    updateReportName(e) {
        this.updateReport({
            name: e.target.value,
        });
    },

    updateReportSlug(e) {
        this.updateReport({
            slug: e.target.value,
        });
    },

    saveReport() {
        const reportId = this.props.params.reportId || '_new';
        const report = this.props.reports[reportId];

        if (reportId === '_new') {
            this.props.dispatch(createReport(report));
        }
        else {
            this.props.dispatch(saveReport(reportId, report));
        }
    },

    render() {
        const reportId = this.props.params.reportId || '_new';
        let title = this.props.params.reportId || 'New Report';

        let report = this.props.reports[reportId];
        if (!report) {
            report = {
                params: [],
                models: [],
            };
        }

        let content;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            title = report.name || report.slug || title;

            const paramLines = (report.params || []).map((param, i) =>
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

            const modelLines = (report.models || []).map((model, i) => {
                const endpoint = model.endpoint || '';
                const params = model.params || {};
                return (<tr key={i}>
                    <td>
                        <Link to={{ pathname: `/edit/report/${reportId}/model/${i}` }}>
                            #{i}
                        </Link>
                    </td>
                    <td>{endpoint}</td>
                    <td>{Object.keys(params).length}</td>
                    <td>
                        <LinkContainer to={{ pathname: `/edit/report/${reportId}/model/${i}` }}>
                            <Button>Edit</Button>
                        </LinkContainer>
                    </td>
                    <td><Button onClick={() => this.removeModel(i)}>Remove</Button></td>
                </tr>);
            });

            content = (<div>
                <FormGroup controlId="reportName">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl type="text" value={report.name} onChange={this.updateReportName} />
                </FormGroup>
                <FormGroup controlId="reportSlug">
                    <ControlLabel>Slug</ControlLabel>
                    <FormControl type="text" value={report.slug} onChange={this.updateReportSlug} />
                </FormGroup>

                <h3>Params: </h3>
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
                <h3>Models: </h3>
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
                <h3>
                    <Link to={{ pathname: `/edit/report/${reportId}/controller` }}>Controller</Link>
                </h3>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.addParam}>
                        <Glyphicon glyph="plus" /> Add Param
                    </Button>
                    <Button bsStyle="primary" onClick={this.addModel}>
                        <Glyphicon glyph="plus" /> Add Model
                    </Button>
                    <Button bsStyle="primary" onClick={this.saveReport}>
                        <Glyphicon glyph="hdd" /> Save
                    </Button>
                </ButtonGroup>
            </div>);
        }

        // New history without the report, because we know it's the current one.
        const history = {
            view: this.props.history.view,
        };

        return (
            <div>
                <PageHeader>Report Editer</PageHeader>
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
         reports: state.reports,
         history: state.history,
     })
;

export default connect(mapStateToProps)(EditReportPage);
