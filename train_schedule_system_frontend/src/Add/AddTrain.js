import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function AddTrain() {
  const auth_userid = localStorage.getItem("id");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    User_Id: auth_userid,
    Train_Name: '',
  });
  const [formErrors, setFormErrors] = useState({
    User_Id: auth_userid,
    Train_Name: '',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      User_Id: auth_userid,
    Train_Name: '',
    });
    setFormErrors({
      User_Id: auth_userid,
      Train_Name: '',
    });
  };


  const [editingAllTrain, seteditingAllTrain] = useState(null);
  const [deletingAllTrain, setDeletingAllTrain] = useState(null);
  const [AllTrain, setAllTrain] = useState([]); 
  

  useEffect(() => {
    fetchData();
  }, []);


  const tableRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7207/api/Train/Train');
      setAllTrain(response.data);

      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }
      console.log(response.data);
      tableRef.current = $('#tableId').DataTable({
        data: response.data,
        columns: [
          { data: 'trainId', title: 'Train Id' },
          { data: 'trainName', title: 'Train Name' },
          { data: 'status', title: 'Status' },
          
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
      console.error('Error fetching All Train list', error);
    }
  };

  const renderActionButtons = (data, type, row) => {
    return (
      '<center>' +
      '<button type="button" class="btn btn-success btn-sm" onclick="window.handleEdit(' +
      row.trainId + ', \'' + row.trainName + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
      '&nbsp;' +
      '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
      row.trainId +
      ')">Delete</button>' +
      '</center>'
    );
  };

  window.handleEdit = (trainId, trainName) => {
    seteditingAllTrain(trainId);
    setFormData({
        Train_Name: trainName,
    });
    handleShowModal();
};

window.handleDelete = (trainId) => {
    setDeletingAllTrain(trainId);
    handleShowDeleteModal();
  };

  const handleDeleteAllTrain = async () => {
    try {
    await axios.delete(`https://localhost:7207/api/Train/Train/${deletingAllTrain}`);
    console.log('Train deleted successfully');
    Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    handleCloseDeleteModal();
    } catch (error) {
    console.error('Error deleting train', error);
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

      if (!editingAllTrain) 
      {
      if (!formData.Train_Name) {
        errors.Train_Name = 'First name is required.';
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
        TrainName: formData.Train_Name,
        Created_by: auth_userid
    }

      if (editingAllTrain) {
        await axios.put(`https://localhost:7207/api/Train/Train/${editingAllTrain}`, data);
      } else {
        await axios.post('https://localhost:7207/api/Train/AddTrain', data);
      }
      console.log('Train added successfully');
      Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseModal();
      
    } catch (error) {
      console.error('Train added failed', error);
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
            <h4>Train List</h4>
            <Button variant="danger" size="sm" onClick={handleShowModal}>
              Add New Train
            </Button>
          </div>
          <div className="card-body">
          <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Train ID</th>
                  <th>Train Name</th>
                  <th>Train Status</th>
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
          <Modal.Title>{editingAllTrain ? 'Edit Train' : 'Add New Train'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!editingAllTrain ?
        <form>
          <input type="hidden" className={`form-control ${formErrors.User_Id ? 'is-invalid' : ''}`} id="User_Id" name="User_Id" placeholder="" value={auth_userid} onChange={handleInputChange}/>
            <div className="mb-3">
              <label htmlFor="Train_Name" className="form-label">
                Train Name
              </label>
              <input type="text" className={`form-control ${formErrors.Train_Name ? 'is-invalid' : ''}`} id="Train_Name" name="Train_Name" placeholder="" value={formData.Train_Name} onChange={handleInputChange}/>
              {formErrors.Train_Name && <div className="invalid-feedback">{formErrors.Train_Name}</div>}
            </div>
            
          </form>
          : 
          
          <form>
            <div className="mb-3">
              <label htmlFor="Train_Name" className="form-label">
                Train Name
              </label>
              <input type="text" className={`form-control ${formErrors.Train_Name ? 'is-invalid' : ''}`} id="Train_Name" name="Train_Name" placeholder="" value={formData.Train_Name} onChange={handleInputChange}/>
              {formErrors.Train_Name && <div className="invalid-feedback">{formErrors.Train_Name}</div>}
            </div>
            
          </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddUser}>
            {editingAllTrain ? 'Save Changes' : 'Add Train'}
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
          <Button variant="danger" size="sm" onClick={handleDeleteAllTrain}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AddTrain;
