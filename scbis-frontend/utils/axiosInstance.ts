import axios from "axios";

export const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {

    "Content-Type": "application/json",
    "Accept": "application/json",
    // "Access-Control-Allow-Origin": "*",

    },
    
  withCredentials: false,
})