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
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    emailAddress: user.emailAddress,
  });
}));

// send POST request to /users 201 to create user (sets the location header to '/', and returns no content)
router.post('/users', asyncHandler(async(req, res) => {
  const user = req.body;
  user.password = bcryptjs.hashSync(user.password);
  await User.create(req.body);
  return res.status(201).end();
}));

// plan course routes
// send GET request to /courses 200 to return list of courses (includes the user that owns each course)
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll();
    res.json(courses);
}));

// send GET request to /courses/:id 200 to return the course for the provided course id
router.get('/courses/:id', asyncHandler(async(req, res) => {
  res.status(200)
}));

// send POST request to /courses 201 to create a course (sets the location header to the uri for the course, returns no content)
router.post('/courses', asyncHandler(async(req, res) => {
  res.status(201)
}));
// send PUT request to /courses/:id 204 to update a course and return no content
router.put('/courses/:id', asyncHandler(async(req, res) => {
  res.status(204)
}));

// send a DELETE request to /courses/:id 204 to delete a course and return no content
router.delete('/courses/:id', asyncHandler(async(req, res) => {
  res.status(204)
}));

module.exports = router;