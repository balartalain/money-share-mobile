import axios from 'axios'

const REMOTE_HOST_URL = 'https://moneyshare00.herokuapp.com/api'

export const herokuAPI = axios.create({
    baseURL: REMOTE_HOST_URL,
    timeout: 5000
})