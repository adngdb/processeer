import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const EditNav = React.createClass({
    render() {
        let backToBlock = null;
        let backToView = null;
        if (this.props.history.block) {
            backToBlock = (
                <LinkContainer to={{ pathname: `/edit/block/${this.props.history.block}` }}>
                    <Button>
                        <Glyphicon glyph="chevron-left" /> Back to block
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
            {backToBlock}
            {backToView}
        </div>);
    },
});

export default EditNav;
