'use strict';

// connect modules
const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// construct a router instance
const router = express.Router();
// connect models
const User = require('./models').User;
const Course = require('./models').Course;

// handler function to wrap each route
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(err) {
        next(err);
    }
  }
}

// Authentication Middleware
const authenticateUser = async (req, res, next) => {
  let message = null;
  const users = await User.findAll();
  // Parse the user's credentials from the Authorization header
  const credentials = auth(req);

  // If the user's credentials are available
  if (credentials) {
    // Attempt to retrieve the user from the data store by their email address (user's key) from the Authorization header
    const user = users.find(u => u.emailAddress === credentials.name);
    
    // If a user was successfully retrieved from the data store
    if (user) {
      // Use the bcryptjs npm package to compare the user's password from the Auth header to the user's password that was retrieved from the data store
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

      // If the passwords match
      if (authenticated) {
        console.log(`Authentication successful for email address: ${user.emailAddress}`);
        // Then store the retrieved user object on the request object so any middleware functions that follow this middleware will have access to the user's info
        req.currentUser = user;
      } else {
        message = `Authentication failure for email address: ${credentials.name}`;
      }
    } else {
      message = `User not found for email address: ${credentials.name}`;
    }
  } else {
    message = 'Authorization header not found';
  }

    // If user auth failed
    if (message) {
      console.warn(message);

      // Return a response with a 401 Unauthorized HTTP status code
      res.status(401).json({ message: 'Access Denied' });
    } else {
      // Or if the user auth succeeded, call the next() method
      next();
    }
};

// plan user routes
// send GET request to /users 200 to return currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {  
  const authenticatedUser = req.currentUser;
  const user = await User.findByPk(authenticatedUser.id, {
    attributes: {
      exclude: ['password', 'createdAt','updatedAt']
    }
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: 'User not found!' });
  }
}));

// send POST request to /users 201 to create user (sets the location header to '/', and returns no content)
router.post('/users', asyncHandler(async(req, res) => {
  const user = req.body;
  user.password = bcryptjs.hashSync(user.password);
  await User.create(req.body);
  return res.status(201).location('/').end();
}));

// plan course routes
// send GET request to /courses 200 to return list of courses (includes the user that owns each course)
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [{ model: User, attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }}]
    });
    res.status(200).json(courses);
}));

// send GET request to /courses/:id 200 to return the course for the provided course id
router.get('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [{ model: User, attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }}]
  });
  res.status(200).json(course);
}));

// send a POST request to /courses 201 to create a course (sets the location header to the uri for the course, returns no content)
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  const createCourse = await Course.create(req.body);
  if (createCourse) {
    res.status(201).location('/courses' + course.id).end();
  } else {
    res.status(400).json();
  }
}));

// send a PUT request to /courses/:id 204 to update a course and return no content
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const authenticatedUser = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  if (authenticatedUser.id = course.userId) {
    await course.save();
    res.status(204).end();
  } else {
    res.status(403).json({ message: 'Changes to this course can only be made by the authorized user' });
  }
}));

// send a DELETE request to /courses/:id 204 to delete a course and return no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const authenticatedUser = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if (authenticatedUser.id === course.userId) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'Changes to this course can only be made by the authorized user' });
    } 
  } else {
      res.status(400).json();
  }
}));

module.exports = router;