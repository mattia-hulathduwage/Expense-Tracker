// src/components/Header.jsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const HeaderContainer = styled.header`
  width: calc(90% - 250px); /* Adjust width to account for the sidebar */
  height: 60px;
  background-color: #222831;
  display: flex;
  align-items: center;
  padding: 0 80px;
  position: absolute; /* Position it absolutely to keep it aligned */
  top: 0;
  left: 250px; /* Ensure it starts exactly after the sidebar */
  z-index: 0; /* Ensure it’s above other content */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Add shadow for better visibility */
  font-family: 'Poppins', sans-serif; /* Apply Poppins font */
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 300px; /* Fixed width for the search bar */
  position: relative;
  
  input {
    width: 100%;
    height: 35px;
    padding: 0 35px 0 15px; /* Padding to ensure text is not covered by icon */
    border: none;
    border-radius: 50px;
    outline: none;
    font-size: 14px;
    color: #000;
    background-color: #fff;
  }

  .icon {
    position: absolute;
    right: 10px; /* Align icon inside the input field */
    color: #888;
    cursor: pointer;
    transition: color 0.3s ease;
    
    &:hover {
      color: #fff; /* Change color on hover */
      transform: scale(1.1); /* Slight zoom effect on hover */
    }
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <SearchBar>
        <input type="text" placeholder="Search" />
        <FontAwesomeIcon icon={faSearch} className="icon" />
      </SearchBar>
    </HeaderContainer>
  );
};

export default Header;
