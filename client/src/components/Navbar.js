import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

// AppNavbar component definition
const AppNavbar = () => {
  // Set modal display state using React hooks
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Navbar */}
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            Google Books Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar'>
            <Nav className='ml-auto'>
              {/* Navigation links */}
              <Nav.Link as={Link} to='/'>
                Search For Books
              </Nav.Link>
              {/* Conditional rendering based on user login status */}
              {Auth.loggedIn() ? (
                // Show saved books and logout links if the user is logged in
                <>
                  <Nav.Link as={Link} to='/saved'>
                    See Your Books
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                // Show login/signup link if the user is not logged in
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Modal for Login/Signup */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* Tab container to switch between Signup and Login components */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                {/* Tab navigation for Login and Signup */}
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              {/* Tab Pane for Login */}
              <Tab.Pane eventKey='login'>
                {/* Rendering LoginForm component */}
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              {/* Tab Pane for Signup */}
              <Tab.Pane eventKey='signup'>
                {/* Rendering SignUpForm component */}
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
