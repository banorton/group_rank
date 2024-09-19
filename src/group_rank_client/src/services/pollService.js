import axios from 'axios';

const API_URL = 'https://localhost:5166/api/poll'; // URL for your API

export const createPoll = async (pollData) => {
    const response = await axios.post(`${API_URL}`, pollData);
    return response.data; // This should return the generated poll link
};

export const getPoll = async (pollId) => {
    const response = await axios.get(`${API_URL}/${pollId}`);
    return response.data; // This returns poll details (options, title, etc.)
};

export const submitRanking = async (pollId, rankings) => {
    const response = await axios.post(`${API_URL}/${pollId}/rank`, rankings);
    return response.data;
};

export const finishPoll = async (pollId) => {
    const response = await axios.put(`${API_URL}/${pollId}/finish`);
    return response.data; // This will return the final poll results
};
