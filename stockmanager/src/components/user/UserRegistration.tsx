import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import './UserRegistration.css';

interface User {
  name: string;
  email: string;
  password: string;
}

const UserRegistration: React.FC = () => {
  const [formData, setFormData] = useState<User>({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/users/user', formData);
      setMessage(`Cadastro criado com sucesso!`);
      setFormData({ name: '', email: '', password: '' });

      setTimeout(() => {
        navigate('/'); 
      }, 4000);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setMessage('Erro ao criar usuário.');
      } else {
        setMessage('Erro ao criar usuário');
      }
    }
  };

  return (
    <div className="container user-registration-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="user-registration-card">
            <h2 className="user-registration-title">Cadastrar Usuário</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group user-registration-form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group user-registration-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group user-registration-form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary user-registration-button">Cadastrar</button>
            </form>
            {message && <p className="user-registration-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
