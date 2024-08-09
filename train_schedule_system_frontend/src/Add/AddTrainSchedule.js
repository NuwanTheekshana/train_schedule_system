import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function AddTrainSchedule() {
  const auth_userid = localStorage.getItem("id");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    User_Id: auth_userid,
    train: '',
    Start_DateTime: '',
    End_DateTime: '',
    From: '',
    To: '',
    Avaible_Seat: '',
    Ticket_Price: '',
  });
  const [formErrors, setFormErrors] = useState({
    User_Id: auth_userid,
    train: '',
    Start_DateTime: '',
    End_DateTime: '',
    From: '',
    To: '',
    Avaible_Seat: '',
    Ticket_Price: '',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
        User_Id: auth_userid,
        train: '',
        Start_DateTime: '',
        End_DateTime: '',
        From: '',
        To: '',
        Avaible_Seat: '',
        Ticket_Price: '',
    });
    setFormErrors({
        User_Id: auth_userid,
        train: '',
        Start_DateTime: '',
        End_DateTime: '',
        From: '',
        To: '',
        Avaible_Seat: '',
        Ticket_Price: '',
    });
  };


  const [editingAllTrain, seteditingAllTrain] = useState(null);
  const [deletingAllTrain, setDeletingAllTrain] = useState(null);
  const [AllTrain, setAllTrain] = useState([]); 
  const [trains, settrains] = useState([]);
  

  useEffect(() => {
    fetchData();
    handleTrainList();
  }, []);


  const handleTrainList = async () => {
    try {
      const response = await axios.get(`https://localhost:7207/api/Train/TrainList`);
      settrains(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Train list failed..!', error);
    }
  };


  const tableRef = useRef(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('https://localhost:7207/api/Schedule/TrainSchedule');
      setAllTrain(response.data);


      if ($.fn.DataTable.isDataTable('#tableId')) {
        tableRef.current.DataTable().destroy();
      }
      console.log(response.data);
      tableRef.current = $('#tableId').DataTable({
        data: response.data,
        columns: [
          { data: 'trainSchedule_id', title: 'Train Schedule Id' },
          { data: 'train_name', title: 'Train Name' },
          { data: 'startdatetime', title: 'Start Date' },
          { data: 'enddatetime', title: 'End Date' },
          { data: 'from', title: 'From' },
          { data: 'to', title: 'To' },
          { data: 'availble_seat', title: 'Availble Seat' },
          { data: 'ticket_price', title: 'Ticket Price' },
          
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
      row.trainSchedule_id + ', \'' + row.from + '\', \'' + row.to + '\', \'' + row.availble_seat + '\', \'' + row.ticket_price + '\')"><i class="bi bi-pencil-square"></i> Edit</button>' +
      '&nbsp;' +
      '<button type="button" class="btn btn-danger btn-sm" onclick="window.handleDelete(' +
      row.trainSchedule_id +
      ')">Delete</button>' +
      '</center>'
    );
  };

  window.handleEdit = (trainSchedule_id, from, to, availble_seat, ticket_price) => {
    seteditingAllTrain(trainSchedule_id);
    setFormData({
        From: from,
        To: to,
        Avaible_Seat: availble_seat,
        Ticket_Price: ticket_price,
    });
    handleShowModal();
};

window.handleDelete = (trainSchedule_id) => {
    setDeletingAllTrain(trainSchedule_id);
    handleShowDeleteModal();
  };

  const handleDeleteAllTrain = async () => {
    try {
    await axios.delete(`https://localhost:7207/api/Schedule/TrainSchedule/${deletingAllTrain}`);
    console.log('Train schedule deleted successfully');
    Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
        window.scrollTo({top: 0,behavior: 'smooth'});
      }
    });
    handleCloseDeleteModal();
    } catch (error) {
    console.error('Error deleting train shedule', error);
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


 
  const handleAddTrainSchedule = async () => {
    console.log(formData);
    try {
      const errors = {};

      if (!editingAllTrain) 
      {
      if (!formData.train) {
        errors.train = 'Train name is required.';
      }

      if (!formData.Start_DateTime) {
        errors.Start_DateTime = 'Train start datetime is required.';
      }

      if (!formData.End_DateTime) {
        errors.End_DateTime = 'Train end datetime is required.';
      }

      if (!formData.From) {
        errors.From = 'From location is required.';
      }

      if (!formData.To) {
        errors.To = 'To location is required.';
      }

      if (!formData.Avaible_Seat) {
        errors.Avaible_Seat = 'Availble seat count is required.';
      }

      if (!formData.Ticket_Price) {
        errors.Ticket_Price = 'Ticket price is required.';
      }
    }
    else{
        if (!formData.From) {
            errors.From = 'From location is required.';
          }
    
          if (!formData.To) {
            errors.To = 'To location is required.';
          }
    
          if (!formData.Avaible_Seat) {
            errors.Avaible_Seat = 'Availble seat count is required.';
          }
    
          if (!formData.Ticket_Price) {
            errors.Ticket_Price = 'Ticket price is required.';
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
        Train_id: formData.train,
        Startdatetime: formData.Start_DateTime,
        Enddatetime: formData.End_DateTime,
        DepartureLocation: formData.From,
        ArrivalLocation : formData.To,
        Availble_seat: formData.Avaible_Seat,
        Ticket_price: formData.Ticket_Price,
        Created_by: auth_userid
    }
    console.log(data);
      if (editingAllTrain) {
        await axios.put(`https://localhost:7207/api/Schedule/TrainSchdule/${editingAllTrain}`, data);
      } else {
        await axios.post('https://localhost:7207/api/Schedule/AddTrainSchedule', data);
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
            <h4>Train Schedule List</h4>
            <Button variant="danger" size="sm" onClick={handleShowModal}>
              Add New Train Schedule
            </Button>
          </div>
          <div className="card-body">
          <table id="tableId" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Train Schedule ID</th>
                  <th>Train Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Availble Seat</th>
                  <th>Ticket Price</th>
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
          <Modal.Title>{editingAllTrain ? 'Edit Train Schedule' : 'Add New Train Schedule'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!editingAllTrain ?
        <form>
          <input type="hidden" className={`form-control ${formErrors.User_Id ? 'is-invalid' : ''}`} id="User_Id" name="User_Id" placeholder="" value={auth_userid} onChange={handleInputChange}/>

            <div className="mb-3">
                  <label htmlFor="train" className="col-sm-4 col-form-label">Train Name </label>

                    <select className={`form-control ${formErrors.train ? 'is-invalid' : ''}`} id="train" name="train" onChange={handleInputChange}>
                      <option value="">Select a train</option>
                      {trains.map((train) => (
                        <option key={train.trainId} value={train.trainId}>
                          {train.trainName}
                        </option>
                      ))}
                    </select>
                    {formErrors.train && <div className="invalid-feedback">{formErrors.train}</div>}

            </div>

            <div className="mb-3">
              <label htmlFor="Start_DateTime" className="form-label">
                Train Start DateTime
              </label>
              <input type="datetime-local" className={`form-control ${formErrors.Start_DateTime ? 'is-invalid' : ''}`} id="Start_DateTime" name="Start_DateTime" placeholder="" value={formData.Start_DateTime} onChange={handleInputChange}/>
              {formErrors.Start_DateTime && <div className="invalid-feedback">{formErrors.Start_DateTime}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="End_DateTime" className="form-label">
                Train End DateTime
              </label>
              <input type="datetime-local" className={`form-control ${formErrors.End_DateTime ? 'is-invalid' : ''}`} id="End_DateTime" name="End_DateTime" placeholder="" value={formData.End_DateTime} onChange={handleInputChange}/>
              {formErrors.End_DateTime && <div className="invalid-feedback">{formErrors.End_DateTime}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="From" className="form-label">
                From
              </label>
              <input type="Text" className={`form-control ${formErrors.From ? 'is-invalid' : ''}`} id="From" name="From" placeholder="" value={formData.From} onChange={handleInputChange}/>
              {formErrors.From && <div className="invalid-feedback">{formErrors.From}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="To" className="form-label">
                To
              </label>
              <input type="Text" className={`form-control ${formErrors.To ? 'is-invalid' : ''}`} id="To" name="To" placeholder="" value={formData.To} onChange={handleInputChange}/>
              {formErrors.To && <div className="invalid-feedback">{formErrors.To}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="Avaible_Seat" className="form-label">
                Avaible Seat
              </label>
              <input type="number" className={`form-control ${formErrors.Avaible_Seat ? 'is-invalid' : ''}`} id="Avaible_Seat" name="Avaible_Seat" placeholder="" value={formData.Avaible_Seat} onChange={handleInputChange}/>
              {formErrors.Avaible_Seat && <div className="invalid-feedback">{formErrors.Avaible_Seat}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="Ticket_Price" className="form-label">
                Ticket Price
              </label>
              <input type="number" className={`form-control ${formErrors.Ticket_Price ? 'is-invalid' : ''}`} id="Ticket_Price" name="Ticket_Price" placeholder="" value={formData.Ticket_Price} onChange={handleInputChange}/>
              {formErrors.Ticket_Price && <div className="invalid-feedback">{formErrors.Ticket_Price}</div>}
            </div>
            
          </form>
          : 
          
          <form>
            <div className="mb-3">
              <label htmlFor="From" className="form-label">
                From
              </label>
              <input type="Text" className={`form-control ${formErrors.From ? 'is-invalid' : ''}`} id="From" name="From" placeholder="" value={formData.From} onChange={handleInputChange}/>
              {formErrors.From && <div className="invalid-feedback">{formErrors.From}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="To" className="form-label">
                To
              </label>
              <input type="Text" className={`form-control ${formErrors.To ? 'is-invalid' : ''}`} id="To" name="To" placeholder="" value={formData.To} onChange={handleInputChange}/>
              {formErrors.To && <div className="invalid-feedback">{formErrors.To}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="Avaible_Seat" className="form-label">
                Avaible Seat
              </label>
              <input type="number" className={`form-control ${formErrors.Avaible_Seat ? 'is-invalid' : ''}`} id="Avaible_Seat" name="Avaible_Seat" placeholder="" value={formData.Avaible_Seat} onChange={handleInputChange}/>
              {formErrors.Avaible_Seat && <div className="invalid-feedback">{formErrors.Avaible_Seat}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="Ticket_Price" className="form-label">
                Ticket Price
              </label>
              <input type="number" className={`form-control ${formErrors.Ticket_Price ? 'is-invalid' : ''}`} id="Ticket_Price" name="Ticket_Price" placeholder="" value={formData.Ticket_Price} onChange={handleInputChange}/>
              {formErrors.Ticket_Price && <div className="invalid-feedback">{formErrors.Ticket_Price}</div>}
            </div>
            
          </form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddTrainSchedule}>
            {editingAllTrain ? 'Save Changes' : 'Add Train Schedule'}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Train Schedule?
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

export default AddTrainSchedule;
