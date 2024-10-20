import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex
    const fullNameRegex = /^[A-Za-z\s]+$/; // Only alphabetic letters and spaces
    const telephoneRegex = /^07\d{8}$/; // Starts with '07' and has 10 digits
    const passwordRegex = /.{8,}/; // At least 8 characters

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    } else if (!fullNameRegex.test(fullName)) {
      errors.fullName = 'Full Name must contain only alphabetic letters.';
    }

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email is invalid.';
    }

    if (!telephone.trim()) {
      errors.telephone = 'Telephone is required.';
    } else if (!telephoneRegex.test(telephone)) {
      errors.telephone = 'Telephone must start with 07 and have 10 digits.';
    }

    if (!password.trim()) {
      errors.password = 'Password is required.';
    } else if (!passwordRegex.test(password)) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    const userData = {
      fullname: fullName,
      useremail: email,
      telephone: telephone,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up. Please try again.');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.logoContainer}>
        <img src={`${process.env.PUBLIC_URL}/new-logo.png`} alt="Logo" style={styles.logoImage} />
        <h1 style={styles.logoText}>iFinance</h1>
      </div>
      <div style={styles.signupContainer}>
        <div style={styles.textContainer}>
          <div style={styles.signupText}>Create your account</div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div style={styles.loginText}>
            Already have an account? <Link to="/login" style={styles.loginLink}>Log in</Link>
          </div>
        </div>
        <form style={styles.form} onSubmit={handleSignup}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              placeholder="Full Name"
            />
            {formErrors.fullName && (
              <div style={{ ...styles.error, zIndex: 1 }}>{formErrors.fullName}</div>
            )}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Email"
            />
            {formErrors.email && (
              <div style={{ ...styles.error, zIndex: 1 }}>{formErrors.email}</div>
            )}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              style={styles.input}
              placeholder="Telephone"
            />
            {formErrors.telephone && (
              <div style={{ ...styles.error, zIndex: 1 }}>{formErrors.telephone}</div>
            )}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="New Password"
            />
            {formErrors.password && (
              <div style={{ ...styles.error, zIndex: 1 }}>{formErrors.password}</div>
            )}
          </div>

          <button type="submit" style={styles.submitButton}>
            Sign Up
          </button>
        </form>
      </div>
      <div style={styles.imageContainer}>
        <img src="/login-back.png" alt="Signup Visual" style={styles.image} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'Poppins, sans-serif',
    position: 'relative',
    backgroundColor: '#121212',
    color: '#ffffff',
  },
  logoContainer: {
    position: 'absolute',
    top: '60px',
    left: '40px',
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    width: '55px',
    height: '55px',
    marginRight: '00px',
  },
  logoText: {
    fontSize: '28px',
    color: '#ffffff',
    margin: 0,
  },
  signupContainer: {
    width: '100%',
    maxWidth: '350px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
  },
  textContainer: {
    width: '100%',
    textAlign: 'left',
    marginBottom: '20px',
    marginTop: '-50px',
  },
  signupText: {
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '8px',
    marginLeft: '30px',
    marginTop: '90px',
  },
  loginText: {
    fontSize: '19px',
    color: '#b0b0b0',
    fontWeight: '650',
    marginLeft: '30px',
  },
  loginLink: {
    fontSize: '19px',
    color: '#1a73e8',
    textDecoration: 'none',
    fontWeight: '650',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '270px',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: '25px', // Adds space between input fields
    position: 'relative', // Allows absolute positioning of error messages
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1.6px solid #555',
    width: '100%',
    backgroundColor: '#222',
    color: '#ffffff',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px', // Add some space above error message
    position: 'absolute', // Positioning the error message
    left: '0',
    right: '0',
    textAlign: 'center', // Center the error message
    zIndex: 1, // Ensure it appears above other elements
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: '1px solid #1a73e8',
    borderRadius: '7px',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '150px',
    marginTop: '10px',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(80%)',
  },
};

export default Signup;
