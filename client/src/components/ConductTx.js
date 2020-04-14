import React, {Component} from 'react';
import {FormGroup, FormControl} from "react-bootstrap";
import {Link} from 'react-router-dom';

class ConductTx extends Component {
    state = {recipient: '', amount: 0};

    updateRecipient = event => {
        this.setState({recipient: String(event.target.value)});
    }

    updateAmount = event => {
        this.setState({amount: Number(event.target.value)});
    }

    render() {
        console.log('this.state', this.state);

        return (
            <div className='ConductTx'>
                <h3>Conduct a transaction</h3>
                <br/>
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='Recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        input='number'
                        placeholder='Amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
                <Link to='/'>Back to wallet</Link>
            </div>
        )
    }
}

export default ConductTx;