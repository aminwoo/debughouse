import React from 'react';

import Board from '../Board/Board';
import Chat from '../Chat/Chat';
import Clock from '../Clock/Clock';

import './Play.css';
import { ColorType } from '../../Types';

const Play = () => {
    return (
        <div className='play-app'>
            <div className='top-space'></div>
            <div className='boards'>
                <div className='main-board'>
                    <div className='board-player-top'>
                    <Clock color={ColorType.BLACK} boardId={0}></Clock>
                    </div>
                    <Board boardId={0}/>
                    <div className='board-player-bottom'>
                    <Clock color={ColorType.WHITE} boardId={0}></Clock>
                    </div>
                </div>
            </div>
            {/*<div className='controls'>
             <Chat/>
            </div>*/}
        </div>
    );
}

export default Play; 