import axios from 'axios';

const api = axios.create({
 baseURL: 'https://brokenoutbackend.herokuapp.com', 
});

export default api;