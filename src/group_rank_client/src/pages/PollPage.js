import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPoll } from '../services/pollService';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'OPTION';

const PollPage = () => {
    const { id } = useParams();  // Get the poll ID from the URL
    const location = useLocation(); // Access any state passed via navigation
    const [poll, setPoll] = useState(null);  // State for the poll data
    const [rankings, setRankings] = useState([]);  // State to store rankings (as an array of options)

    const pollLink = location.state?.pollLink || `${window.location.origin}/poll/${id}`;  // Poll link

    // Fetch the poll data when the page loads
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const data = await getPoll(id);  // Fetch the poll data from the backend
                setPoll(data);
                setRankings(data.options);  // Initialize rankings with poll options
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPoll();
    }, [id]);

    // Handle ranking changes (drag-and-drop result)
    const moveOption = (dragIndex, hoverIndex) => {
        const updatedRankings = [...rankings];
        const [removed] = updatedRankings.splice(dragIndex, 1);
        updatedRankings.splice(hoverIndex, 0, removed);
        setRankings(updatedRankings);
    };

    // Submit rankings (You'd need to implement this in your backend)
    const handleSubmitRankings = () => {
        const rankedOptions = rankings.map((option, index) => ({
            optionId: option.id,
            rank: index + 1
        }));
        console.log("Ranked Options:", rankedOptions);
        // Call the backend to submit the rankings
    };

    const PollOption = ({ option, index, moveOption }) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: ItemType,
            item: { index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, dropRef] = useDrop({
            accept: ItemType,
            hover: (draggedItem) => {
                if (draggedItem.index !== index) {
                    moveOption(draggedItem.index, index);
                    draggedItem.index = index;
                }
            },
        });

        return (
            <li
                ref={(node) => dragRef(dropRef(node))}
                style={{
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: isDragging ? '#d3d3d3' : '#f9f9f9',
                    opacity: isDragging ? 0.5 : 1,
                    cursor: 'move',
                }}
            >
                {option.name}
            </li>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex' }}>
                {/* Main Poll and Ranking Section */}
                <div style={{ flex: 3 }}>
                    {poll ? (
                        <div>
                            <h2>{poll.title}</h2>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {rankings.map((option, index) => (
                                    <PollOption
                                        key={option.id}
                                        option={option}
                                        index={index}
                                        moveOption={moveOption}
                                    />
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
        </DndProvider>
    );
};

export default PollPage;
