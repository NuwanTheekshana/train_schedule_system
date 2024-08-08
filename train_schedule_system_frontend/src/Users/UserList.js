import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function UserList() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    NIC: '',
    address: '',
    Tel_No: '',
    Permission: '',
    Password: '',
  });
  const [formErrors, setFormErrors] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    NIC: '',
    address: '',
    Tel_No: '',
    Permission: '',
    Password: '',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      First_Name: '',
      Last_Name: '',
      Email: '',
      NIC: '',
      address: '',
      Tel_No: '',
      Permission: '',
      Password: '',
    });
    setFormErrors({
      First_Name: '',
      Last_Name: '',
      Email: '',
      NIC: '',
      address: '',
      Tel_No: '',
      Permission: '',
      Password: '',
    });
  };


  const [editingAllUser, seteditingAllUser] = useState(null);
  const [deletingAllUser, setDeletingAllUser] = useState(null);
  const [AllUser, setAllUser] = useState([]); 
  

  useEffect(() => {
    fetchData();
  }, []);


  const tableRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7207/api/Registration/users');
      setAllUser(response.data);

      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }
      console.log(response.data);
      tableRef.current = $('#tableId').DataTable({
        data: response.data,
        columns: [
          { data: 'user_Id', title: 'User Id' },
          { data: 'userName', title: 'User Name' },
          { data: 'email', title: 'Email' },
          { data: 'permission_Type', title: 'Permission' },
          { data: 'status_Type', title: 'Status' },
          {
            data: null,
            render: renderActionButtons,
          },
        ],
        language: {
          emptyTable: 'No data available in table',
        },
      });
    } catch (error) {
      console.error('Error fetching All User list', error);
    }
  };

  const renderActionButtons = (data, type, row) => {
    return (
      '<center>' +
      '<button type="button" class="btn btn-success btn-sm" onclick="window.handleEdit(' +
      row.user_Id + ', \'' + row.userName + '\', \'' + row.email +'\', \'' + row.permission +'\', \'' + row.status +'\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
      '&nbsp;' +
      '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
      row.user_Id +
      ')">Delete</button>' +
      '</center>'
    );
  };

  window.handleEdit = (user_Id, user_Name, email, permission) => {
    seteditingAllUser(user_Id);
    setFormData({
        User_Name: user_Name,
        Email: email,
        Permission: permission,
    });
    handleShowModal();
};

window.handleDelete = (User_Id) => {
    setDeletingAllUser(User_Id);
    handleShowDeleteModal();
  };

  const handleDeleteAllUser = async () => {
    try {
    await axios.delete(`https://localhost:7207/api/Registration/users/${deletingAllUser}`);
    console.log('User deleted successfully');
    Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    handleCloseDeleteModal();
    } catch (error) {
    console.error('Error deleting user', error);
    Swal.fire({title: 'Warning', text: 'Something went wrong..!', icon: 'error' }).then((result) => {
      if (result.isConfirmed) {
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    }
};

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
 
  const handleAddUser = async () => {
    try {
      const errors = {};

      if (!editingAllUser) 
      {
      if (!formData.First_Name) {
        errors.First_Name = 'First name is required.';
      }
      if (!formData.Last_Name) {
        errors.Last_Name = 'Last name is required.';
      }
      if (!formData.Email) {
        errors.Email = 'Email is required.';
      }else if (!isValidEmail(formData.Email)) {
        errors.Email = 'Please enter a valid email address.';
      } 
      if (!formData.NIC) {
        errors.NIC = 'NIC number is required.';
      }
      if (!formData.address) {
        errors.address = 'Address is required.';
      }
      if (!formData.Tel_No) {
        errors.Tel_No = 'Contact number is required.';
      }
      if (!formData.Permission) {
        errors.Permission = 'Permission is required.';
      }
      if (!formData.Password) {
        errors.Password = 'Password is required.';
      }
    }
    else
    {
      if (!formData.Email) {
        errors.Email = 'Email is required.';
      }else if (!isValidEmail(formData.Email)) {
        errors.Email = 'Please enter a valid email address.';
      }

      if (!formData.Permission) {
        errors.Permission = 'Permission is required.';
      }
    }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        Swal.fire({title: 'Warning', text: 'Something went wrong..!', icon: 'error' }).then((result) => {
          if (result.isConfirmed) {
            window.scrollTo({top: 0,behavior: 'smooth'});
          }
        });
        return;
      }

      const data = {
        FName: formData.First_Name,
        LName: formData.Last_Name,
        Email: formData.Email,
        NIC: formData.NIC,
        address: formData.address,
        Tel_No: formData.Tel_No,
        Permission: formData.Permission,
        Password: formData.Password
    }

      if (editingAllUser) {
        await axios.put(`https://localhost:7207/api/Registration/users/${editingAllUser}`, formData);
      } else {
        await axios.post('https://localhost:7207/api/Registration/registration', data);
      }
      console.log('User added successfully');
      Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseModal();
      
    } catch (error) {
      console.error('User added failed', error);
      Swal.fire({title: 'Warning', text: 'Something went wrong..!', icon: 'error' }).then((result) => {
        if (result.isConfirmed) {
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
    }
  };


  return(
    <div>
      <Navbar />
       
      <div className="container px-4">
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center small">
            <h4>User List</h4>
            <Button variant="danger" size="sm" onClick={handleShowModal}>
              Add New Users
            </Button>
          </div>
          <div className="card-body">
          <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Permission</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>



      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAllUser ? 'Edit Users' : 'Add New Users'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!editingAllUser ?
        <form>
            <div className="mb-3">
              <label htmlFor="First_Name" className="form-label">
                First Name
              </label>
              <input type="text" className={`form-control ${formErrors.First_Name ? 'is-invalid' : ''}`} id="First_Name" name="First_Name" placeholder="" value={formData.First_Name} onChange={handleInputChange}/>
              {formErrors.First_Name && <div className="invalid-feedback">{formErrors.First_Name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Last_Name" className="form-label">
                Last Name
              </label>
              <input type="text" className={`form-control ${formErrors.Last_Name ? 'is-invalid' : ''}`} id="Last_Name" name="Last_Name" placeholder="" value={formData.Last_Name} onChange={handleInputChange}/>
              {formErrors.Last_Name && <div className="invalid-feedback">{formErrors.Last_Name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input type="email" className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`} id="Email" name="Email" placeholder="" value={formData.Email} onChange={handleInputChange}/>
              {formErrors.Email && <div className="invalid-feedback">{formErrors.Email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                NIC
              </label>
              <input type="text" className={`form-control ${formErrors.NIC ? 'is-invalid' : ''}`} id="NIC" name="NIC" placeholder="" value={formData.NIC} onChange={handleInputChange}/>
              {formErrors.NIC && <div className="invalid-feedback">{formErrors.NIC}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input type="text" className={`form-control ${formErrors.address ? 'is-invalid' : ''}`} id="address" name="address" placeholder="" value={formData.address} onChange={handleInputChange}/>
              {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="Tel_No" className="form-label">
                Contact Number
              </label>
              <input type="number" className={`form-control ${formErrors.Tel_No ? 'is-invalid' : ''}`} id="Tel_No" name="Tel_No" placeholder="" value={formData.Tel_No} onChange={handleInputChange}/>
              {formErrors.Tel_No && <div className="invalid-feedback">{formErrors.Tel_No}</div>}
            </div>

          
            <div className="mb-3">
              <label htmlFor="Permission" className="form-label">Permission</label>
              <select className={`form-control ${formErrors.Permission ? 'is-invalid' : ''}`}  id="Permission" name="Permission" onChange={handleInputChange} value={formData.Permission}>
              <option value="">User Permission Level</option>
              <option value="1">Default</option>
              <option value="2">Admin</option>
              </select>
              {formErrors.Permission && <div className="invalid-feedback">{formErrors.Permission}</div>}
            </div>

          
          <div className="mb-3">
              <label htmlFor="Password" className="form-label">
                Password
              </label>
              <input type="password" className={`form-control ${formErrors.Password ? 'is-invalid' : ''}`} id="Password" name="Password" placeholder="" value={formData.Password} onChange={handleInputChange}/>
              {formErrors.Password && <div className="invalid-feedback">{formErrors.Password}</div>}
            </div> 
          </form>
          : 
          
          <form>
            <div className="mb-3">
              <label htmlFor="User_Name" className="form-label">
                User Name
              </label>
              <input type="text" className={`form-control ${formErrors.User_Name ? 'is-invalid' : ''}`} id="User_Name" name="User_Name" placeholder="" value={formData.User_Name} onChange={handleInputChange} disabled/>
              {formErrors.User_Name && <div className="invalid-feedback">{formErrors.User_Name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input type="email" className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`} id="Email" name="Email" placeholder="" value={formData.Email} onChange={handleInputChange}/>
              {formErrors.Email && <div className="invalid-feedback">{formErrors.Email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="Permission" className="form-label">Permission</label>
              <select className={`form-control ${formErrors.Permission ? 'is-invalid' : ''}`}  id="Permission" name="Permission" onChange={handleInputChange} value={formData.Permission}>
              <option value="1">Default</option>
              <option value="2">Admin</option>
              </select>
              {formErrors.Permission && <div className="invalid-feedback">{formErrors.Permission}</div>}
            </div>
          </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddUser}>
            {editingAllUser ? 'Save Changes' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this User?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteAllUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserList;
