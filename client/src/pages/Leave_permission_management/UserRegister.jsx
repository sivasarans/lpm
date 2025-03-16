import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserRegisterUI from './UserRegisterUI';
import { useNavigate } from 'react-router-dom';

const UserRegisterScript = () => {
  const [formData, setFormData] = useState({
    name: 'TVK',
    email: 'x@gamil.com',
    role_id: '1',
    user_id: '123',
    role_name: 'Admin',
    password: '1',
    profile_picture: null,
    gender: 'Male', // Added gender field
    joining_date: new Date().toISOString().split('T')[0], // Added joining_date field
    status: 'Active', // Added status field
  });
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Added for editing functionality

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/add_user', {
      state: { formData },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile_picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profile_picture) {
      setAlertMessage({ message: 'Please upload a profile picture.', type: 'error' });
      return;
    }

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });
    // console.log('Form Data Preview:');
    // for (let [key, value] of formDataToSubmit.entries()) {
    //   console.log(`${key}:`, value);
    // }
    try {
      const url = editingUser
        ? `http://localhost:5000/add_user/${editingUser.user_id}` // Update if editing
        : 'http://localhost:5000/add_user'; // Add new user if not editing

      const method = editingUser ? 'put' : 'post';
      await axios[method](url, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAlertMessage({ message: 'User registered successfully!', type: 'success' });
      fetchUsers();
      setEditingUser(null); // Reset editing state after submission
    } catch (error) {
      setAlertMessage({
        message: error.response?.data?.error || 'Error registering user.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setAlertMessage({ message: '', type: '' }), 3000);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/add_user');
      setUsers(response.data.result);
    } catch (error) {
      setError('Error fetching users');
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ...user,
      profile_picture: null, // Reset the profile picture when editing
    });
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/add_user/${userId}`);
      setAlertMessage({ message: 'User deleted successfully!', type: 'success' });
      fetchUsers();
    } catch (error) {
      setAlertMessage({
        message: error.response?.data?.error || 'Error deleting user.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setAlertMessage({ message: '', type: '' }), 3000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserRegisterUI
      formData={formData}
      setFormData={setFormData} // Pass setFormData here
      handleChange={handleChange}
      handleFileChange={handleFileChange}
      handleSubmit={handleSubmit}
      users={users}
      alertMessage={alertMessage}
      handleNavigate={handleNavigate}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      editingUser={editingUser}
      setEditingUser={setEditingUser}
    />
  );
};

export default UserRegisterScript;
