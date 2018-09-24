import React from 'react';
import { PageHeader } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


class EditHomePage extends React.Component {
    render() {
        return (
            <div>
                <PageHeader>
                    Processeer <small>User documentation</small>
                </PageHeader>

                <p>
                    <Link to="/report/c429363f-3217-4732-a701-83a83e065612">Example Report</Link>
                </p>
            </div>
        );
    }
}

const mapStateToProps = state =>
     ({
         reports: state.reports,
         blocks: state.blocks,
     })
;

export default connect(mapStateToProps)(EditHomePage);
