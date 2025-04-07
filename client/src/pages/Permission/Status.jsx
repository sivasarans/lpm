import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, ScrollArea, Badge, Group, ActionIcon, Text, Input, Select
} from '@mantine/core';
import { IconCheck, IconX, IconSearch } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function PermissionStatus() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const userDetails = sessionStorage.getItem('user');
    if (userDetails) setUser(JSON.parse(userDetails));
  }, []);

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:3700/permission')
      .then(res => setData(res.data.result))
      .catch(err => setError(err.message));
  }, [user]);

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3700/permission/update/${id}`, {
        status,
        approved_by_name: user.name || 'N/A',
      });
      setData(data.map(d => d.id === id ? { ...d, status } : d));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = date => new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const formatTime = time => time?.slice(0, 5);

  const formatDateTime = dt => dt ? new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '-';

  const filteredData = data.filter(d => {
    if (user?.role_lpm === 'Employee' && d.userid !== user.userid) return false;
    const values = [

      d.id, d.userid, formatDate(d.perm_date),
      formatTime(d.from_time), formatTime(d.to_time),
      d.total_hours, d.status, d.reason, d.approved_by
    ].join(' ').toLowerCase();
    return values.includes(search.toLowerCase()) &&
      (filter === 'All' || d.status === filter);
  });

  const rows = filteredData.map(d => (
    <tr key={d.id}>
      <td>{d.userid}</td>
      <td>{formatDate(d.perm_date)}</td>
      <td>{formatTime(d.from_time)}</td>
      <td>{formatTime(d.to_time)}</td>
      <td>{d.total_hours || '-'}</td>
      <td>
        <Badge color={
          d.status === 'Approved' ? 'green' :
          d.status === 'Rejected' ? 'red' : 'yellow'}>
          {d.status}
        </Badge>
      </td>
      <td>{d.reason || '-'}</td>
      <td>{d.approved_by || '-'}</td>
      <td>{formatDateTime(d.approved_datetime)}</td>
      {user?.role === 'Admin' && d.status === 'Pending' && (
        <td>
          <Group spacing="xs">
            <ActionIcon color="green" onClick={() => handleStatus(d.id, 'Approved')}>
              <IconCheck size={16} />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => handleStatus(d.id, 'Rejected')}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </td>
      )}
    </tr>
  ));

  if (error) return <Text color="red">Error: {error}</Text>;

  return (
    <ScrollArea>
      <div className="dark:text-white text-black relative flex items-center justify-between mb-6">

        <div>
          <ul className="flex space-x-2">
            <li><Link to="#" className="text-primary hover:underline">Permission</Link></li>
            <li className="before:content-['/'] mx-2"><span>Status</span></li>
            <li>
              {user ? (
                <span className="text-md bg-success-light rounded text-success px-1">
                  User: "{user.name}", {user.role_lpm}
                </span>
              ) : (
                <span className="text-md bg-success-light rounded text-success px-1">Sample User, Admin</span>
              )}
            </li>
          </ul>
        </div>
        <div>
        <h2 className="text-xl font-bold text-center mb-4">Permission Status</h2>
</div>
        <div className="flex gap-2 items-center">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            w={200}
          />
          <Select
            data={['All', 'Approved', 'Pending', 'Rejected']}
            value={filter}
            onChange={setFilter}
            w={140}
          />
        </div>
      </div>

      {/* <h2 className="text-xl font-bold text-center mb-4">Permission Status</h2> */}

      <Table striped highlightOnHover className="dark:text-white text-black">
      <thead>
          <tr>
            <th>User ID</th>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Hours</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Approved By</th>
            <th>Approved Time</th>
            {user?.role === 'Admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}

export default PermissionStatus;
