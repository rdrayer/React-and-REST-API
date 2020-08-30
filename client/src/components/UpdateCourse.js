import React, { Component } from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
          title: '',
          description: '',
          estimatedTime: '',
          materialsNeeded: '',
          user: '',
          courseId: '',
          userId: '',
          errors: []
        }
      }
      
    
      /**
       * Checks for course details based on the ID param, if a course exists,
       * setState is triggered with the requested data. If a user is not Authorized to make changes 
       * on that course. User is re-routed to Forbidden. If a course is not found, user is redirected to notfound.
       */
    
      componentDidMount() {
        const { context } = this.props;
        const authUser = this.props.context.authenticatedUser;
        context.data.courseDetail(this.props.match.params.id).then(course => {
          if (course) {
            this.setState({
              title: course.title,
              description: course.description,
              estimatedTime: course.estimatedTime,
              materialsNeeded: course.materialsNeeded,
              user: course.user,
              courseId: course.id,
              userId: course.userId
            });
          }
          if (!authUser || authUser.Id !== this.state.user.id){
            this.props.history.push('/forbidden')
          }
          if (!course) {
            this.props.history.push('/notfound')
          }
        })
        .catch((err) => {
          console.log(err);
          this.props.history.push('/error')
        });
      }
    
      /**
       * Renders the Update Course page if Authorized.
       */
      
      render() {
        const { context } = this.props;
        const  {
        title,
        description,
        estimatedTime,
        materialsNeeded,
        errors
        } = this.state;
      
        return(
          <div className="bounds course--detail">
            <h1>Update Course</h1>
            <Form
              cancel={this.cancel}
              errors={errors}
              submit={this.submit}
              submitButtonText="Update Course"
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
                      <p>By {context.authenticatedUser.Name}</p>
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
    
      //Updates state based on Form field values.
    
      change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState(() => {
          return {
            [name]: value
          };
        });
      }
    
      /**
       * Allows user to Update a course only it they were the one to Author the course. 
       * A user cannot Update someone elses Course.
       */
    
      submit = () => {
        const { context } = this.props;
        const { emailAddress, password } = context.authenticatedUser;
        const courseId = this.props.match.params.id;
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          user
        } = this.state;
    
        
        const course = {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          user
        };
        
        context.data.updateCourse(courseId, course, emailAddress, password)
        .then( errors => {
          if (errors.length > 0){
            this.setState({ errors });
          } else if (errors.length === 0) {
            this.props.history.push(`/courses/${courseId}`)
          } else {
            this.props.history.push('/notfound')
          }
        })
        .catch( err => {
          console.log(err);
          this.props.history.push('/error');
        });
      }
      
    
      //Redirects users back to the Course page that was currently being updated if the cancel button is clicked.  
    
      cancel = () => {
        const courseId = this.props.match.params.id;
        this.props.history.push(`/courses/${courseId}`);
      }
}
    




