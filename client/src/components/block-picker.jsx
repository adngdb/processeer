import React from 'react';
import { Button, Modal } from 'react-bootstrap';


const BlockPicker = React.createClass({
    pickBlock(e, id) {
        e.preventDefault();
        this.props.onHide();
        this.props.addBlock(id);
    },

    render() {
        const blocks = Object.keys(this.props.blocks).map((id, i) => {
            const block = this.props.blocks[id];
            const title = block.name || block.slug || id;
            return <li key={i}><a href="#" onClick={e => this.pickBlock(e, id)}>{title}</a></li>;
        });

        return (
            <Modal show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Choose a Block</h4>
                    <ul>
                        {blocks}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    },
});

export default BlockPicker;
