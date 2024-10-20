import React, { useState } from 'react';
import axios from 'axios'; // Make sure you have axios installed

function SettingsPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [hoverUpdate, setHoverUpdate] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        
        try {
          const response = await axios.put('http://localhost:3001/api/update-password', {
            oldPassword,
            newPassword,
        });
            setMessage(response.data.message); // Set success message
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message); // Set error message from response
            } else {
                setMessage('Server error. Please try again later.');
            }
        }
    };

    return (
        <div style={styles.settingsPage}>
            {/* Display success or error message */}
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <div style={styles.passwordUpdate}>
                <h2 style={styles.passwordUpdateTitle}>Update Password</h2>
                <form onSubmit={handlePasswordUpdate} style={styles.passwordForm}>
                    <label style={styles.formLabel}>Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={styles.inputField}
                        required
                    />
                    <label style={styles.formLabel}>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.inputField}
                        required
                    />
                    <label style={styles.formLabel}>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        style={styles.inputField}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            ...styles.updatePasswordButton,
                            backgroundColor: hoverUpdate ? '#4C3BCF' : '#4B70F5',
                            color: '#ffffff',
                        }}
                        onMouseEnter={() => setHoverUpdate(true)}
                        onMouseLeave={() => setHoverUpdate(false)}
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}
const styles = {
  settingsPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: '100vh',
    backgroundColor: '#000',
    color: '#ffffff',
    fontFamily: 'Poppins, sans-serif',
    padding: '30px',
  },
  passwordUpdate: {
    background: '#181818',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    border: '1px solid #4B70F5',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  passwordUpdateTitle: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  passwordForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    fontSize: '14px',
    color: '#B0B0B0',
    marginBottom: '5px',
  },
  inputField: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #B0B0B0',
    backgroundColor: '#121212',
    color: '#ffffff',
  },
  updatePasswordButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
  },
};

export default SettingsPage;
