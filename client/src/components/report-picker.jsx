import React from 'react';
import { Button, Modal } from 'react-bootstrap';


const ReportPicker = React.createClass({
    pickReport(e, id) {
        e.preventDefault();
        this.props.onHide();
        this.props.addReport(id);
    },

    render() {
        const reports = Object.keys(this.props.reports).map((id, i) => {
            const report = this.props.reports[id];
            const title = report.name || report.slug || id;
            return <li key={i}><a href="#" onClick={e => this.pickReport(e, id)}>{title}</a></li>;
        });

        return (
            <Modal show={this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Choose a Report</h4>
                    <ul>
                        {reports}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    },
});

export default ReportPicker;
