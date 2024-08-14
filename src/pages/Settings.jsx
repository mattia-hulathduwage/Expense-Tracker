import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import { deleteUser } from 'firebase/auth';

function SettingsPage() {
  const [user] = useState(auth.currentUser); // Get the current authenticated user
  const [deleteData, setDeleteData] = useState(false); // State for the checkbox
  const [hover, setHover] = useState(false); // State for hover effect on delete button
  const [hoverDownload, setHoverDownload] = useState(false); // State for hover effect on download button

  const handleAccountDeletion = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUser(user);
        alert("Your account has been deleted successfully.");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete the account. Please try again later.");
      }
    }
  };

  const handleDownloadInstructions = () => {
    // Logic to download the instructions file
    alert("Instructions have been downloaded.");
  };

  return (
    <div style={styles.settingsPage}>
      <div style={styles.profileCard}>
        <img src={user.photoURL} alt="Profile" style={styles.profilePicture} />
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>{user.displayName}</h2>
          <p style={styles.profileEmail}>{user.email}</p>
        </div>
      </div>

      {/* How to Use Section */}
      <div style={styles.howToUse}>
        <h2 style={styles.howToUseTitle}>How to use</h2>
        <p style={styles.howToUseText}>
          Click the button below to download the instructions on how to use this application.
        </p>
        <button
          style={{
            ...styles.downloadButton,
            backgroundColor: hoverDownload ? '#4C3BCF' : '#4B70F5',
            color: hoverDownload ? '#ffffff' : '#ffffff',
          }}
          onMouseEnter={() => setHoverDownload(true)}
          onMouseLeave={() => setHoverDownload(false)}
          onClick={handleDownloadInstructions}
        >
          Download
        </button>
      </div>

      {/* Danger Zone Section */}
      <div style={styles.dangerZone}>
        <h2 style={styles.dangerTitle}>Danger Zone</h2>
        <p style={styles.dangerText}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={deleteData}
            onChange={(e) => setDeleteData(e.target.checked)}
            style={styles.checkbox}
          />
          Delete all data with account
        </label>
        <button
          style={{
            ...styles.deleteAccountButton,
            backgroundColor: hover ? '#d9534f' : '#222831',
            color: hover ? '#ffffff' : '#d9534f',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleAccountDeletion}
        >
          Delete this Account
        </button>
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
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #181818, #181818 50%, #7C00FE 150%)',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  profilePicture: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    marginRight: '15px',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  profileName: {
    fontSize: '20px',
    marginBottom: '5px',
    color: '#ffffff',
  },
  profileEmail: {
    fontSize: '14px',
    color: '#B0B0B0',
  },
  howToUse: {
    background: '#181818', // Background for the How to Use section
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    border: '1px solid #4B70F5', // Lighter border color
    width: 'calc(100% - 60px)', // Full width minus 30px margin on each side
    maxWidth: 'calc(100% - 60px)', // Ensure maxWidth also respects the margins
    marginTop: '30px',
    marginLeft: '0px',
    marginRight: '0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  howToUseTitle: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  howToUseText: {
    fontSize: '16px',
    color: '#ffffff',
    marginBottom: '15px',
  },
  downloadButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#5C6BC0',
    backgroundColor: '#4B70F5', // Dark background for download button
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
  },
  dangerZone: {
    background: '#181818',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    border: '1px solid #d9534f',
    width: 'calc(100% - 60px)',
    maxWidth: 'calc(100% - 60px)',
    marginTop: '30px',
    marginLeft: '0px',
    marginRight: '0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dangerTitle: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  dangerText: {
    fontSize: '16px',
    color: '#ffffff',
    marginBottom: '15px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#ffffff',
    marginBottom: '15px',
  },
  checkbox: {
    marginRight: '10px',
  },
  deleteAccountButton: {
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
