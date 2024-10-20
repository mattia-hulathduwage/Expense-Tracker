import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email is invalid.';
    }
    if (!password.trim()) {
      errors.password = 'Password is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Trigger reCAPTCHA v3 validation
      const token = await window.grecaptcha.execute('6Lf4QmUqAAAAADN5dcMDcZ69cd8VD--ZAnjMv7s1', { action: 'login' });
console.log('reCAPTCHA Token:', token); // Log the token

      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, token }), // Send the token to the backend
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Login failed:', text);
        setFormErrors({ loginError: 'Invalid email or password' });
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Set authentication state
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setFormErrors({ loginError: 'An error occurred during login. Please try again.' });
    }
  };
  
  

  return (
    <div style={styles.wrapper}>
      <div style={styles.logoContainer}>
        <img src={`${process.env.PUBLIC_URL}/new-logo.png`} alt="Logo" style={styles.logoImage} />
        <h1 style={styles.logoText}>iFinance</h1>
      </div>
      <div style={styles.loginContainer}>
        <div style={styles.textContainer}>
          <div style={styles.loginText}>Log in to your account</div>
          <div style={styles.signupText}>
            Don’t have an account? <Link to="/signup" style={styles.signupLink}>Sign up</Link>
          </div>
        </div>
        <div style={styles.orText}>Or with email and password</div>
        <form style={styles.form} onSubmit={handleLogin} noValidate>
          <div style={styles.inputContainer}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Email"
            />
            {formErrors.email && <div style={styles.error}>{formErrors.email}</div>}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Password"
            />
            {formErrors.password && <div style={styles.error}>{formErrors.password}</div>}
          </div>
          {formErrors.loginError && <div style={styles.error}>{formErrors.loginError}</div>}
          <button type="submit" style={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
      <div style={styles.imageContainer}>
        <img src="/login-back.png" alt="Login Visual" style={styles.image} />
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
  loginContainer: {
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
  loginText: {
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '8px',
    marginLeft: '30px',
    marginTop: '90px',
  },
  signupText: {
    fontSize: '19px',
    color: '#b0b0b0',
    fontWeight: '650',
    marginLeft: '30px',
  },
  signupLink: {
    fontSize: '19px',
    color: '#1a73e8',
    textDecoration: 'none',
    fontWeight: '650',
  },
  orText: {
    margin: '20px 0',
    fontSize: '14px',
    color: '#b0b0b0',
    fontWeight: '500',
    marginTop: '-5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '270px',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: '25px',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1.6px solid #555',
    width: '100%',
    maxWidth: '250px',
    backgroundColor: '#222',
    color: '#ffffff',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    position: 'absolute',
    left: '0',
    right: '0',
    textAlign: 'center',
    zIndex: 1,
    marginTop: '45px',
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
    marginTop: '20px',
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

export default Login;
