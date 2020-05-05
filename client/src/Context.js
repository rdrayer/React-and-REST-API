import React, { Component } from 'react';
// Import the Data.js file containing the helper class:
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null
  };

  constructor() {
    super();
    // Initialize a new instance of the Data class inside the constructor() method.
    this.data = new Data();
  }

  render() {
    // Use destructuring assignment to extract authenticatedUser from this.state
    const { authenticatedUser } = this.state;

    // Create a value object to provide the utility methods of the class Data.
    const value = {
      // Pass state to <Context.Provider> by adding authenticatedUser to the value object
      authenticatedUser,
      data: this.data,
      actions: { 
        signIn: this.signIn,
        signOut: this.signOut,
      }
    };

    return (
      // Value represents an object containing the context to be shared throughout the component tree.
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  
  signIn = async (emailAddress, password) => {
    // Initialize a var named user and set the value to await a promise returned by this.data.getUser()
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null) {
      // If the value of user is not null, update the authenticatedUser state to the value of user:
      this.setState(() => {
        return {
          authenticatedUser: user,
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
    // Set signIn to reutrn the user object stored in the variable user:
    return user;

  }

  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
      };
    });
    Cookies.remove('authenticatedUser');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

