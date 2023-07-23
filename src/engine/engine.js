import { Chess } from "chess.js";

export const RandomBot = (fen) => {
    return new Promise(resolve => {
        const moves = new Chess(fen).moves({ verbose: true });
        if (moves.length === 0)
            resolve();
        const { from, to } = moves[Math.floor(Math.random() * moves.length)];
        setTimeout(() => resolve({ from, to }), 500);
      });
}