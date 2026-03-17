import axios from "axios";

const Api = axios.create({baseURL : 'https://api.unsplash.com/search/photos'});

export default Api