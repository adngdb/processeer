import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';


/*
 * Props:
 *   views
 *   deleteReport
 *   fetchReports
 */
const Reports = React.createClass({
    componentWillMount() {
        this.props.fetchReports();
    },

    render() {
        let reports = Object.keys(this.props.reports).map((id, i) => {
            let report = this.props.reports[id];
            let title = report.name || report.slug || id;
            return (<tr key={i}>
                <td>
                    <Link to={ {pathname: '/edit/report/' + id} }>{title}</Link>
                </td>
                <td>
                    <LinkContainer to={ {pathname: '/edit/report/' + id} }>
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
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {reports}
                </tbody>
            </Table>
        );
    }
});

export default Reports;
