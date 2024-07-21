import React, { useEffect } from 'react';
import Cards from '../components/Cards';

const Home = () => {
  useEffect(() => {
    // Check if token exists in localStorage
    if (!localStorage.getItem('token')) {
      // Redirect to login page if token is not present
      window.location.href = '/login';
    }
  }, []);
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = '/login'; // Directly changing window location
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h1 style={{ 
          marginLeft: '20px', 
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          fontSize: '2rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderBottom: '2px solid #007bff',
          paddingBottom: '5px',
          marginBottom: '20px'
        }}>Task Manager</h1>
        <button onClick={handleLogout} style={{ marginRight: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>
    
      <div>
        <Cards />
      </div>
    </>
  );
};

export default Home;
