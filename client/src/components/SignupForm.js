import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import Auth from '../utils/auth';
import { useMutation } from '@apollo/react-hooks';
import { ADD_USER } from '../utils/mutations';

// SignupForm component definition
const SignupForm = () => {
  // State variables using React hooks
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [createUser] = useMutation(ADD_USER);

  // Event handler for input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Event handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Perform the user creation mutation using Apollo useMutation hook
      const { data } = await createUser({
        variables: { ...userFormData }
      });

      // Call the Auth utility to set user token upon successful signup
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset the form fields after submission
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  // Rendering the signup form
  return (
    <>
      {/* Form with validation functionality */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show an alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        {/* Username input field */}
        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Email input field */}
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
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
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
