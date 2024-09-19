import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPoll } from '../services/pollService';

const PollPage = () => {
    const { id } = useParams();  // Get the poll ID from the URL
    const location = useLocation(); // Access any state passed via navigation
    const [poll, setPoll] = useState(null);  // State for the poll data
    const [rankings, setRankings] = useState({});  // State to store rankings

    const pollLink = location.state?.pollLink || `${window.location.origin}/poll/${id}`;  // Poll link

    // Fetch the poll data when the page loads
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                console.log(id);
                const data = await getPoll(id);  // Fetch the poll data from the backend
                setPoll(data);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPoll();
    }, [id]);

    // Handle ranking changes
    const handleRankingChange = (optionId, rank) => {
        setRankings(prevRankings => ({
            ...prevRankings,
            [optionId]: rank
        }));
    };

    // Submit rankings (You'd need to implement this in your backend)
    const handleSubmitRankings = () => {
        // Logic to submit rankings
        console.log(rankings);
        // Call the backend to submit the rankings
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Main Poll and Ranking Section */}
            <div style={{ flex: 3 }}>
                {poll ? (
                    <div>
                        <h2>{poll.title}</h2>
                        <ul>
                            {poll.options.map(option => (
                                <li key={option.id}>
                                    {option.name}
                                    <select onChange={(e) => handleRankingChange(option.id, e.target.value)}>
                                        <option value="">Select rank</option>
                                        {/* Assume ranking values are from 1 to number of options */}
                                        {[...Array(poll.options.length).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleSubmitRankings}>Submit Rankings</button>
                    </div>
                ) : (
                    <p>Loading poll...</p>
                )}
            </div>

            {/* Sidebar for Poll Link */}
            <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #ccc' }}>
                <h3>Share Poll Link</h3>
                <input
                    type="text"
                    value={pollLink}
                    readOnly
                    style={{ width: '100%' }}
                />
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(pollLink);
                    }}
                >
                    Copy Link
                </button>
            </div>
        </div>
    );
};

export default PollPage;
