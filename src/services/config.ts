import axios from "axios";
import { userLocalStorage } from "./LocalService";

export const https = axios.create(
    {
        baseURL: 'http://localhost:8080/',
        headers:{
            Authorization: `Bearer ` + userLocalStorage?.get()?.token
        }
    }   
)