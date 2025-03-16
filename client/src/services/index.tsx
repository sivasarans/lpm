import axios from 'axios';
import { parse } from 'cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3700/api/v1',
  
});

const handleResponse = (res: { data: any; }) => res.data;

const handleError = (err: any) => {
  console.error('API Error:', err);
  throw err;
};

const POST_CALL = (apiUri: string, data: any) => {
  return axiosInstance
    .post(apiUri, data)
    .then(handleResponse)
    .catch(handleError);
};

const POST_CALL_AUTH = (apiUri: string, data: any) => {
      const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));

  return axiosInstance
    .post(apiUri, data, {
      headers: {
        Authorization: `Bearer ${userAuthDetail?.token}`,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const GET_CALL_AUTH = (apiUri: string) => {
      const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));

  return axiosInstance
    .get(apiUri, {
      headers: {
        Authorization: `Bearer ${userAuthDetail?.token}`,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const UPDATE_CALL_AUTH = (apiUri: string, data: any) => {
      const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));

  return axiosInstance
    .put(apiUri, data, {
      headers: {
        Authorization: `Bearer ${userAuthDetail?.token}`,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const DELETE_CALL_AUTH = (apiUri: string) => {
      const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));

  return axiosInstance
    .delete(apiUri, {
      headers: {
        Authorization: `Bearer ${userAuthDetail?.token}`,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const UPLOAD_POST_CALL_AUTH = (apiUri: string, data: any) => {
      const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));

  return axiosInstance
    .post(apiUri, data, {
      headers: {
        Authorization: `Bearer ${userAuthDetail?.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(handleResponse)
    .catch(handleError);
};
const UPLOAD_POST_CALL = (apiUri: string, data: any) => {

  return axiosInstance
    .post(apiUri, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(handleResponse)
    .catch(handleError);
};
export { POST_CALL, GET_CALL_AUTH, POST_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH ,UPLOAD_POST_CALL_AUTH, UPLOAD_POST_CALL};
