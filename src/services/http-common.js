import axios from 'axios'

export default axios.create({
  baseURL: 'http://68.183.86.2/users_crud_laravel/api/v1/',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin' : '*'
  },
})