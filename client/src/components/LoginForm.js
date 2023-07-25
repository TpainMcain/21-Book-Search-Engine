// Importing necessary modules and components
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Importing authentication utility and GraphQL mutation
import Auth from '../utils/auth';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_USER } from '../utils/mutations';

// LoginForm component definition
const LoginForm = () => {
  // State variables using React hooks
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loginUser] = useMutation(LOGIN_USER);

  // Event handler for input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Event handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Checking form validation (using react-bootstrap)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Performing login mutation using Apollo useMutation hook
      const { data } = await loginUser({
        variables: { ...userFormData }
      });

      // Calling the Auth utility to set user token upon successful login
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Resetting the form fields after submission
    setUserFormData({
      email: '',
      password: '',
    });
  };

  // Rendering the login form
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Displaying an alert if login fails */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        {/* Email input field */}
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Password input field */}
        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Submit button */}
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
