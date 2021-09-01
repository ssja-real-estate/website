import axios from "axios";

async function fetchGet(url: string) {
    const response = await axios.get(url);
    const { data } = response;
    return data;
}

async function fetchPost(url: string, body: object) {
    const response = await axios.post(url, body);
    const { data } = response;
    return data;
}

export { fetchGet, fetchPost };
