import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class EditNav extends React.Component {
    render() {
        let backToBlock = null;
        let backToReport = null;
        if (this.props.history.block) {
            backToBlock = (
                <LinkContainer to={{ pathname: `/edit/block/${this.props.history.block}` }}>
                    <Button>
                        <Glyphicon glyph="chevron-left" /> Back to block
                    </Button>
                </LinkContainer>
            );
        }
        if (this.props.history.report) {
            backToReport = (
                <LinkContainer to={{ pathname: `/edit/report/${this.props.history.report}` }}>
                    <Button>
                        <Glyphicon glyph="chevron-left" /> Back to report
                    </Button>
                </LinkContainer>
            );
        }
        return (<div>
            {backToBlock}
            {backToReport}
        </div>);
    }
}
