import { useEffect } from 'react';

const LoginForm = () => {
  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(window.location.search);

    const queryUsername = params.get('username');
    const queryUserId = params.get('userId');
    const queryFirstName = params.get('firstName');
    const queryLastName = params.get('lastName');

    // Store values in localStorage
    if (queryUsername) localStorage.setItem('username', queryUsername);
    if (queryUserId) localStorage.setItem('userId', queryUserId);
    if (queryFirstName) localStorage.setItem('firstName', queryFirstName);
    if (queryLastName) localStorage.setItem('lastName', queryLastName);

    // Console log the values
    console.log('Stored in localStorage:');
    console.log('Username:', queryUsername);
    console.log('UserId:', queryUserId);
    console.log('First Name:', queryFirstName);
    console.log('Last Name:', queryLastName);
  }, []);

  return null; // No UI needed for this functionality
};

export default LoginForm;
