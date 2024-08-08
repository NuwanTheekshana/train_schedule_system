import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'jquery/dist/jquery.min.js'; 
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js';



function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      delay: 100,
    });
  }, []);

  const token = localStorage.getItem("token");
  const UserName = localStorage.getItem("UserName");
  const Permission = localStorage.getItem("Permission");

  useEffect(() => {
    if (token === null) {
      navigate('/');
    }
  }, [navigate]);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('UserName');
    localStorage.removeItem('Email');
    localStorage.removeItem('Permission');
    localStorage.removeItem('Status');
    navigate('/');
  }

  return (
    
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div className="container">
                <Link to="/home" className="navbar-brand">
                    Railway Ticketing System
                </Link>
                <ul></ul>
                <ul></ul>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a id="navbarDropdownConsultant" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Find
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownConsultant">
                                    <Link to="/sellticket" className="dropdown-item">
                                        Find Train Schedule
                                    </Link>
                                    
                                </div>
                            </li>
                            
                </ul>
                <ul></ul>

                {Permission == 2 ? (
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                        <a id="navbarDropdownConsultant" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownConsultant">
                            <Link to="/addtrain" className="dropdown-item">
                            Add Train
                            </Link>
                            <Link to="/viewsales" className="dropdown-item">
                            Add Train Schedule
                            </Link>
                        </div>
                        </li>
                    </ul>
                    ) : null}
                    <ul></ul>
                    {Permission == 2 ? (
                        
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item dropdown">
                        <a id="user_dataDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Users
                        </a>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="user_dataDropdown">
                            <Link to="/users" className="dropdown-item">
                            User List
                            </Link>
                        </div>
                        </li>
                    </ul>
                    ) : null}

                    

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    

                    <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {UserName}
                                </a>

                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" onClick={logout}>
                                        Logout
                                    </a>

                                </div>
                            </li>
                    </ul>


                </div>


            </div>
        </nav>
  );
}

export default Navbar;
