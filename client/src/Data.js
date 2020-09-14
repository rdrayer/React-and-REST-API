import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  async getUser(emailAddress, password) {
    const res = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    if (res.status === 200) {
      //console.log('getUser');
      return res.json().then(data => data);
    }
    else if (res.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  async createUser(user) {
    const res = await this.api('/users', 'POST', user);
    if (res.status === 201) {
      console.log("user has been created, res 201");
      return [];
    }
    else if (res.status === 400) {
      return res.json().then(data => {
        console.log("api error for user creation");
        return data.errors;
      });
    }
    else {
      throw new Error(
        'POST USER error'
      );
    }
  }

  // Courses
  async getCourses() {
    const res = await this.api('/courses', 'GET', null, false, null);
    if (res.status === 200) {
      return res.json().then((data) => data);
    } else {
      console.log(res);
      throw new Error(
        'GET COURSES error'
      );
    }
  }

  async getCourse(id) {
    const res = await this.api(`/courses/${id}`, 'GET', null, false, null);
    if (res.status === 200) {
      return res.json().then((data) => data);
    } else {
      throw new Error(
        'GET COURSE error'
      );
    }
  }

  async createCourse(course, emailAddress, password) {
    const res = await this.api('/courses', 'POST', course, true, { emailAddress, password });
    if (res.status === 201) {
      return [];
    } else if (res.status === 400) {
      return res.json().then(data => {
        return data.errors;
      });
    } else {
      throw new Error(
        'POST COURSE error'
      );
    }
  }

  async updateCourse(courseId, course, emailAddress, password) {
    const res = await this.api(`/courses/${courseId}`, 'PUT', course, true, { emailAddress, password });
    if (res.status === 204) {
      return [];
    } else if (res.status === 400 || res.status === 401 || res.status === 403) {
      return res.json().then(data => {
        return data.errors;
      });
    } else {
      throw new Error(
        'PUT COURSE error'
      );
    }
  }

  async deleteCourse(courseId, emailAddress, password) {
    const res = await this.api(`/courses/${courseId}`, 'DELETE', null, true, { emailAddress, password });
    //console.log(id);
    //console.log(emailAddress, "email");
    //console.log(password, "pw");
    if (res.status === 204) {
      return [];
    } else if (res.status === 403) {
      return res.json().then(data => {
        console.log('DELETE COURSE 403, forbidden', data.errors)
        return data.errors;
    });
  } else if (res.status === 404) {
    return res.json().then((data => {
      console.log('DELETE COURSE 404, not found', data.errors)
      return data.errors;
    })); 
  } else {
    throw new Error(
      'DELETE COURSE error'
      );
    }
  }
}