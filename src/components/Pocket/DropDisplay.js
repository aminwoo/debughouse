import React from 'react';

import './Pocket.css'

export default function DropDisplay({ image, quantity }) {
  const children = []; 
  if (image) {
    children.push(<div style={{ backgroundImage: `url(${image})` }} className='drop-display'></div>);
    children.push(<div className='quantity-placeholder'><span className='quantity-text'>{quantity}</span></div>);
  }
  else {
    children.push(<div className='drop-placeholder'></div>);
  }
  return (
    <div className='drop-selection'>
      {children}
    </div>
  );
}