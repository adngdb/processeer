import React from 'react';
import { Button, ButtonGroup, Glyphicon, ControlLabel, FormControl, FormGroup, PageHeader, Panel, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import { createReport, fetchReport, updateReportModel, saveReport } from '../../actions.jsx';
import Loader from '../../components/loader.jsx';
import EditNav from '../../components/edit_nav.jsx';


const EditModelPage = React.createClass({
    componentWillMount() {
        this.checkReport(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkReport(nextProps);
    },

    checkReport(props) {
        const reportId = props.params.reportId;

        if (!props.reports[reportId]) {
            props.dispatch(fetchReport(reportId));
        }
    },

    getReport() {
        const reportId = this.props.params.reportId;
        return this.props.reports[reportId];
    },

    getModel() {
        const report = this.getReport();
        const modelIndex = this.props.params.modelIndex;
        return report.models[modelIndex];
    },

    updateModel(data) {
        const reportId = this.props.params.reportId;
        const modelIndex = this.props.params.modelIndex;
        const model = this.getModel();

        const endpoint = data.endpoint || model.endpoint;
        const params = data.params || model.params;

        this.props.dispatch(updateReportModel(
            reportId,
            modelIndex,
            endpoint,
            params
        ));
    },

    updateModelEndpoint(e) {
        this.updateModel({
            endpoint: e.target.value,
        });
    },

    updateModelParamKey(e) {
        const model = this.getModel();
        const params = model.params;

        const paramIndex = e.target.dataset.index;

        params[paramIndex].key = e.target.value;
        this.updateModel({ params });
    },

    updateModelParamValue(e) {
        const model = this.getModel();
        const params = model.params;

        const paramIndex = e.target.dataset.index;

        params[paramIndex].value = e.target.value;
        this.updateModel({ params });
    },

    saveModel() {
        const reportId = this.props.params.reportId;
        const report = this.props.reports[reportId];

        if (reportId === '_new') {
            this.props.dispatch(createReport(report));
        }
        else {
            this.props.dispatch(saveReport(reportId, report));
        }
    },

    addParam() {
        const model = this.getModel();
        const params = model.params;

        // Add a new, empty parameter.
        params.push({ key: '', value: '' });
        this.updateModel({ params });
    },

    removeParam(index) {
        const model = this.getModel();
        const params = model.params;

        params.splice(index, 1);
        this.updateModel({ params });
    },

    render() {
        const reportId = this.props.params.reportId;
        const modelIndex = this.props.params.modelIndex;
        const report = this.props.reports[reportId];

        let content;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            const model = report.models[modelIndex];
            model.params = model.params || [];
            model.endpoint = model.endpoint || '';

            const params = model.params.map((entry, i) =>
                 (<tr key={i}>
                    <td>
                        <FormControl
                          type="text"
                          value={entry.key}
                          data-index={i}
                          onChange={this.updateModelParamKey}
                        />
                    </td>
                    <td>
                        <FormControl
                          type="text"
                          value={entry.value}
                          data-index={i}
                          onChange={this.updateModelParamValue}
                        />
                    </td>
                    <td>
                        <Button onClick={() => this.removeParam(i)} title="Remove this parameter">
                            <Glyphicon glyph="remove" />
                        </Button>
                    </td>
                </tr>)
            );

            content = (<Panel header={reportId}>
                <form>
                    <FormGroup controlId="modelEndpoint">
                        <ControlLabel>URL</ControlLabel>
                        <FormControl
                          type="text"
                          value={model.endpoint}
                          onChange={this.updateModelEndpoint}
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
                        <Button onClick={this.addParam}>
                            <Glyphicon glyph="plus" /> Add Param
                        </Button>
                        <Button bsStyle="primary" onClick={this.saveModel}>
                            <Glyphicon glyph="hdd" /> Save
                        </Button>
                    </ButtonGroup>
                </form>
            </Panel>);
        }

        const history = {
            view: this.props.history.view,
            report: reportId,
        };

        return (
            <div>
                <PageHeader>Model Editer</PageHeader>
                <EditNav history={history} />
                {content}
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

export default connect(mapStateToProps)(EditModelPage);
