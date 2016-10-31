import React from 'react';
import { PageHeader, Panel } from 'react-bootstrap';
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
                    <Link to="/view/c429363f-3217-4732-a701-83a83e065612">Example View</Link>
                </p>
            </div>
        );
    },
});

const mapStateToProps = state =>
     ({
         views: state.views,
         reports: state.reports,
     })
;

export default connect(mapStateToProps)(EditHomePage);
