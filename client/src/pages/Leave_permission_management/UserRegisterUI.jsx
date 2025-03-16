import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

const UserRegisterUI = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  users,
  alertMessage,
  handleNavigate,
  handleEdit,
  handleDelete,
  editingUser,
  setFormData,
  setEditingUser,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    if (isFormVisible) {
      setFormData({
        name: '',
        email: '',
        role_name: '',
        user_id: '',
        password: '',
        profile_picture: null,
        gender: 'Male',
        joining_date: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
      setEditingUser(null);
    }
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            className="text-blue-500 hover:text-blue-700 mr-2"
            onClick={() => {
              handleEdit(params.row);
              setIsFormVisible(true);
            }}
          >
            <BorderColorSharpIcon className="mr-2" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() =>
              window.confirm('Are you sure?') && handleDelete(params.row.user_id)
            }
          >
            <DeleteSharpIcon className="mr-2" />
          </button>
        </>
      ),
    },
    {
      field: 'profile_picture',
      headerName: 'Profile',
      width: 100,
      renderCell: (params) => (
        <img
          src={`http://localhost:5000${params.row.profile_picture}`}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
    },
    { field: 'name', headerName: 'Username', width: 150 },
    { field: 'user_id', headerName: 'User ID', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role_name', headerName: 'Role', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    // { field: 'joining_date', headerName: 'Joining Date', width: 150 },
    {
      field: 'joining_date',
      headerName: 'Joining Date',
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    
    { field: 'status', headerName: 'Status', width: 100 ,
      renderCell: (params) => (
        params.value === 'Active' ? (
          <span className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">✅ Active</span>
        ) : (
          <span className="inline-block bg-red-100 px-2 py-1 m-2 rounded-md">Deactive</span>
        )
      ),    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      {alertMessage?.message && typeof alertMessage.message === 'string' && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md w-80 text-center ${
            alertMessage.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {alertMessage.message}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button
          onClick={toggleFormVisibility}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {isFormVisible ? (
            <>
              <HighlightOffSharpIcon className="mr-2" /> Close
            </>
          ) : (
            <>
              <PersonAddAltSharpIcon className="mr-2" /> User
            </>
          )}
        </button>
      </div>
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="user_id" className="text-lg font-medium text-gray-700">User ID</label>
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="role_name" className="text-lg font-medium text-gray-700">Role</label>

              <select
                id="role_name"
                name="role_name"
                value={formData.role_name}
                onChange={(e) => {
                  handleChange(e); // Update role_name in the form data
                  const role = e.target.value;
                  const roleId = role === "Admin" ? 1 : role === "Manager" ? 2 : role === "HR Manager" ? 3 : 4;
                  setFormData((prevData) => ({
                    ...prevData,
                    role_id: roleId,
                  }));
                }}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Employee">Employee</option>
              </select>

            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-lg font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="profile_picture" className="text-lg font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          {/* Additional Form Fields */}
          <div className="flex flex-col">
            <label htmlFor="gender" className="text-lg font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="joining_date" className="text-lg font-medium text-gray-700">
              Joining Date
            </label>
            <input
              type="date"
              id="joining_date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="text-lg font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-3">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {editingUser ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </div>
    </div>
  );
};

export default UserRegisterUI;
