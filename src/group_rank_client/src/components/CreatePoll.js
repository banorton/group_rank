import React, { useState } from 'react';
import { createPoll } from '../services/pollService';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [pollLink, setPollLink] = useState('');

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
        const pollData = { title, options: options.filter(option => option.trim()) };
        const response = await createPoll(pollData);
        setPollLink(response.link); // Save the generated poll link
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
            {pollLink && <p>Poll created! Share this link: <a href={pollLink}>{pollLink}</a></p>}
        </div>
    );
};

export default CreatePoll;
