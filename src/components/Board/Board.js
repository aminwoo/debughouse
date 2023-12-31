import React, { useCallback, useEffect, useRef, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { selectBoard } from '../../features/bughouse/gameSlice';


import { RandomBot, Bot } from '../../engine/engine';

import './Board.css';
import Tile from '../Tile/Tile';

import Pocket from '../Pocket/Pocket';
import { Position } from '../../models/Position';

const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export default function Board({ boardId }) {
  
  const board = useSelector(selectBoard);
  const [fen, setFen] = useState(board.board[boardId].fen());

  const [flipped, setFlipped] = useState(boardId === 1);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [startPosition, setStartPosition] = useState(new Position(-1, -1));
  const [grabPosition, setGrabPosition] = useState(new Position(-1, -1));
  const [tileSize, setTileSize] = useState(100);
  const chessboardRef = useRef(null);

  const handleDragStart = (e) => {
    e.preventDefault(); 
  };

  function grabPiece(e) {
    const element = e.target;
    const chessboard = chessboardRef.current;

    if (element.classList.contains('drop-display')) {

    }

    if (selectedPiece === null && element.classList.contains('chess-piece') && chessboard) {  
      setTileSize(chessboard.getBoundingClientRect().width / 8);
      var startX, startY; 

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      if (flipped) {
        startX = Math.floor((8 * tileSize - (e.clientX + scrollX - chessboard.offsetLeft)) / tileSize);
        startY = Math.abs(Math.floor((e.clientY + scrollY - chessboard.offsetTop) / tileSize));
      }
      else {
        startX = Math.floor((e.clientX + scrollX - chessboard.offsetLeft) / tileSize);
        startY = Math.abs(Math.ceil((e.clientY + scrollY - chessboard.offsetTop - 8 * tileSize) / tileSize));
      }
      setStartPosition(new Position(startX, startY)); 

      const rect = element.getBoundingClientRect();
      const { top, left } = rect;
      setGrabPosition(new Position(left, top));

      const x = e.clientX - left - tileSize / 2;
      const y = e.clientY - top - tileSize / 2;
      element.style.left = x + 'px';
      element.style.top = y + 'px';
      element.style.zIndex = 999;
      setSelectedPiece(element);
    }
  }
  
  function movePiece(e) {
    const chessboard = chessboardRef.current;
    if (selectedPiece && chessboard) {
      const x = e.clientX - grabPosition.x - tileSize / 2;
      const y = e.clientY - grabPosition.y - tileSize / 2;
      selectedPiece.style.left = x + 'px';
      selectedPiece.style.top = y + 'px';
    }
  }
  
  function dropPiece(e) {
    const chessboard = chessboardRef.current;
    if (selectedPiece && chessboard) {
      var endX, endY; 

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      console.log(scrollY);

      if (flipped) {
        endX = Math.floor((8 * tileSize - (e.clientX + scrollX - chessboard.offsetLeft)) / tileSize);
        endY = Math.abs(Math.floor((e.clientY + scrollY - chessboard.offsetTop) / tileSize));
      }
      else {
        endX = Math.floor((e.clientX + scrollX - chessboard.offsetLeft) / tileSize);
        endY = Math.abs(Math.ceil((e.clientY + scrollY - chessboard.offsetTop - 8 * tileSize) / tileSize));
      }

      const from = columns[startPosition.x] + rows[startPosition.y];
      const to = columns[endX] + rows[endY]; 
      const move = from + to;
      console.log(`${e.clientX}, ${e.clientY}, ${chessboard.offsetLeft}, ${chessboard.offsetTop}, ${tileSize}, ${endX}, ${endY}`);
      console.log(move); 
      if (board.isLegal(boardId, move)) {
        board.doMove(boardId, move);
      }

      selectedPiece.style.top = 0;
      selectedPiece.style.left = 0;
      selectedPiece.style.zIndex = 0;
      setSelectedPiece(null);
    }
  }
  
  const handleKeyPress = (event) => {
    if (event.key === 'f') {
      setFlipped(prevFlipped => !prevFlipped);
    }
  };


  const doMove = useCallback(( board, boardId, from, to ) => {
      board.doMove(boardId, from + to); 
      return;
    }, []
  );

  useEffect(() => {

    let ignore = false;
    if (board.board[boardId].turn() === (boardId === 0 ? 'b' : 'w')) {
      const fen = board.board[boardId].fen();

      Bot(fen).then((move) => {
        if (move && !ignore) {
          board.doMove(boardId, move.from + move.to); 
          setFen(fen);
        }
      });
    }

    return () => {
      ignore = true;
    };

    /*if (main) {
      document.addEventListener('keydown', handleKeyPress);

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }*/
  });


  let boardElements = []; 
  if (flipped) {
    for (let row = 0; row < columns.length; row++) {
      for (let col = columns.length - 1; col >= 0; col--) {
        let piece = board.board[boardId].get(columns[col] + rows[row]);
        let image = false;
        if (piece !== false)
          image = `assets/images/${piece.color}_${piece.type}.png`;
  
        boardElements.push(<Tile row={row} col={col} image={image}> 
        {(col === 7) && <div className={'row-coordinate ' + (row % 2 !== 0 ? 'white-coordinate' : 'black-coordinate')}><span>{row + 1}</span></div>}
        {(row === 7) && <div className={'col-coordinate ' + (col % 2 !== 0 ? 'white-coordinate' : 'black-coordinate')}><span>{String.fromCharCode(97 + col)}</span></div>}
        </Tile>);
      }
    }
  }
  else {
    for (let row = rows.length - 1; row >= 0; row--) {
      for (let col = 0; col < columns.length; col++) {
        let piece = board.board[boardId].get(columns[col] + rows[row]);
        let image = false;
        if (piece !== false)
          image = `assets/images/${piece.color}_${piece.type}.png`;
  
        boardElements.push(<Tile row={row} col={col} image={image}> 
          {(col === 0) && <div className={'row-coordinate ' + (row % 2 === 0 ? 'white-coordinate' : 'black-coordinate')}><span>{row + 1}</span></div>}
          {(row === 0) && <div className={'col-coordinate ' + (col % 2 === 0 ? 'white-coordinate' : 'black-coordinate')}><span>{String.fromCharCode(97 + col)}</span></div>}
          </Tile>);
      }
    }
  }
    
  return (
    <div 
    onDragStart={handleDragStart} 
    onMouseMove={(e) => movePiece(e)}
    onMouseDown={(e) => grabPiece(e)}
    onMouseUp={(e) => dropPiece(e)}
    className='board-component'>
      <Pocket />
      <div
        id='chessboard'
        ref={chessboardRef}>
        {boardElements}
      </div>
    </div>
  );
}

