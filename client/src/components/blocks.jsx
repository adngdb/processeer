import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';


/*
 * Props:
 *   views
 *   deleteBlock
 *   fetchBlocks
 */
const Blocks = React.createClass({
    componentWillMount() {
        this.props.fetchBlocks();
    },

    render() {
        const blocks = Object.keys(this.props.blocks).map((id, i) => {
            const block = this.props.blocks[id];
            const title = block.name || block.slug || id;
            return (<tr key={i}>
                <td>
                    <Link to={{ pathname: `/edit/block/${id}` }}>{title}</Link>
                </td>
                <td>
                    <LinkContainer to={{ pathname: `/edit/block/${id}` }}>
                        <Button>Edit</Button>
                    </LinkContainer>
                </td>
                <td><Button onClick={() => this.props.deleteBlock(id)}>Remove</Button></td>
            </tr>);
        });

        return (
            <Table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td />
                        <td />
                    </tr>
                </thead>
                <tbody>
                    {blocks}
                </tbody>
            </Table>
        );
    },
});

export default Blocks;
