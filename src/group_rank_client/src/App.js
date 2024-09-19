import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePoll from './components/CreatePoll';
import PollPage from './pages/PollPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CreatePoll />} />
                <Route path="/poll/:id" element={<PollPage />} />
            </Routes>
        </Router>
    );
}

export default App;
