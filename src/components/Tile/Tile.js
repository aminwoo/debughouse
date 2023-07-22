import './Tile.css';

import React from 'react';

export default function Tile({ row, col, image, children }) {
  const tileClassName = (row + col) % 2 === 0 ? 'tile black-tile' : 'tile white-tile';
  return (
    <div className={tileClassName}>
      {children}
      {image && <div style={{ backgroundImage: `url(${image})` }} className='chess-piece'></div>}
    </div>
  );
}