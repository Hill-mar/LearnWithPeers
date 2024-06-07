import React, { useState } from 'react';
import ReactPlayer from 'react-player';


const ReactPlayerWrapper = ({ url, onResponsesChange }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [responses, setResponses] = useState({});

    const handleProgress = state => {
        setCurrentTime(state.playedSeconds);
    };

    const handleResponseChange = (prompt, value) => {
        const updatedResponses = { ...responses, [prompt]: value };
        setResponses(updatedResponses);
        onResponsesChange(updatedResponses);  // Propagate changes up to parent component
    };

    return (
        <div>
            <ReactPlayer
                url={url}
                controls={true}
                width="80%"
                height="100%"
                playing={true}
                onProgress={handleProgress}
                onError={(e) => console.log('Error playing video:', e)}
            />
            
        </div>
    );
};

export default ReactPlayerWrapper;


/*<div className="prompts-container">
                {REVIEW_PROMPTS.map((prompt, index) => (
                    <div key={index} className="prompt">
                        <p>{prompt}</p>
                        <textarea
                            value={responses[prompt] || ''}
                            onChange={(e) => handleResponseChange(prompt, e.target.value)}
                        />
                    </div>
                ))}
            </div>*/