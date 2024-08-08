import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import notFoundImage from '../img/login_img.jpg';

function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const data = {
      email: Email,
      password: Password,
    };

    const url = 'https://localhost:7207/api/Login/login';

    axios
      .post(url, data)
      .then((result) => {
        const { token } = result.data;
        console.log(result.data);
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('id', result.data.id);
          localStorage.setItem('UserName', result.data.userName);
          localStorage.setItem('Email', result.data.email);
          localStorage.setItem('Permission', result.data.permission);
          localStorage.setItem('Status', result.data.status);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          navigate('/home');
        } else {
          alert('Login failed. No token received.');
        }
      })
      .catch((error) => {
        alert('Login failed. Please check your credentials.');
      });
  };

  return (
    <div className="background-image-container">
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-6">

          
            <div className="card mt-5">
              <div className="card-body">
            
              <center>
              <img src={notFoundImage} class="img-fluid" width="50%" alt="Page Not Found" />
              </center>

                <h2 className="text-center mb-4">Log In</h2>


               



                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter email"
                      required
                      value={Email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      required
                      value={Password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                    <i className="bi bi-person-fill-lock"></i> Log In
                    </button>
                  </div>
                </form>
                <div className="mt-3 text-center mt-4">

               
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
