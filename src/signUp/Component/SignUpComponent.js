import React, {Component} from 'react';
import '../assets/css/index.css';

export class SignUpComponent extends Component {

    render() {
        const {handleOnChange, handleOnSubmit} = this.props;
        const {name, color} = this.props.form;
        return (
            // <div className="container">
            //     {validationMessage && <div className="alert">
            //         <span className="closebtn" onClick="this.parentElement.style.display='none';">&times;</span>
            //         <strong>Danger!</strong> Field Name is required.
            //     </div>
            //     }
            //     <label htmlFor="name">Name</label>
            //     <input type="text" id="name" name="name"
            //            placeholder="Your name.." value={name} onChange={handleOnChange}/>
            //     <label htmlFor="color">Color</label>
            //     <select id="color" name="color" value={color} onChange={handleOnChange}>
            //         <option value="light">Light</option>
            //         <option value="dark">Dark</option>
            //     </select>
            //     <button className="button" onClick={handleOnSubmit}>Start</button>
            // </div>

            <div className="signup-form">

                <div className="form-header">
                    <h1>Checkers</h1>
                </div>

                <div className="form-body">
                    <div className="horizontal-group">
                        <div className="form-group ">
                            <label htmlFor="name" className="label-title">Your name *</label>
                            <input type="text" id="name" className="form-input"
                                   placeholder="Name" required="required"
                                   name={'name'}
                                   value={name} onChange={handleOnChange}/>
                        </div>
                    </div>

                    <div className="horizontal-group">
                        <div className="form-group">
                            <label className="label-title">Color:</label>
                            <div className="input-group">
                                <label htmlFor="light"><input type="radio" name="color" value="light"
                                                              checked={color === 'light'}
                                                              onChange={handleOnChange}
                                                              id="light"/> White</label>
                                <label htmlFor="dark"><input type="radio" name="color" value="dark"
                                                             checked={color === 'dark'}
                                                             onChange={handleOnChange}
                                                             id="dark"/> Red</label>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="form-footer">
                    <span>* required</span>
                    <button type="submit" className="btn" onClick={handleOnSubmit}>Start</button>
                </div>

            </div>
        );
    }
}
