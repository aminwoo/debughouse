import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { selectBoard } from '../../features/bughouse/gameSlice';


import './Clock.css';

export default function Clock({ color, boardId }) {

    const board = useSelector(selectBoard);
    const [running, setRunning] = useState(true);
    const [timeLeft, setTimeLeft] = useState(6000); 

    useEffect(() => {
        const interval = setInterval(() => {
            if (running) 
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);

            const isRunning = timeLeft > 0 && board.board[boardId].turn() === color;
            setRunning(isRunning);
        }, 1000);

        return () => clearInterval(interval);
      }, [running, timeLeft, board, boardId, color]);

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