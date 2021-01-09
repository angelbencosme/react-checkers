import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Checkers from './checkers';
import {SignUpComponent} from './signUp';

class Index extends Component {

    state = {
        form: {
            name: '',
            color: 'light'
        },
        validationMessage: '',
        start: false
    };

    handleOnSubmit = () => {
        this.setState({start: true, validationMessage: false})
    }

    handleOnChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({form: {...this.state.form, [name]: value}});
    }

    render() {
        const {form, validationMessage, start} = this.state;
        return (
            <div>
                {!start &&
                <SignUpComponent validationMessage={validationMessage} form={form}
                                 handleOnSubmit={this.handleOnSubmit}
                                 handleOnChange={this.handleOnChange}/>}

                {start && <Checkers color={form.color} name={form.name}/>}
            </div>
        );
    }
}

ReactDOM.render(
    <Index/>,
    document.getElementById('root')
);
