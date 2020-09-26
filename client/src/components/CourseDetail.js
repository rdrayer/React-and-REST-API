import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {

    constructor(props) {
        super (props)
        this.state = {
            course: '',
            author: [],
            authenticatedUser: [],
        };

    }
    
    //Loads the course data
    componentDidMount() {
       const { context } = this.props;
       context.data.getCourse(this.props.match.params.id)
       .then(course => {
           if(course) {
               this.setState({
                   course,
                   author: course.User,
                   authenticatedUser: context.authenticatedUser
               });
           }
       })
       .catch( err => {
           this.props.history.push("/error");
       })
    }

    authUpdate = () => {
        const courseId = this.props.match.params.id;
        const { authenticatedUser, author } = this.state;
        if (authenticatedUser) {
            if(author.id === authenticatedUser.id) {
                //console.log('authUse');
                return(
                    <span>
                        <Link className="button" to={`/courses/${courseId}/update`}>Update Course</Link>
                        <Link className="button" onClick={this.deleteCourse} to={`/courses/${courseId}`}>Delete Course</Link>
                        <Link className="button button-secondary" to="/">Return to List</Link>
                    </span>
                )
            } else {
                return (
                    <Link className="button button-secondary" to="/">Return to List</Link>
                )
            }
        }
    }

    //This will call deleteCourse from Data and allow the authenticated owner of the course the ability to delete.
    deleteCourse = () => {
        const { context } = this.props;
        const { authenticatedUser } = this.state;
        const emailAddress = authenticatedUser.emailAddress;
        const password = authenticatedUser.password;
        const id = this.props.match.params.id;

        context.data.deleteCourse(id, emailAddress, password)
        .then(errors => {
            if(errors.length) {
                this.setState({ errors });
            } else {
                //console.log("delete success");
                this.props.history.push("/");
            }
        })
        .catch((err) => {
            //console.log("notfound");
            this.props.history.push("/NotFound");
        })
    }

    render() {
        const { course, author, } = this.state;

        return(
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">     
                            {this.authUpdate()}
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            <p>By {author.firstName + " " + author.lastName}</p>
                        </div>
                        <div className="course--description">
                            <ReactMarkdown>{course.description}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                        <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
       
}

