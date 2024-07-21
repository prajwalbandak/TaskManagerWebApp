// RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
    const[fullname, setFullname] = useState('');
    const [Username, setUsername] = useState('');
    const [PasswordHash, setPasswordHash] = useState('');
    const [confirmPasswordHash, setConfirmPasswordHash] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state

        if (PasswordHash !== confirmPasswordHash) {
            setError('PasswordHashs do not match');
            return;
        }

        try {
            // Make API call to register user
            const response = await axios.post('http://localhost:57251/api/Users/register', {
                Username,
                fullname,
                PasswordHash, 
            });

            // Assuming the API returns a success message upon successful registration
            console.log(response.data); // Adjust according to your API response structure

            // Redirect or navigate to another page upon successful registration
            // For example, navigate to the login page
            window.location.href = '/login'; // Replace with your desired redirect URL

        } catch (error) {
            // Handle different error scenarios based on status codes or other conditions
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data); // This will contain error message from server
                console.log(error.response.status); // This will contain the status code

                // Handle specific errors (e.g., Username already exists)
                if (error.response.status === 409) {
                    setError('Username already exists'); // Inform user about existing Username
                } else {
                    setError('Something went wrong. Please try again later.'); // Generic error message
                }
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('Error connecting to server. Please try again later.');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <div style={{ maxWidth: '400px', width: '100%', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{
  textAlign: 'center',
  marginBottom: '1rem',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#6a0dad', 
  textTransform: 'uppercase',
  textDecoration: 'underline',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f0f0f0',  /* Added background color */
  padding: '0.5rem 1rem'       /* Added padding */
}}>
  Task Manager
</h2>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Create an account</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label htmlFor="Username" style={{ fontSize: '1rem', color: '#333' }}>Username</label>
                    <input type="text" id="Username" name="Username" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="fullname" style={{ fontSize: '1rem', color: '#333' }}>Fullname</label>
                    <input type="text" id="fullname" name="fullname" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }} onChange={(e) => setFullname(e.target.value)} />

                    <label htmlFor="PasswordHash" style={{ fontSize: '1rem', color: '#333' }}>Password</label>
                    <input type="PasswordHash" id="PasswordHash" name="PasswordHash" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }} onChange={(e) => setPasswordHash(e.target.value)} />

                    <label htmlFor="confirmPasswordHash" style={{ fontSize: '1rem', color: '#333' }}>Confirm Password</label>
                    <input type="PasswordHash" id="confirmPasswordHash" name="confirmPasswordHash" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }} onChange={(e) => setConfirmPasswordHash(e.target.value)} />

                    <button type="submit" style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>Register</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                    <a href="/login" style={{ color: '#007bff', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', display: 'inline-block' }}>Already have an account? Sign in</a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
