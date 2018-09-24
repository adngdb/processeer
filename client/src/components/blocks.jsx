import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';


/*
 * Props:
 *   reports
 *   deleteBlock
 *   fetchBlocks
 */
export default class Blocks extends React.Component {
    componentWillMount() {
        this.props.fetchBlocks();
    }

    render() {
        if (Object.keys(this.props.blocks).length === 0) {
            return (<p>No blocks yet. </p>);
        }

        const blocks = Object.keys(this.props.blocks).map((id, i) => {
            const block = this.props.blocks[id];
            const title = block.name || id;

            let editLink = null;
            let removeLink = null;
            if (this.props.user.authenticated) {
                editLink = (<LinkContainer to={{ pathname: `/edit/block/${id}` }}>
                    <Button>Edit</Button>
                </LinkContainer>);
                removeLink = <Button onClick={() => this.props.deleteBlock(id)}>Remove</Button>;
            }

            return (<tr key={i}>
                <td>
                    <Link to={{ pathname: `/edit/block/${id}` }}>{title}</Link>
                </td>
                <td>{editLink}</td>
                <td>{removeLink}</td>
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
    }
}
