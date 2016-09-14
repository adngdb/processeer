import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Button, ButtonGroup, Col, Glyphicon, Input, PageHeader, Panel, Row } from 'react-bootstrap';
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

    getParams() {
        let paramsTmp = [];
        Object.keys(this.refs).forEach((elem) => {
            if (elem.indexOf('param-key-') === 0) {
                let index = elem.substring('param-key-'.length);
                if (!paramsTmp[index]) {
                    paramsTmp[index] = [];
                }
                paramsTmp[index][0] = this.refs[elem].getValue();
            }
            else if (elem.indexOf('param-value-') === 0) {
                let index = elem.substring('param-value-'.length);
                if (!paramsTmp[index]) {
                    paramsTmp[index] = [];
                }
                paramsTmp[index][1] = this.refs[elem].getValue();
            }
        });
        let params = {};
        paramsTmp.forEach(elem => {
            params[elem[0]] = elem[1];
        });
        return params;
    },

    updateModel() {
        let reportId = this.props.params.reportId;
        let modelIndex = this.props.params.modelIndex;

        let endpoint = this.refs.endpoint.getValue();
        let params = this.getParams();

        this.props.dispatch(updateReportModel(
            reportId,
            modelIndex,
            endpoint,
            params
        ));
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
        let reportId = this.props.params.reportId;
        let modelIndex = this.props.params.modelIndex;

        let endpoint = this.refs.endpoint.getValue();
        let params = this.getParams();

        // Add a new, empty parameter.
        params[''] = '';

        this.props.dispatch(updateReportModel(
            reportId,
            modelIndex,
            endpoint,
            params
        ));
    },

    removeParam(field) {
        let reportId = this.props.params.reportId;
        let modelIndex = this.props.params.modelIndex;

        let endpoint = this.refs.endpoint.getValue();
        let params = this.props.reports[this.props.params.reportId].models[modelIndex].params;

        delete params[field];

        this.props.dispatch(updateReportModel(
            reportId,
            modelIndex,
            endpoint,
            params
        ));
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

            let params = Object.entries(model.params).map((entry, i) => {
                let key, value;
                [key, value] = entry;
                return (<Row key={i}>
                    <Col xs={4}>
                        <Input
                            type="text"
                            value={key}
                            ref={"param-key-" + i}
                            onChange={this.updateModel}
                        />
                    </Col>
                    <Col xs={1}>
                        :
                    </Col>
                    <Col xs={6}>
                        <Input
                            type="text"
                            value={value}
                            ref={"param-value-" + i}
                            onChange={this.updateModel}
                        />
                    </Col>
                    <Col xs={1}>
                        <Button onClick={() => this.removeParam(key)} title="Remove this parameter">
                            <Glyphicon glyph="remove" />
                        </Button>
                    </Col>
                </Row>);
            });

            content = (<Panel header={reportId}>
                <form>
                    <Input
                        type="text"
                        label="URL"
                        value={model.endpoint}
                        ref="endpoint"
                        onChange={this.updateModel}
                    />
                    <h2>Parameters</h2>
                    <Row>
                        <Col xs={5}>Key</Col>
                        <Col xs={7}>Value</Col>
                    </Row>
                    {params}
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
    }
});

const mapStateToProps = (state) => {
    return {
        reports: state.reports,
        history: state.history,
    };
}

export default connect(mapStateToProps)(EditModelPage);
