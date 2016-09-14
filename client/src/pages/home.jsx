import React from 'react';
import { Button, PageHeader, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { deleteReport, fetchReports } from '../actions.jsx';
import { deleteView, fetchViews } from '../actions/views.jsx';
import Views from '../components/views.jsx';
import Reports from '../components/reports.jsx';


const HomePage = React.createClass({
    render() {
        return (
            <div>
                <PageHeader>
                    Mozilla Reports Builder <small>User documentation</small>
                </PageHeader>

                <LinkContainer to={ {pathname: '/edit/view/'} }>
                    <Button bsStyle='primary'>Create new view</Button>
                </LinkContainer>

                <h2>All Views</h2>
                <Views
                    views={this.props.views}
                    fetchViews={() => this.props.dispatch(fetchViews())}
                    deleteView={id => this.props.dispatch(deleteView(id))}
                />

                <LinkContainer to={ {pathname: '/edit/report/'} }>
                    <Button bsStyle='primary'>Create new report</Button>
                </LinkContainer>

                <h2>All Reports</h2>
                <Reports
                    reports={this.props.reports}
                    fetchReports={() => this.props.dispatch(fetchReports())}
                    deleteReport={id => this.props.dispatch(deleteReport(id))}
                />
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        views: state.views,
        reports: state.reports,
    };
}

export default connect(mapStateToProps)(HomePage);
