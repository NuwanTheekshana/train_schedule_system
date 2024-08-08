import './App.css';
import Page404 from './Error/Page404'; 
import PrivateRoute from './PrivateRoute';
import Login from './Authentication/Login';
import Home from './Home';

import UserList from './Users/UserList';
import AddTrain from './Add/AddTrain';
// import ViewSales from './Event/ViewSales';
// import SellTicket from './Ticket/sell_ticket';
// import ViewSellTicket from './Ticket/view_sell_tickets';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* error page */}
      <Route path="*" element={<Page404 />} />
      
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* PrivateRoute if user session authenticated */}
        <Route path="/users" element={<PrivateRoute element={<UserList />} />} />
        <Route path="/addtrain" element={<PrivateRoute element={<AddTrain />} />} />

        {/* <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        
        <Route path="/addevent" element={<PrivateRoute element={<AddEvent />} />} />
        <Route path="/viewsales" element={<PrivateRoute element={<ViewSales />} />} />
        <Route path="/sellticket" element={<PrivateRoute element={<SellTicket />} />} />
        <Route path="/viewselltickets" element={<PrivateRoute element={<ViewSellTicket />} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
