import React, { useState } from 'react';

import DropDisplay from './DropDisplay';

export default function Pocket() {


    const [hand, setHand] = useState({'p': 3, 'n': 1, 'b': 5, 'r': 1, 'q': 1, 'P': 1, 'Q': 5}); 


    const pocketPieces = []; 


    for (let type of ['p', 'n', 'b', 'r', 'q']) {
        let image = false;
        let quantity = hand[type]; 
        if (quantity > 0) 
            image = `assets/images/b_${type}.png`; 

        pocketPieces.push(<DropDisplay image={image} quantity={quantity}></DropDisplay>);
    }

    for (let type of ['q', 'r', 'b', 'n', 'p']) {
        let image = false;
        let quantity = hand[type.toUpperCase()]; 
        if (quantity > 0) 
            image = `assets/images/w_${type}.png`; 

        pocketPieces.push(<DropDisplay image={image} quantity={quantity}></DropDisplay>);
    }
    
    return (
        <div className='hand-component'>
            {pocketPieces}
        </div>
    );
}