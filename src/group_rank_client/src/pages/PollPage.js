import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPoll, submitRanking, endPoll, getPollResults } from '../services/pollService';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'OPTION';

const PollPage = () => {
    const { id } = useParams();  // Get the poll ID from the URL
    const location = useLocation(); // Access any state passed via navigation
    const [poll, setPoll] = useState(null);  // State for the poll data
    const [rankings, setRankings] = useState([]);  // State to store rankings
    const [isCreator, setIsCreator] = useState(false); // Track if the user is the creator
    const [submitted, setSubmitted] = useState(false);  // Track if rankings have been submitted
    const [pollEnded, setPollEnded] = useState(false); // Track if the poll has ended
    const [finalRankings, setFinalRankings] = useState([]); // Store final rankings

    const pollLink = location.state?.pollLink || `${window.location.origin}/poll/${id}`;  // Poll link

    // Fetch the poll data when the page loads
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const data = await getPoll(id);  // Fetch the poll data from the backend
                setPoll(data);
                setRankings(data.options);  // Initialize rankings with poll options
                setPollEnded(data.isFinished);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPoll();

        // Check if the user is the creator
        if (location.state?.isCreator) {
            setIsCreator(true);
        }
    }, [id, location.state]);

    // Polling to check if poll has ended
    useEffect(() => {
        if (!pollEnded) {
            const interval = setInterval(async () => {
                try {
                    const data = await getPoll(id);
                    if (data.isFinished) {
                        setPollEnded(true);
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Error checking poll status:', error);
                    clearInterval(interval);
                }
            }, 5000); // Check every 5 seconds

            return () => clearInterval(interval); // Clean up on unmount
        }
    }, [pollEnded, id]);

    // Fetch final rankings when poll ends
    useEffect(() => {
        if (pollEnded) {
            const fetchFinalRankings = async () => {
                try {
                    const results = await getPollResults(id);
                    setFinalRankings(results);
                } catch (error) {
                    console.error('Error fetching final rankings:', error);
                }
            };

            fetchFinalRankings();
        }
    }, [pollEnded, id]);

    // Handle ranking changes (drag-and-drop result)
    const moveOption = (dragIndex, hoverIndex) => {
        const updatedRankings = [...rankings];
        const [removed] = updatedRankings.splice(dragIndex, 1);
        updatedRankings.splice(hoverIndex, 0, removed);
        setRankings(updatedRankings);
    };

    // Submit rankings
    const handleSubmitRankings = async () => {
        const rankedOptions = rankings.map((option, index) => ({
            optionId: option.id,
            rank: index + 1
        }));
        console.log("Ranked Options:", rankedOptions);

        try {
            await submitRanking(id, rankedOptions);
            console.log('Rankings submitted successfully');
            setSubmitted(true);  // Update the submitted state
        } catch (error) {
            console.error('Error submitting rankings:', error);
        }
    };

    // Handle ending the poll
    const handleEndPoll = async () => {
        try {
            await endPoll(id); // Call the service function with the poll ID
            console.log('Poll ended successfully');
            setPollEnded(true); // Update the state to reflect the poll has ended
        } catch (error) {
            console.error('Error ending poll:', error);
        }
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
                            {pollEnded ? (
                                <div>
                                    <h3>Final Rankings:</h3>
                                    {finalRankings.length > 0 ? (
                                        <ol>
                                            {finalRankings.map((option) => (
                                                <li key={option.id}>
                                                    {option.name} - Average Rank: {option.averageRank === Number.MAX_VALUE ? 'N/A' : option.averageRank.toFixed(2)}
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p>No rankings available.</p>
                                    )}
                                </div>
                            ) : submitted ? (
                                <p>Ranking Submitted!</p>
                            ) : (
                                <>
                                    {/* Render the options and submit button */}
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
                                </>
                            )}
                            {/* Conditionally render the "End Poll" button */}
                            {isCreator && !pollEnded && (
                                <button onClick={handleEndPoll} style={{ marginTop: '20px' }}>
                                    End Poll
                                </button>
                            )}
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
