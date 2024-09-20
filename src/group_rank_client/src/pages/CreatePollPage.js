import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import './CreatePollPage.css'; // Import the CSS file

const CreatePollPage = () => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare poll data
        const pollData = {
            title,
            options: options.filter(option => option.trim()).map(option => ({ name: option }))
        };

        try {
            // Send poll data to backend and receive the response
            const response = await createPoll(pollData);

            // Make sure pollId exists in the response
            if (response && response.pollId) {
                // Navigate to PollPage.js using pollId
                navigate(`/poll/${response.pollId}`, { state: { isCreator: true } });
            } else {
                console.error('Poll creation failed: Missing pollId');
            }
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    return (
        <div className="create-poll-page">
            <div className="form-container">
                <h1 className="create-poll-title">Create a Poll</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Poll Title"
                            required
                            className="input-field"
                        />
                        {options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                                className="input-field option-input"
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addOption}
                            className="button"
                        >
                            Add Option
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="button create-poll-button"
                    >
                        Create Poll
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePollPage;
