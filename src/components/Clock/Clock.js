import React, { useState, useEffect } from 'react';

import './Clock.css';

export default function Clock() {

    const [running, setRunning] = useState(true);
    const [timeLeft, setTimeLeft] = useState(1200); 

    useEffect(() => {
        const interval = setInterval(() => {
            if (running) 
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 100);
    
        if (timeLeft <= 0) {
            setRunning(false);
        }
        return () => clearInterval(interval);
      }, [running, timeLeft]);

    const formatTime = (deciseconds) => {
        const seconds = Math.floor(deciseconds / 10);
        const minutes = Math.floor(seconds / 60);

        return `${minutes}:${(seconds - minutes * 60).toString().padStart(2, '0')}.${deciseconds % 10}`;
    };

    let className = 'clock-component'; 

    if (running) {
        className += ' clock-background-running'
        if (timeLeft < 100) 
            className += ' clock-low-time'; 
    }
    else {
        className += ' clock-background-stopped'
        if (timeLeft < 100) 
            className += ' clock-low-time'; 
    }


    return (
        <div className={className}>
            <span className='clock-text'>{formatTime(timeLeft)}</span> 
        </div>
    );
}