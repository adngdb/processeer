import React from 'react';
import { Button, ButtonGroup, Input, Glyphicon, PageHeader, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { createReport, fetchReport, updateReport, saveReport } from '../../actions.jsx';
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
        let reportId = props.params.reportId;

        if (!reportId) {
            return;
        }

        if (props.history.report != reportId) {
            props.dispatch(visitEditReportPage(reportId));
        }

        if (!props.reports[reportId]) {
            props.dispatch(fetchReport(reportId));
        }
    },

    addModel() {
        let reportId = this.props.params.reportId || '_new';
        let report = this.props.reports[reportId];
        let models = report.models;

        models.push({});

        this.props.dispatch(updateReport(reportId, {
            models,
        }));
    },

    updateReport() {
        let reportId = this.props.params.reportId || '_new';

        let newReport = {
            name: this.refs.name.getValue(),
            slug: this.refs.slug.getValue(),
        };

        this.props.dispatch(updateReport(reportId, newReport));
    },

    saveReport() {
        let reportId = this.props.params.reportId || '_new';
        let report = this.props.reports[reportId];

        if (reportId == '_new') {
            this.props.dispatch(createReport(report));
        }
        else {
            this.props.dispatch(saveReport(reportId, report));
        }
    },

    removeModel(index) {
        let reportId = this.props.params.reportId || '_new';
        let report = this.props.reports[reportId];
        let models = report.models;

        models.splice(index, 1);

        this.props.dispatch(updateReport(reportId, {
            models,
        }));
    },

    render() {
        let reportId = this.props.params.reportId || '_new';
        let title = this.props.params.reportId || 'New Report';;

        let report = this.props.reports[reportId];
        if (!report) {
            report = {
                models: [],
            };
        }

        let content;
        if (!report || report.isFetching) {
            content = <Loader />;
        }
        else {
            title = report.name || report.slug || title;

            let links = report.models.map((model, i) => {
                let endpoint = model.endpoint || '';
                let params = model.params || {};
                return (<tr key={i}>
                    <td>
                        <Link to={ {pathname: '/edit/report/' + reportId + '/model/' + i} }>
                            #{i}
                        </Link>
                    </td>
                    <td>{endpoint}</td>
                    <td>{Object.keys(params).length}</td>
                    <td>
                        <LinkContainer to={ {pathname: '/edit/report/' + reportId + '/model/' + i} }>
                            <Button>Edit</Button>
                        </LinkContainer>
                    </td>
                    <td><Button onClick={() => this.removeModel(i)}>Remove</Button></td>
                </tr>);
            });
            content = (<div>
                <Input ref="name" type="text" label="Name" value={report.name} onChange={this.updateReport} />
                <Input ref="slug" type="text" label="Slug" value={report.slug} onChange={this.updateReport} />
                <p>Models: </p>
                <Table striped hover>
                    <thead>
                        <tr>
                            <td>Index</td>
                            <td>Endpoint</td>
                            <td># of params</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {links}
                    </tbody>
                </Table>
                <p>
                    <Link to={ {pathname: '/edit/report/'+reportId+'/controller'} }>Controller</Link>
                </p>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.addModel}><Glyphicon glyph="plus" /> Add Model</Button>
                    <Button bsStyle="primary" onClick={this.saveReport}><Glyphicon glyph="hdd" /> Save</Button>
                </ButtonGroup>
            </div>);
        }

        // New history without the report, because we know it's the current one.
        let history = {
            view: this.props.history.view,
        }

        return (
            <div>
                <PageHeader>Report Editer</PageHeader>
                <EditNav history={history} />
                <Panel header={title}>
                    {content}
                </Panel>
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

export default connect(mapStateToProps)(EditReportPage);
