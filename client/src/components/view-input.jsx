import React from 'react';
import { Col, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';


const ViewInput = React.createClass({
    updateViewInput(e) {
        let key = e.target.dataset.param;
        let value = e.target.value;

        this.props.updateInput(key, value);
    },

    render() {
        let params = this.props.report.params || [];
        let input = this.props.input || {};

        let ui = params.map((param, i) => {
            return (<FormGroup key={i} controlId={'view-params-' + param.name}>
                <Col componentClass={ControlLabel} sm={2}>
                    {param.name}
                </Col>
                <Col sm={10}>
                    <FormControl type="text" value={input[param.name]} placeholder={param.defaultValue} data-param={param.name} onChange={this.updateViewInput} />
                </Col>
            </FormGroup>);
        });

        return (<Form horizontal>
            {ui}
        </Form>);
    }
});

export default ViewInput;
