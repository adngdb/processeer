import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import { Button, ButtonGroup, PageHeader, Panel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import Codemirror from 'react-codemirror';

import { createReport, fetchReport, updateReportController, saveReport } from '../../actions.jsx';
import Loader from '../../components/loader.jsx';
import EditNav from '../../components/edit_nav.jsx';


const EditControllerPage = React.createClass({
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

    updateController(newCode) {
        let reportId = this.props.params.reportId;
        this.props.dispatch(updateReportController(reportId, newCode));
    },

    saveController() {
        let reportId = this.props.params.reportId;
        let report = this.props.reports[reportId];

        if (reportId == '_new') {
            this.props.dispatch(createReport(report));
        }
        else {
            this.props.dispatch(saveReport(reportId, report));
        }
    },

    render() {
        let reportId = this.props.params.reportId;
        let report = this.props.reports[reportId];

        let content;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            let controller = report.controller;
            if (typeof(controller) === undefined) {
                controller = `let transform = (data, callback) => {
    // Add your code here.

    let td = {
        type: 'table',
        title: 'My report title',
        data: [],
    };
    callback(td);
};
application.setInterface({transform: transform});`;
            }

            const options = {
                mode: 'javascript',
                lineNumbers: true,
                indentUnit: 4,
            };
            content = (<Panel header={reportId}>
                <Codemirror
                    value={controller}
                    options={options}
                    onChange={this.updateController}
                    fill
                />
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.saveController}>Save</Button>
                </ButtonGroup>
            </Panel>);
        }

        let history = {
            view: this.props.history.view,
            report: reportId,
        };

        return (
            <div>
                <PageHeader>Controller Editer</PageHeader>
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

export default connect(mapStateToProps)(EditControllerPage);
