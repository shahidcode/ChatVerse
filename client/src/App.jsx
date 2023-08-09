import './App.css';
import axios from 'axios';
import ChildRoutes from './ChildRoutes';
import { BASE_URL } from './utils/backend';

function App() {

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = BASE_URL;

  return (
      <div className='App overflow-auto'>
        <ChildRoutes/>
      </div>
  )

}

export default App
