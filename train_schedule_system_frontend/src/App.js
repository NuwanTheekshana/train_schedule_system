import './App.css';
import Page404 from './Error/Page404'; 
import PrivateRoute from './PrivateRoute';
import Login from './Authentication/Login';
import Home from './Home';

import UserList from './Users/UserList';
import AddTrain from './Add/AddTrain';
import AddTrainSchedule from './Add/AddTrainSchedule';
import FindTrainSchedule from './Find/find_train_schedule';



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
        <Route path="/addtrainschedule" element={<PrivateRoute element={<AddTrainSchedule />} />} />
        <Route path="/findtrainschedule" element={<PrivateRoute element={<FindTrainSchedule />} />} />
      
      </Routes>
    </Router>
  );
}

export default App;
