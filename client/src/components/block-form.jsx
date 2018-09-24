import React from 'react';
import {
    ControlLabel,
    FormControl,
    FormGroup,
} from 'react-bootstrap';

import BlockController from './block-controller.jsx';
import BlockModelsForm from './block-models-form.jsx';
import BlockParamsForm from './block-params-form.jsx';


export default class BlockForm extends React.Component {
    updateBlockName = (e) => {
        const { block } = this.props;
        this.props.updateBlock(
            block.id,
            { name: e.target.value }
        );
    }

    updateController = (newCode) => {
        const { block } = this.props;
        this.props.updateController(block.id, newCode);
    }

    render() {
        const { block, updateBlock, updateBlockParam } = this.props;

        return <div>
            <FormGroup controlId="blockName">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                    type="text"
                    value={ block.name }
                    onChange={ this.updateBlockName }
                />
            </FormGroup>

            <BlockParamsForm
                block={ block }
                updateBlock={ updateBlock }
                updateBlockParam={ updateBlockParam }
            />

            <BlockModelsForm
                block={ block }
                updateBlock={ updateBlock }
            />

            <BlockController updateController={ this.updateController }>
                { block.controller }
            </BlockController>
        </div>;
    }
}
