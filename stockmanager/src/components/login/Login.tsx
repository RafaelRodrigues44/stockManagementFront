import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Login.css'; 
import inventoryImage from '../../assets/inventory.avif';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;

      console.log("O token captado pelo navegador web é = " + token)

      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage('Login falhou!'); 
      console.error(error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image">
        <img src={inventoryImage} alt="Uma pessoa gerenciando o estoque com um tablet" />
      </div>
      <div className='aside'>
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <label htmlFor="email">Email</label> 
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>} 
          </form>
        </div>
        <button className="register-button" onClick={() => navigate('/register')}>
          Cadastre-se.
        </button>
      </div>  
    </div>
  );
};

export default Login;
