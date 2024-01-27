import React from 'react';

const ProgressBar = ({ totalQuestions, currentQuestion }) => {
    const progress = (currentQuestion / totalQuestions) * 100;

    return (
        <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;