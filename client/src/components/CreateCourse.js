import React, { Component } from 'react';
import Data from '../Data';
import Form from './Form';

export default class CreateCourse extends Component {

  constructor() {
    super()
    this.data = new Data();
  }

  state = {
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      errors:[],
      userID: '',
      name: ''
    }

  componentDidMount() {
    const { context } = this.props;
    this.setState(() => {
      return {
        userId: context.authenticatedUser.id,
        name: context.authenticatedUser.name
      }
    })
  }
  
    render() {
      const {
        title,
        description,
        estimatedTime,
        materialsNeeded,
        errors
      } = this.state;
  
      return (
        <div className="bounds course--detail">
          <h1>Create Course</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.create}
            submitButtonText="Create Course"
            elements={() => (
              <React.Fragment>
               <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>                    
                    <input 
                      onChange={this.change}
                      id="title"
                      name="title" 
                      type="text"
                      className="input-title course--title--input"
                      placeholder="Course title..."
                      value={title} />
                  </div>
                  <p>By {this.state.name}</p>
                  </div>
                <div className="course--description">
                  <h4 className="course--label">Description</h4>
                  <div>
                    <textarea 
                      onChange={this.change}
                      id="description"
                      name="description"
                      className=""
                      placeholder="Course description..."
                      value={description}>
                    </textarea>
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
                          onChange={this.change}
                          id="estimatedTime"
                          name="estimatedTime"
                          type="text"
                          className="course--time--input"
                          placeholder="Hours"
                          value={estimatedTime} />
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea 
                          onChange={this.change} 
                          id="materialsNeeded"
                          name="materialsNeeded"
                          className=""
                          placeholder="Please list each material..."
                          value={materialsNeeded}>
                        </textarea>
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
  
    //Calls createCourse function
    create = () => {
      //e.preventDefault();
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
      }
  
      //console.log(course, "course")
      //console.log(emailAddress, "emailaddy")
      //console.log(password, "pw")
      context.data.createCourse(course, emailAddress, password)
      .then(errors => {
        //console.log(errors);
        if (errors.length > 0) {
          this.setState({ errors });
        } else {
          this.props.history.push('/');
          //console.log(context.authenticatedUser)
        }
      })
      .catch( err => { 
        console.log(err);
        this.props.history.push('/error');
      })
    }
  
    change = (e) => {
      const name = e.target.name;
      const value = e.target.value;
  
      this.setState(() => {
        return {
          [name]: value
        };
      });
    }
  
    cancel = () => {
      this.props.history.push('/');
    }
}

