import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import Loading from '../../utils/loading/Loading'
const ListContainer = styled.div`
  border: 1px solid #ccc;
`;

const UserRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ActionButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const HeaderRow = styled(UserRow)`
  background-color: #f1f1f1;
  font-weight: bold;
`;

function UserList() {
  const state = useContext(GlobalState);
  const [users, setUsers] = state.allUsersAPI.allUsers;
  console.log(state.allUsersAPI.allUsers)
  const [loading, setLoading] = useState(false);


  // Check if users is defined and has length
  if (!users || users.length === 0) {
    return <div>Loading users...</div>; // Or handle loading or empty states appropriately
  }

  return (
    <ListContainer>
      <HeaderRow>
        <span>Profile Pic</span>
        <span>Username</span>
        <span>Email</span>
        <span>User createdAt</span>
        <span>User updateAt</span>
        <span>Actions</span>
      </HeaderRow>
      setLoading(true)
      {users.map(user => (
        <UserRow key={user._id}>
          <img src={user.image.url} alt=''/>
          <span>{user.username}</span>
          <span>{user.email}</span>
          <span>{new Date(user.createdAt).toLocaleString()}</span>
          <span>{new Date(user.updatedAt).toLocaleString()}</span>
          <div>
            <Link to={`/updateUser/${user._id}`}>
            <ActionButton style={{ backgroundColor: 'blue', color: 'white' }}>Edit</ActionButton>
            </Link>
            <Link to="/cart">
            <ActionButton style={{ backgroundColor: 'red', color: 'white' }}>View Cart</ActionButton>
            </Link>
          </div>
        </UserRow>
      ))}
    </ListContainer>
  );
}

export default UserList;