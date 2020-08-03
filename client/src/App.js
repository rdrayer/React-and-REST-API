import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import NotFound from './components/NotFound';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import PrivateRoute from './PrivateRoute';

import withContext from './Context';
import Authenticated from './components/Authenticated';

// Connect header component to context
const HeaderWithContext = withContext(Header);
// This connects the UserSignUp component to context
const UserSignUpWithContext = withContext(UserSignUp);
// Connect UserSignin to context:
const UserSignInWithContext = withContext(UserSignIn); 
// Connect UserSignOut to context:
const UserSignOutWithContext = withContext(UserSignOut);
// Connect Authenticated component to contect:
const AuthWithContext = withContext(Authenticated);

// Connect courses component to context
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);

export default () => (
  <Router>
    <div>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <Route path="/courses/create" component={CreateCourseWithContext} />
        <Route path="/courses/:id/update" component={UpdateCourseWithContext} />
        <Route path="/courses/:id" component={CourseDetailWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);