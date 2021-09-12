import axios from "axios";

async function fetchGet(url: string) {
    const response = await axios.get(url);
    const { data } = response;
    return data;
}

async function fetchPost(url: string, body: any) {
    const response = await axios.post(url, body);
    const { data } = response;
    return data;
}

async function fetchPut(url: string, body: any) {
    const response = await axios.put(url, body);
    const { data } = response;
    return data;
}

export { fetchGet, fetchPost, fetchPut };
