import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state

        try {
            // Make API call to authenticate user
            const response = await axios.post('http://localhost:57251/api/users/login', {
                username,
                Password
            });
            console.log(" response " + response);
            // Assuming the API returns a token upon successful login
            const token = response.data.Token; 
            const user_id = response.data.user_id;// Adjust according to your API response structure

            // Store token in localStorage or sessionStorage
            localStorage.setItem('token', token);
            localStorage.setItem("user_id",user_id )

            // Redirect or navigate to another page upon successful login
            // For example, navigate to the dashboard or home page
            window.location.href = '/'; // Replace with your desired redirect URL

        } catch (error) {
            // Handle different error scenarios based on status codes or other conditions
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data); // This will contain error message from server
                console.log(error.response.status); // This will contain the status code

                // Handle specific errors (e.g., invalid credentials)
                if (error.response.status === 401) {
                    setError('Invalid username or Password'); // Inform user about invalid credentials
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

                <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Sign in to your account</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label htmlFor="username" style={{ fontSize: '1rem', color: '#333' }}>Username</label>
                    <input type="text" id="username" name="username" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }} onChange={(e) => setUsername(e.target.value)} />

                    <label htmlFor="Password" style={{ fontSize: '1rem', color: '#333' }}>Password</label>
                    <input type="Password" id="Password" name="Password" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }} onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>Sign in</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                <Link to="/Register" style={{ color: '#007bff', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', display: 'inline-block' }}>Don't have an account? Register</Link>
  </div>
            </div>
        </div>
    );
};

export default LoginPage;
