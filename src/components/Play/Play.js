import React from 'react';

import Board from '../Board/Board';
import Chat from '../Chat/Chat';
import Clock from '../Clock/Clock';

import './Play.css';

const Play = () => {
    return (
        <div className='play-app'>
            <div className='top-space'></div>
            <div className='boards'>
                <div className='main-board'>
                    <div className='board-player-top'>
                    <Clock></Clock>
                    </div>
                    <Board main={true}/>
                    <div className='board-player-bottom'>
                    <Clock></Clock>
                    </div>
                </div>
                <div className='side-board'>
                    <div className='board-player-top'>
                    <Clock></Clock>
                    </div>
                    <Board main={false}/>
                    <div className='board-player-bottom'>
                    <Clock></Clock>
                    </div>
                </div>
            </div>
            <div className='controls'>
             <Chat/>
            </div>
        </div>
    );
}

export default Play; 