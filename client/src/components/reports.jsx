import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';


/*
 * Props:
 *   reports
 *   deleteReport
 *   fetchReports
 *   user
 */
const Reports = React.createClass({
    componentWillMount() {
        this.props.fetchReports();
    },

    render() {
        if (Object.keys(this.props.reports).length === 0) {
            return (<p>No reports yet. </p>);
        }

        const reports = Object.keys(this.props.reports).map((id, i) => {
            const report = this.props.reports[id];
            const title = report.name || id;

            let editLink = null;
            let removeLink = null;
            if (this.props.user.authenticated) {
                editLink = (<LinkContainer to={{ pathname: `/edit/report/${id}` }}>
                    <Button>Edit</Button>
                </LinkContainer>);
                removeLink = <Button onClick={() => this.props.deleteReport(id)}>Remove</Button>;
            }

            return (<tr key={i}>
                <td>
                    <Link to={{ pathname: `/report/${id}` }}>{title}</Link>
                </td>
                <td>{editLink}</td>
                <td>{removeLink}</td>
            </tr>);
        });

        return (
            <Table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td />
                        <td />
                    </tr>
                </thead>
                <tbody>
                    {reports}
                </tbody>
            </Table>
        );
    },
});

export default Reports;
