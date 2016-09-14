import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const EditNav = ({history}) => {
    let backToReport = null;
    if (history.report) {
        backToReport = (
            <LinkContainer to={ {pathname: '/edit/report/' + history.report} }>
                <Button>
                    <Glyphicon glyph="chevron-left" /> Back to report
                </Button>
            </LinkContainer>
        );
    }
    return (<div>
        {backToReport}
        <LinkContainer to={ {pathname: '/edit/view/' + history.view} }>
            <Button>
                <Glyphicon glyph="chevron-left" /> Back to view
            </Button>
        </LinkContainer>
    </div>);
};

export default EditNav;
