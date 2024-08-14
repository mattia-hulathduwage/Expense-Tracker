import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebaseConfig'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Facebook sign-in:', error);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Email:', email, 'Password:', password);
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
            Don’t have an account? <a href="/signup" style={styles.signupLink}>Sign up</a>
          </div>
        </div>
        <button style={styles.button} onClick={handleGoogleSignIn}>
          <img src="/google.png" alt="Google Logo" style={styles.logo} />
          <span style={styles.buttonText}>Login with Google</span>
        </button>
        <button style={styles.button} onClick={handleFacebookSignIn}>
          <img src="/fblogo.png" alt="Facebook Logo" style={styles.logo} />
          <span style={styles.buttonText}>Login with Facebook</span>
        </button>
        <div style={styles.orText}>Or with email and password</div>
        <form style={styles.form} onSubmit={handleLogin}>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Password"
            required
          />
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
    backgroundColor: '#121212', // Dark background color
    color: '#ffffff', // Light text color
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
    color: '#ffffff', // Light color for logo text
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
    color: '#ffffff', // Light color for login text
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '8px',
    marginLeft: '30px',
    marginTop: '90px',
  },
  signupText: {
    fontSize: '19px',
    color: '#b0b0b0', // Lighter grey color for better readability on dark background
    fontWeight: '650',
    marginLeft: '30px',
  },
  signupLink: {
    fontSize: '19px',
    color: '#1a73e8', // Blue color for the link
    textDecoration: 'none',
    fontWeight: '650',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '290px',
    padding: '15px 20px',
    fontSize: '18px',
    backgroundColor: '#333', // Dark background for buttons
    color: '#ffffff', // Light text color
    border: '2px solid #555', // Darker border
    borderRadius: '5px',
    cursor: 'pointer',
    outline: 'none',
    marginBottom: '20px',
    marginTop: '16px',
    gap: '0px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  logo: {
    width: '30px',
    height: '30px',
  },
  buttonText: {
    marginLeft: '10px',
  },
  orText: {
    margin: '20px 0',
    fontSize: '14px',
    color: '#b0b0b0', // Light color for the 'or' text
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
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1.6px solid #555', // Darker border
    width: '100%',
    marginBottom: '15px',
    backgroundColor: '#222', // Dark background for inputs
    color: '#ffffff', // Light text color
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#1a73e8', // Button color
    color: 'white',
    border: '1px solid #1a73e8', // Matching border color
    borderRadius: '7px',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '150px',
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
    filter: 'brightness(80%)', // Darken the background image
  },
};


export default Login;
