import { Chess } from 'chess.js';
import tcn from '@savi2w/chess-tcn';

const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const SQUARE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?';
const DROP_CHARACTERS = {
    '=': 'p',
    '-': 'n',
    '+': 'b',
    '*': 'r',
    '&': 'q',
}
const TOWARD_A_FILE = -1;
const STRAIGHT = 0;
const TOWARD_H_FILE = 1;
const PROMOTION_CHARACTERS = {
    '~': { to: 'q', direction: STRAIGHT },
    '}': { to: 'q', direction: TOWARD_H_FILE },
    '{': { to: 'q', direction: TOWARD_A_FILE },
    '^': { to: 'n', direction: STRAIGHT },
    ')': { to: 'n', direction: TOWARD_H_FILE },
    '(': { to: 'n', direction: TOWARD_A_FILE },
    '#': { to: 'b', direction: STRAIGHT },
    '$': { to: 'b', direction: TOWARD_H_FILE },
    '@': { to: 'b', direction: TOWARD_A_FILE },
    '_': { to: 'r', direction: STRAIGHT },
    ']': { to: 'r', direction: TOWARD_H_FILE },
    '[': { to: 'r', direction: TOWARD_A_FILE },
};

function squareCharacterToAlgebraicSquare(squareCharacter) {
    const index = SQUARE_CHARACTERS.indexOf(squareCharacter);
    const file = 'abcdefgh'.charAt(index % 8);
    const rank = Math.floor(index / 8) + 1;
    return `${file}${rank}`;
}

function encode(algebraicMove) {
    var move = null; 
    const from = algebraicMove.slice(0, 2);
    const to = algebraicMove.slice(2, 4);
    if (algebraicMove[1] === '@') {
        const to = algebraicMove.slice(2, 4);
        const piece = algebraicMove.charAt(0).toLowerCase();
        move = {'to': to, 'drop': piece}; 
    }
    else  {
        move = {'to': to, 'from': from}; 
        if (algebraicMove.length === 5 && algebraicMove[4] !== '\n') 
            move['promotion'] = algebraicMove.charAt(4).toLowerCase();
    }
    return tcn.encode(move);
}

function applyMove(board, move) {
    const [firstChar, secondChar] = move;
    const isDrop = firstChar in DROP_CHARACTERS;
    const isPromotion = secondChar in PROMOTION_CHARACTERS;
    if (isDrop) {
        board.put({ type: DROP_CHARACTERS[firstChar], color: board.turn() }, squareCharacterToAlgebraicSquare(secondChar));
        let [
        piecePlacement, sideToMove,
        castling, enPassantTarget, halfmoveClock, fullmoveNumber,] = board.fen().split(' ');
        sideToMove = sideToMove === 'w' ? 'b' : 'w';
        enPassantTarget = '-';
        halfmoveClock = (parseInt(halfmoveClock) + 1).toString();
        if (sideToMove === 'w') 
            fullmoveNumber = (parseInt(fullmoveNumber) + 1).toString();
        const fenWithSideToMoveSwapped = [
            piecePlacement,
            sideToMove,
            castling,
            enPassantTarget,
            halfmoveClock,
            fullmoveNumber,
        ].join(' ');
        board.load(fenWithSideToMoveSwapped);
    }
    else if (isPromotion) {
        const from = squareCharacterToAlgebraicSquare(firstChar);
        const fromFile = from.charAt(0);
        const fromRank = from.charAt(1);
        const { to: promotion, direction } = PROMOTION_CHARACTERS[secondChar];
        const toFile = 'abcdefgh'['abcdefgh'.indexOf(fromFile) + direction];
        const toRank = fromRank === '7' ? '8' : '1';
        board.move({ from, to: `${toFile}${toRank}`, promotion });
    }
    else {
        const from = squareCharacterToAlgebraicSquare(firstChar);
        const to = squareCharacterToAlgebraicSquare(secondChar);
        board.move(`${from}${to}`, {sloppy: true});
    }
}

export default class BughouseBoard {
    constructor() {
        this.board = [new Chess(), new Chess()];
        this.fen = [startingFen, startingFen]; 
        this.times = [[1800, 1800], [1800, 1800]];
        this.whitehand = ''; 
        this.blackhand = ''; 
    }

    setWhitehand(hand) {
        this.whitehand = hand; 
    }

    setBlackhand(hand) {
        this.blackhand = hand; 
    }

    isLegal(boardNum, move) { 
        if (move.length < 4) 
            return false; 
        
        if (move[1] === '@') {
            if (this.board[boardNum].turn() === 'w') 
                if (!this.whitehand.includes(move[0])) 
                    return false; 
            else if (!this.blackhand.includes(move[0])) 
                return false; 
            
            const to = move.substring(2, 4); 
            if (this.board[boardNum].get(to) !== false) 
                return false; 

            this.board[boardNum].put({ type: move[0], color: this.board[boardNum].turn() }, to);
            const inCheck = this.board[boardNum].inCheck();
            this.board[boardNum].remove(to);
            return !inCheck; 
        }
        else {
            const from = move.substring(0, 2);
            const to = move.substring(2, 4); 
            const moves = this.board[boardNum].moves({ square: from, verbose: true });
            for (const i in moves) 
                if (moves[i].to === to) 
                    return true; 
        }
        return false; 
    }

    doMove(boardNum, move) {
        applyMove(this.board[boardNum], encode(move));
    }
}


