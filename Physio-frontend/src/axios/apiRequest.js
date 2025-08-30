
import api from "./axios.interceptor";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;



export async function LoginRequest (url,request) {
    try {
        const res = await api(`${api_url}${url}`, request)
        return res
    } catch (error) {
        return error
    }
}

export async function ApiPutRequest(url, request){
    try {
        const res = await api.put(`${api_url}${url}`, request)
        return res
    } catch (error) {
        if(error.response && error.response.status == 401){
            window.location.href= "/auth/login"
        } else {
            return error
        }
    }
}
export async function ApiPostRequest(url, request){
    try {
        const res = await api.post(`${api_url}${url}`, request)
        return res
    } catch (error) {
        if(error.response && error.response.status == 401){
            window.location.href = "/auth/login"
        } else {
            return error
        }
    }
}
export async function ApiPatchRequest(url, request){
    try {
        const res = await api.patch(`${api_url}${url}`, request)
        return res
    } catch (error) {
        if(error.response && error.response.status == 401){
            window.location.href = "/auth/login"
        } else {
            throw error
        }
    }
}
export async function ApiDeleteRequest(url){
    try {
        const res = await api.delete(`${api_url}${url}`)
        return res
    } catch (error) {
        if(error.response && error.response.status == 401){
            window.location.href = "/auth/login"
        } else {
            throw error
        }
    }
}
export async function ApiFetchRequest(url){
    try {
        const res = await api.get(`${api_url}${url}`)
        return res
    } catch (error) {
        if(error.response && error.response.status == 401){
            window.location.href = "/auth/login"
        } else {
            return error
        }
    }
}