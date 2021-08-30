import axios from "axios";

async function fetchData(url: string) {
    const response = await axios.get(url);
    const data = response.data;
    return data;
}

export { fetchData };
