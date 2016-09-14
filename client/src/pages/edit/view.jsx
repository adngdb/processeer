import React from 'react';
import { Button, ButtonGroup, Input, Glyphicon, PageHeader, Panel } from 'react-bootstrap';
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
        let viewId = props.params.viewId;

        if (!viewId) {
            return;
        }

        if (props.history.view != viewId) {
            props.dispatch(visitEditViewPage(viewId));
        }

        if (!props.views[viewId]) {
            props.dispatch(fetchView(viewId));
        }
    },

    updateView() {
        let viewId = this.props.params.viewId || '_new';

        let view = {
            name: this.refs.name.getValue(),
            slug: this.refs.slug.getValue(),
        }

        this.props.dispatch(updateView(viewId, view));
    },

    saveView() {
        let viewId = this.props.params.viewId || '_new';
        let view = this.props.views[viewId];

        if (viewId == '_new') {
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
        let viewId = this.props.params.viewId || '_new';
        let view = this.props.views[viewId];

        let newView = {
            reports: view.reports
        };
        newView.reports.push(id);

        this.props.dispatch(updateView(viewId, newView));
    },

    openReportPicker() {
        let viewId = this.props.params.viewId || '_new';
        this.props.dispatch(updateView(viewId, {
            isPickingReport: true,
        }));
    },

    closeReportPicker() {
        let viewId = this.props.params.viewId || '_new';
        this.props.dispatch(updateView(viewId, {
            isPickingReport: false,
        }));
    },

    render() {
        let viewId = this.props.params.viewId || '_new';
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

            let links = view.reports.map(
                (id, i) => {
                    let report = this.props.reports[id];
                    let title = id;
                    if (report) {
                        title = report.name || report.slug || id;
                    }
                    return <li key={i}><Link to={ {pathname: '/edit/report/' + id} }>{title}</Link></li>
                }
            );
            content = (<div>
                <Input ref="name" type="text" label="Name" value={view.name} onChange={this.updateView} />
                <Input ref="slug" type="text" label="Slug" value={view.slug} onChange={this.updateView} />
                <p>Reports: </p>
                <ul>
                    {links}
                </ul>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.openReportPicker}><Glyphicon glyph="plus" /> Add Report</Button>
                    <Button bsStyle="primary" onClick={this.saveView}><Glyphicon glyph="hdd" /> Save</Button>
                    <LinkContainer to={{pathname: '/view/' + viewId}}>
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
    }
});

const mapStateToProps = (state) => {
    return {
        views: state.views,
        reports: state.reports,
        history: state.history,
        created: state.created,
    };
}

export default connect(mapStateToProps)(EditViewPage);
