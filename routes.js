'use strict';

const express = require('express');

// construct a router instance
const router = express.Router();

const User = require('./models').User;
const Course = require('./models').Course;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        next(error);
      }
    }
}

// plan user routes
// send GET request to /users 200 to return currently authenticated user
/*router.get('/users', asyncHandler(async(req, res) => {
    const user = await user.findByPk({
      
    });
    if (user) {
      res.status(200).json(user);
    }
}));*/

// send POST request to /users 201 to create user (sets the location header to '/', and returns no content)

// plan course routes
// send GET request to /courses 200 to return list of courses (includes the user that owns each course)
// send GET request to /courses/:id 200 to return the course for the provided course id
// send POST request to /courses 201 to create a course (sets the location header to the uri for the course, returns no content)
// send PUT request to /courses/:id 204 to update a course and return no content
// send a DELETE request to /courses/:id 204 to delete a course and return no content


module.exports = router;