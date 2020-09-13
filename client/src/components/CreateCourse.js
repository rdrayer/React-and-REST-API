import React, { Component } from 'react';
import Data from '../Data';

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
          <div>
            {errors.length ? 
              <React.Fragment>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                  <ul>
                    {errors.map((err, index) =>
                      <li key={index}>{err}</li>
                    )}
                  </ul> 
                </div>
              </React.Fragment>
              : 
              <hr />
            }
            <form onSubmit={this.create}>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    <input onChange={this.change} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={title} />
                  </div>
                </div>
  
                <div className="course--description">
                  <h4 className="course--label">Description</h4>
                  <div>
                    <textarea onChange={this.change} id="description" name="description" className="" placeholder="Course description..." value={description}></textarea>
                  </div>
                </div>
              </div>
              
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input onChange={this.change} id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={estimatedTime} />
                      </div>
                    </li>
                    
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div><textarea onChange={this.change} id="materialsNeeded" name="materialsNeeded" className="" placeholder="Please list each material..." value={materialsNeeded}></textarea></div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Create Course</button>
                <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )
    }
  
    //Calls createCourse function
    create = (e) => {
      e.preventDefault();
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
        if (errors.errors) {
          this.setState({ errors: errors.errors});
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
  
    cancel = (e) => {
      e.preventDefault();
      this.props.history.push('/');
    }
}

