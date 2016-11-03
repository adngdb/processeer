import React from 'react';
import { PageHeader } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';


const EditHomePage = React.createClass({
    render() {
        return (
            <div>
                <PageHeader>
                    Mozilla Reports Builder <small>User documentation</small>
                </PageHeader>

                <p>
                    <Link to="/report/c429363f-3217-4732-a701-83a83e065612">Example Report</Link>
                </p>
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         reports: state.reports,
         blocks: state.blocks,
     })
;

export default connect(mapStateToProps)(EditHomePage);
