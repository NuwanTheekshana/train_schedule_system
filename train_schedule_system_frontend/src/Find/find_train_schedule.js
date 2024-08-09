import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import $ from 'jquery';
import Swal from 'sweetalert2';

function FindTrainSchedule() {
  const auth_userid = localStorage.getItem("id");
  const auth_username = localStorage.getItem("UserName");
  const auth_email = localStorage.getItem("Email");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    User_Id: auth_userid,
    Seat_count:'',
    schedule_id:'',
  });
  const [formErrors, setFormErrors] = useState({
    User_Id: auth_userid,
    Seat_count:'',
    schedule_id:'',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
        User_Id: auth_userid,
    Seat_count:'',
    schedule_id:'',
    });
    setFormErrors({
        User_Id: auth_userid,
        Seat_count:'',
        schedule_id:'',
    });
  };


  const [editingAllTrain, seteditingAllTrain] = useState(null);
  const [deletingAllTrain, setDeletingAllTrain] = useState(null);
  const [AllTrain, setAllTrain] = useState([]); 
  const [fromlist, setfromlist] = useState([]);
  const [tolist, settolist] = useState([]);
  

  useEffect(() => {
    //handleSearch();
    handleFromList();
    handleToList();
  }, []);





  const handleFromList = async () => {
    try {
      const response = await axios.get(`https://localhost:7207/api/Schedule/ScheduleFromList`);
      setfromlist(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('From list failed..!', error);
    }
  };


  const handleToList = async () => {
    try {
      const response = await axios.get(`https://localhost:7207/api/Schedule/ScheduleToList`);
      settolist(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('To list failed..!', error);
    }
  };


  const tableRef = useRef(null);
  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://localhost:7207/api/Schedule/Find/GetTrainScheduleFindList/${formData.Start_DateTime}/${formData.End_DateTime}/${formData.From}/${formData.To}`);
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
      row.trainSchedule_id + ', \'' + row.from + '\', \'' + row.to + '\', \'' + row.availble_seat + '\', \'' + row.ticket_price + '\')"><i class="bi bi-pencil-square"></i> Book Ticket</button>' +
      '&nbsp;' +
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
        schedule_id: trainSchedule_id
    });
    handleShowModal();
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


 
  const handleAddTicket = async () => {
    console.log(formData);
    
    try {
      const errors = {};

      if (!formData.Seat_count) {
        errors.Seat_count = 'Seat count is required.';
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
        TrainSchedule_id: formData.schedule_id,
        Seat_count: formData.Seat_count,
        User_id: auth_userid
    }
    await axios.post('https://localhost:7207/api/Ticket/AddTicket', data);
      console.log('Train shedule book successfully');
      Swal.fire({title: 'Success', text: '', icon: 'success' }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          window.scrollTo({top: 0,behavior: 'smooth'});
        }
      });
      handleCloseModal();
      
    } catch (error) {
      console.error('Train shedule book failed', error);
      Swal.fire({title: 'Warning', text: error.response.data.statusMessage, icon: 'error' }).then((result) => {
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
            <h4>Find Train Schedule</h4>

          </div>
          <div className="card-body">

            <div className='card'>
                <div className="card-body">
                    <form>
                <div className="form-group mb-2 d-flex align-items-center">
                        <div className="mb-3 me-3">
                            <label htmlFor="Start_DateTime" className="form-label">Train Start DateTime</label>
                            <input type="date" className={`form-control ${formErrors.Start_DateTime ? 'is-invalid' : ''}`} id="Start_DateTime" name="Start_DateTime" value={formData.Start_DateTime} onChange={handleInputChange}/>
                            {formErrors.Start_DateTime && <div className="invalid-feedback">{formErrors.Start_DateTime}</div>}
                        </div>
                        <div className="mb-3 me-3">
                            <label htmlFor="End_DateTime" className="form-label">Train End DateTime</label>
                            <input type="date" className={`form-control ${formErrors.End_DateTime ? 'is-invalid' : ''}`} id="End_DateTime" name="End_DateTime" value={formData.End_DateTime} onChange={handleInputChange}/>
                            {formErrors.End_DateTime && <div className="invalid-feedback">{formErrors.End_DateTime}</div>}
                        </div>
                        <div className="mb-3 me-3">
                            <label htmlFor="From" className="form-label">From</label>
                            <select className={`form-control ${formErrors.train ? 'is-invalid' : ''}`} id="From" name="From" onChange={handleInputChange}>
                            <option value="">From Location</option>
                            {fromlist.map((from) => (
                                <option key={from.departureLocation} value={from.departureLocation}>
                                {from.departureLocation}
                                </option>
                            ))}
                            </select>
                            {formErrors.From && <div className="invalid-feedback">{formErrors.From}</div>}
                        </div>
                        <div className="mb-3 me-3">
                            <label htmlFor="To" className="form-label">To</label>
                            <select className={`form-control ${formErrors.train ? 'is-invalid' : ''}`} id="To" name="To" onChange={handleInputChange}>
                            <option value="">To Location</option>
                            {tolist.map((to) => (
                                <option key={to.arrivalLocation} value={to.arrivalLocation}>
                                {to.arrivalLocation}
                                </option>
                            ))}
                            </select>
                            {formErrors.To && <div className="invalid-feedback">{formErrors.To}</div>}
                        </div>
                        <div className="mt-3">
                        <button type="button" className="btn btn-warning" onClick={handleSearch}> Search</button>
                        </div>
                        </div>

                        </form>
                </div>
            </div>



          <table id="tableId" className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th>Train Schedule ID</th>
                  <th>Train Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>From</th>
                  <th>To</th>
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
          <Modal.Title>Book Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
            
        <div className="mb-3">
              <label htmlFor="customername" className="form-label">
                Customer Name
              </label>
          <input type="text" className={`form-control`} id="User_Name" name="User_Name" placeholder="" value={auth_username} onChange={handleInputChange} disabled/>
          <input type="hidden" className={`form-control ${formErrors.User_Id ? 'is-invalid' : ''}`} id="User_Id" name="User_Id" placeholder="" value={auth_userid} onChange={handleInputChange}/>
          <input type="hidden" className={`form-control ${formErrors.schedule_id ? 'is-invalid' : ''}`} id="schedule_id" name="schedule_id" placeholder="" value={editingAllTrain} onChange={handleInputChange}/>
          </div>

          <div className="mb-3">
              <label htmlFor="customeremail" className="form-label">
                Customer Email
              </label>
          <input type="email" className={`form-control `} id="customeremail" name="customeremail" placeholder="" value={auth_email} onChange={handleInputChange} disabled/>
          </div>

            <div className="mb-3">
              <label htmlFor="Seat_count" className="form-label">
                Request Seats Count
              </label>
              <input type="number" className={`form-control ${formErrors.Seat_count ? 'is-invalid' : ''}`} id="Seat_count" name="Seat_count" placeholder="" value={formData.Seat_count} onChange={handleInputChange}/>
              {formErrors.Seat_count && <div className="invalid-feedback">{formErrors.Seat_count}</div>}
            </div>
            
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddTicket}>
            Book Ticket
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default FindTrainSchedule;
