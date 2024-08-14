// src/components/Sidebar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMoneyBillWave, faCog, faSignOutAlt, faFileInvoiceDollar, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from './Modal';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  border-right: 3px solid #000;
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
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 10px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, padding-left 0.3s ease;
  text-decoration: none;

  &:hover {
    background-color: #0b0b0b;
    padding-left: 20px;
  }

  .icon {
    margin-left: 40px;
  }

  span {
    margin-left: 20px;
  }
`;

const LogoutButtonContainer = styled.div`
  width: 100%;
  margin-top: auto;
  padding-top: 20px;
`;

const LogoutButton = styled(NavItem)`
  background-color: transparent;

  &:hover {
    background-color: transparent;
    color: #4C3BCF;
  }
`;

const Sidebar = ({ onLogout }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    setShowModal(false);
    onLogout(); // Call the actual logout function here
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={`${process.env.PUBLIC_URL}/new-logo.png`} alt="Logo" />
        <h1>iFinance</h1>
      </LogoContainer>
      <Nav>
        <NavItem to="/dashboard">
          <FontAwesomeIcon icon={faHome} className="icon" />
          <span>Wallet</span>
        </NavItem>
        <NavItem to="/income">
          <FontAwesomeIcon icon={faMoneyBillWave} className="icon" />
          <span>Income</span>
        </NavItem>
        <NavItem to="/expense">
          <FontAwesomeIcon icon={faFileInvoiceDollar} className="icon" />
          <span>Expense</span>
        </NavItem>
        <NavItem to="/calendar">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <span>Calendar</span>
        </NavItem>
        <NavItem to="/settings">
          <FontAwesomeIcon icon={faCog} className="icon" />
          <span>Settings</span>
        </NavItem>
      </Nav>
      <LogoutButtonContainer>
        <LogoutButton to="#" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          <span>Logout</span>
        </LogoutButton>
      </LogoutButtonContainer>

      {showModal && (
        <Modal
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
