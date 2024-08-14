// src/components/Sidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExchangeAlt, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative; /* Required for positioning the logout item at the bottom */
  font-family: 'Poppins', sans-serif; /* Apply Poppins font */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  img {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }

  h1 {
    font-size: 28px;
  }
`;

const Nav = styled.nav`
  width: 100%;
  margin-top: 20px;
  flex: 1; /* Allow this to take available space */
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 10px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, padding-left 0.3s ease;

  &:hover {
    background-color: #1B1A55;
    padding-left: 20px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }

  .icon {
    margin-left: 40px;
  }

  span {
    margin-left: 20px;
  }
`;

const LogoutButton = styled(NavItem)`
  position: absolute;
  margin-left:60px;
  bottom: 70px; /* Adjust to your desired spacing from the bottom */
  background-color: transparent; /* Remove any background color */
  &:hover {
    background-color: transparent; /* No background change on hover */
    color:
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
        <h1>iFinance</h1>
      </LogoContainer>
      <Nav>
        <NavItem>
          <FontAwesomeIcon icon={faHome} className="icon" />
          <span>Dashboard</span>
        </NavItem>
        <NavItem>
          <FontAwesomeIcon icon={faExchangeAlt} className="icon" />
          <span>Transactions</span>
        </NavItem>
        <NavItem>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <span>Me</span>
        </NavItem>
        <NavItem>
          <FontAwesomeIcon icon={faCog} className="icon" />
          <span>Settings</span>
        </NavItem>
      </Nav>
      <LogoutButton onClick={() => alert('Logout clicked')}>
        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
        <span>Logout</span>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
