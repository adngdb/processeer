import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';


/*
 * Props:
 *   reports
 *   deleteReport
 *   fetchReports
 */
const Reports = React.createClass({
    componentWillMount() {
        this.props.fetchReports();
    },

    render() {
        const reports = Object.keys(this.props.reports).map((id, i) => {
            const report = this.props.reports[id];
            const title = report.name || report.slug || id;
            return (<tr key={i}>
                <td>
                    <Link to={{ pathname: `/report/${id}` }}>{title}</Link>
                </td>
                <td>
                    <LinkContainer to={{ pathname: `/edit/report/${id}` }}>
                        <Button>Edit</Button>
                    </LinkContainer>
                </td>
                <td><Button onClick={() => this.props.deleteReport(id)}>Remove</Button></td>
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
