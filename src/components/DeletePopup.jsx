// src/components/DeletePopup.js
import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'; // Updated icon import

// Keyframes for fade-in and fade-out animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); // Darker backdrop to match app theme
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #1c2a36; // Dark background matching the app theme
  padding: 20px;
  border-radius: 10px; // Slightly rounded corners
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6); // More pronounced shadow
  text-align: center;
  width: 350px; // Slightly wider modal
  animation: ${(props) =>
    props.isClosing ? css`${fadeOut} 0.4s cubic-bezier(0.22, 1, 0.36, 1)` : css`${fadeIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1)`}; // Smoother animation
  font-family: 'Poppins', sans-serif; // Apply Poppins font
`;

const ModalHeader = styled.div`
  color: #fff; // White text for the header
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', sans-serif; // Apply Poppins font
`;

const NotificationIcon = styled(FontAwesomeIcon)`
  color: yellow; // Color for the notification icon
  font-size: 35px; // Icon size
  margin-bottom: 10px; // Space between icon and text
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px; // Slightly larger gap between buttons
`;

const ModalButton = styled.button`
  padding: 12px 20px; // Consistent padding for both buttons
  border: none;
  border-radius: 50px;
  color: #fff;
  background-color: ${(props) => props.primary ? '#d9534f' : '#4C3BCF'};
  cursor: pointer;
  font-size: 16px; // Larger font size
  transition: background-color 0.3s ease;
  width: 100px; // Consistent width for both buttons
  font-family: 'Poppins', sans-serif; // Apply Poppins font

  &:hover {
    background-color: ${(props) => props.primary ? '#c9302c' : '#3e2f9f'};
  }
`;

const Modal = ({ message, onConfirm, onCancel }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel(); // Call the cancel function after the fade-out animation
    }, 400); // Duration should match the animation duration
  };

  useEffect(() => {
    if (!isClosing) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Restore scrolling after modal closes
    }
    return () => {
      document.body.style.overflow = 'auto'; // Restore scrolling on unmount
    };
  }, [isClosing]);

  return (
    <ModalBackdrop>
      <ModalContainer isClosing={isClosing}>
        <ModalHeader>
          <NotificationIcon icon={faQuestionCircle} /> {/* Updated icon */}
          <h2>{message}</h2>
        </ModalHeader>
        <ButtonWrapper>
          <ModalButton primary onClick={onConfirm}>Delete</ModalButton>
          <ModalButton onClick={handleClose}>No</ModalButton>
        </ButtonWrapper>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default Modal;
