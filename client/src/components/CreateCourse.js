import React, { Component } from 'react';
import Form from './Form';
import Data from '../Data';

export default class CreateCourse extends Component {
constructor() {
    super()
        this.data = new Data();
    }

    state = {
        title: '',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        userId: '',
        name: '',
        errors: [],
    } 

    componentDidMount() {
    const { context } = this.props;
    this.setState(() => {
        return {
            authenticatedUser: context.authenticatedUser
        }
    })
    }

    render() {
    const {
        title,
        description,
        estimatedTime,
        materialsNeeded,
        errors,
    } = this.state;
    
    return(
        <div className="bounds course--detail">
        <h1>Create Course</h1>
        <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create Course"
            elements={() => (
            <React.Fragment>
                <div className="grid-66">
                <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <div>
                    <input 
                        id="title" 
                        name="title" 
                        type="text" 
                        value={title}
                        onChange={this.change} 
                        className="input-title course--title--input" 
                        placeholder="Course title..." />
                    </div>
                    <p>By {this.state.name}</p>
                </div>
                <div className="course--description">
                    <div>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={description}
                        onChange={this.change} 
                        placeholder="Course description..."
                        className="course--description" />
                    </div> 
                </div>
                </div> 
                <div className="grid-25 grid-right">
                <div className="course--stats">
                    <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div>
                        <input 
                            id="estimatedTime" 
                            name="estimatedTime" 
                            type="text"
                            value={estimatedTime} 
                            onChange={this.change} 
                            className="course--time--input"                              
                            placeholder="Hours" />
                        </div>
                    </li>
                    <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <div>
                        <textarea
                            id="materialsNeeded" 
                            name="materialsNeeded"
                            value={materialsNeeded}
                            onChange={this.change} 
                            placeholder="List materials..." 
                        ></textarea>
                        </div>
                    </li>
                    </ul>
                </div>
                </div>
            </React.Fragment>
            )} />
        </div>
    )
    }

    change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
        return {
        [name]: value
        };
    });
    }

    //Check for authorized user  
    submit = () => {
    const { context } = this.props;
    const { emailAddress, password } = context.authenticatedUser;
    const {
        title,
        description,
        estimatedTime,
        materialsNeeded,
        userId
    } = this.state;

    const course = {
        title,
        description,
        estimatedTime,
        materialsNeeded,
        userId
    };
    
    context.data.createCourse(course, emailAddress, password).then( errors => {
        if (errors && errors.length > 0){
        this.setState({ errors });
        } else {
        this.props.history.push('/')
        }
    })
    .catch( err => {
        console.log(err);
        this.props.history.push('/error');
    });
    }
    
    cancel = () => {
        this.props.history.push('/');
    }
}

