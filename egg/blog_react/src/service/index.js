import axios from 'axios';
const baseURL = 'http://39.106.133.41:7001';
const config = {
    baseURL,
    timeout: 8000,
    withCredentials: true // 跨域请求的时候携带cookie
}
export function get(url) {
    return axios({
        ...config,
        method: 'get',
        url,
    }).then(res => res.data); // res={headers,data,config} data
}
export function post(url, data) {
    return axios({
        ...config,
        method: 'post',
        data,
        url,
    }).then(res => {
        console.log(res);
        return res.data
    });
}
export function put(url, data) {
    return axios({
        ...config,
        method: 'put',
        data,
        url,
    }).then(res => res.data);
}
export function del(url, data) {
    return axios({
        ...config,
        method: 'delete',
        url,
        data,
    }).then(res => res.data);
}