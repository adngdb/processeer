import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const EditNav = React.createClass({
    render() {
        let backToReport = null;
        let backToView = null;
        if (this.props.history.report) {
            backToReport = (
                <LinkContainer to={{ pathname: `/edit/report/${this.props.history.report}` }}>
                    <Button>
                        <Glyphicon glyph="chevron-left" /> Back to report
                    </Button>
                </LinkContainer>
            );
        }
        if (this.props.history.view) {
            backToView = (
                <LinkContainer to={{ pathname: `/edit/view/${this.props.history.view}` }}>
                    <Button>
                        <Glyphicon glyph="chevron-left" /> Back to view
                    </Button>
                </LinkContainer>
            );
        }
        return (<div>
            {backToReport}
            {backToView}
        </div>);
    },
});

export default EditNav;
