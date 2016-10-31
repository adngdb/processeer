import React from 'react';
import { Button, ButtonGroup, FormGroup, FormControl, ControlLabel, Glyphicon, PageHeader, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { fetchReports } from '../../actions.jsx';
import { visitEditViewPage } from '../../actions/history.jsx';
import { createView, fetchView, saveView, updateView } from '../../actions/views.jsx';
import Loader from '../../components/loader.jsx';
import ReportPicker from '../../components/report-picker.jsx';


const EditViewPage = React.createClass({
    componentWillMount() {
        this.props.dispatch(fetchReports());
        this.checkView(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkView(nextProps);
    },

    checkView(props) {
        const viewId = props.params.viewId;

        if (!viewId) {
            return;
        }

        if (props.history.view !== viewId) {
            props.dispatch(visitEditViewPage(viewId));
        }

        if (!props.views[viewId]) {
            props.dispatch(fetchView(viewId));
        }
    },

    updateView(data) {
        const viewId = this.props.params.viewId || '_new';

        this.props.dispatch(updateView(viewId, data));
    },

    updateViewName(e) {
        this.updateView({ name: e.target.value });
    },

    updateViewSlug(e) {
        this.updateView({ slug: e.target.value });
    },

    saveView() {
        const viewId = this.props.params.viewId || '_new';
        const view = this.props.views[viewId];

        if (viewId === '_new') {
            this.props.dispatch(createView(
                view.reports,
                view.name,
                view.slug
            ));
        }
        else {
            this.props.dispatch(saveView(
                viewId,
                view.reports,
                view.name,
                view.slug
            ));
        }
    },

    addReport(id) {
        const viewId = this.props.params.viewId || '_new';
        const view = this.props.views[viewId];

        const newView = {
            reports: view.reports,
        };
        newView.reports.push(id);

        this.props.dispatch(updateView(viewId, newView));
    },

    openReportPicker() {
        const viewId = this.props.params.viewId || '_new';
        this.props.dispatch(updateView(viewId, {
            isPickingReport: true,
        }));
    },

    closeReportPicker() {
        const viewId = this.props.params.viewId || '_new';
        this.props.dispatch(updateView(viewId, {
            isPickingReport: false,
        }));
    },

    render() {
        const viewId = this.props.params.viewId || '_new';
        let title = this.props.params.viewId || 'New View';

        let view = this.props.views[viewId];
        if (!view) {
            view = {
                reports: [],
            };
        }

        let content;
        if (!view || view.isFetching) {
            content = <Loader />;
        }
        else {
            title = view.name || view.slug || title;

            const links = view.reports.map((id, i) => {
                const report = this.props.reports[id];
                title = id;
                if (report) {
                    title = report.name || report.slug || id;
                }
                return <li key={i}><Link to={{ pathname: `/edit/report/${id}` }}>{title}</Link></li>;
            });
            content = (<div>
                <FormGroup controlId="viewName">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={view.name} onChange={this.updateViewName} />
                </FormGroup>
                <FormGroup controlId="viewSlug">
                    <ControlLabel>Slug</ControlLabel>
                    <FormControl value={view.slug} onChange={this.updateViewSlug} />
                </FormGroup>
                <p>Reports: </p>
                <ul>
                    {links}
                </ul>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.openReportPicker}>
                        <Glyphicon glyph="plus" /> Add Report
                    </Button>
                    <Button bsStyle="primary" onClick={this.saveView}>
                        <Glyphicon glyph="hdd" /> Save
                    </Button>
                    <LinkContainer to={{ pathname: `/view/${viewId}` }}>
                        <Button bsStyle="primary"><Glyphicon glyph="refresh" /> Run</Button>
                    </LinkContainer>
                </ButtonGroup>
                <ReportPicker
                  reports={this.props.reports}
                  show={view.isPickingReport}
                  onHide={this.closeReportPicker}
                  addReport={this.addReport}
                />
            </div>);
        }

        return (
            <div>
                <PageHeader>View Editer</PageHeader>
                <Panel header={title}>
                    {content}
                </Panel>
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         views: state.views,
         reports: state.reports,
         history: state.history,
         created: state.created,
     })
;

export default connect(mapStateToProps)(EditViewPage);
