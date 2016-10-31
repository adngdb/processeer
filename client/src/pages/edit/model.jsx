import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Button, ButtonGroup, Glyphicon, ControlLabel, FormControl, FormGroup, PageHeader, Panel, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import Codemirror from 'react-codemirror';

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
        let reportId = props.params.reportId;

        if (!props.reports[reportId]) {
            props.dispatch(fetchReport(reportId));
        }
    },

    getReport() {
        let reportId = this.props.params.reportId;
        return this.props.reports[reportId];
    },

    getModel() {
        let report = this.getReport();
        let modelIndex = this.props.params.modelIndex;
        return report.models[modelIndex];
    },

    updateModel(data) {
        let reportId = this.props.params.reportId;
        let modelIndex = this.props.params.modelIndex;
        let model = this.getModel();

        let endpoint = data.endpoint || model.endpoint;
        let params = data.params || model.params;

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
        let model = this.getModel();
        let params = model.params;

        let paramIndex = e.target.dataset.index;

        params[paramIndex].key = e.target.value;
        this.updateModel({ params });
    },

    updateModelParamValue(e) {
        let model = this.getModel();
        let params = model.params;

        let paramIndex = e.target.dataset.index;

        params[paramIndex].value = e.target.value;
        this.updateModel({ params });
    },

    saveModel() {
        let reportId = this.props.params.reportId;
        let report = this.props.reports[reportId];

        if (reportId == '_new') {
            this.props.dispatch(createReport(report));
        }
        else {
            this.props.dispatch(saveReport(reportId, report));
        }
    },

    addParam() {
        let model = this.getModel();
        let params = model.params;

        // Add a new, empty parameter.
        params.push({key: '', value: ''});
        this.updateModel({ params });
    },

    removeParam(index) {
        let model = this.getModel();
        let params = model.params;

        params.splice(index, 1);
        this.updateModel({ params });
    },

    render() {
        let reportId = this.props.params.reportId;
        let modelIndex = this.props.params.modelIndex;
        let report = this.props.reports[reportId];

        let content;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            let model = report.models[modelIndex];
            model.params = model.params || [];
            model.endpoint = model.endpoint || '';

            let params = model.params.map((entry, i) => {
                return (<tr key={i}>
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
                </tr>);
            });

            content = (<Panel header={reportId}>
                <form>
                    <FormGroup controlId="modelEndpoint">
                        <ControlLabel>URL</ControlLabel>
                        <FormControl
                            type="text"
                            value={model.endpoint}
                            ref="endpoint"
                            onChange={this.updateModelEndpoint}
                        />
                    </FormGroup>
                    <h2>Parameters</h2>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <td>Key</td>
                                <td>Value</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {params}
                        </tbody>
                    </Table>
                    <ButtonGroup>
                        <Button onClick={this.addParam}><Glyphicon glyph="plus" /> Add Param</Button>
                        <Button bsStyle="primary" onClick={this.saveModel}><Glyphicon glyph="hdd" /> Save</Button>
                    </ButtonGroup>
                </form>
            </Panel>);
        }

        let history = {
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

const mapStateToProps = (state) => {
    return {
        reports: state.reports,
        history: state.history,
    };
};

export default connect(mapStateToProps)(EditModelPage);
