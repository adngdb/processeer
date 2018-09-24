import React from 'react';
import { Col, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';


export default class ReportInput extends React.Component {
    updateReportInput(e) {
        const key = e.target.dataset.param;
        const value = e.target.value;

        this.props.updateInput(key, value);
    }

    render() {
        const params = this.props.block.params || [];
        const input = this.props.input || {};

        const ui = params.map((param, i) =>
             (<FormGroup key={i} controlId={`report-params-${param.name}`}>
                <Col componentClass={ControlLabel} sm={2}>
                    {param.name}
                </Col>
                <Col sm={10}>
                    <FormControl type="text" value={input[param.name]} placeholder={param.defaultValue} data-param={param.name} onChange={this.updateReportInput} />
                </Col>
            </FormGroup>)
        );

        return (<Form horizontal>
            {ui}
        </Form>);
    }
}
