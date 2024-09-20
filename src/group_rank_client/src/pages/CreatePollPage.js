import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../services/pollService';

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
        <div>
            <h2>Create a Poll</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Poll Title"
                    required
                />
                <div>
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                    ))}
                </div>
                <button type="button" onClick={addOption}>Add Option</button>
                <button type="submit">Create Poll</button>
            </form>
        </div>
    );
};

export default CreatePollPage;
