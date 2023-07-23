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

const uciWorker = (file, actions) => {
    const worker = new Worker(file);

    let resolver = null;

    worker.addEventListener('message', e => {
        const move = e.data.match(/^bestmove\s([a-h][1-8])([a-h][1-8])/);
        if (move && resolver) {
        resolver({ from: move[1], to: move[2] });
        resolver = null;
        }
    });

    return fen =>
        new Promise((resolve, reject) => {
            if (resolver) {
                return;
            }

            resolver = resolve;
            worker.postMessage(`position fen ${fen}`);
            actions.forEach(action => worker.postMessage(action));
        });
};


export const Bot = uciWorker('lib/stockfish.js-10.0.2/stockfish.js', [
      'setoption name Skill Level value 1',
      'go depth 10',
    ]);


