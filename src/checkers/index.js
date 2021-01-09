import React, {Component} from 'react';
import {returnPlayerName} from './utils/utils.js';
import {Checkers} from './utils/Checkers.js';
import BoardComponent from './Component/BoardComponent.js';
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history';
import {MachineComponent} from './Component/MachineComponent.js';
import './assets/css/index.css';

const browserHistory = createBrowserHistory();

export default class Index extends Component {

    constructor(props) {
        super(props);

        this.columns = this.setColumns();

        this.User = new Checkers(this.columns);
        this.Machine = new MachineComponent(this.columns);

        this.state = {
            players: 1,
            history: [{
                boardState: this.createBoard(),
                currentPlayer: props.color === 'dark',
            }],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null
        }
    }

    componentDidMount() {
        const {color} = this.props;
        console.log(color, 'color indexc')
        if (color !== 'dark') {
            this.computerTurn();
        }
    }

    setColumns() {
        const columns = {};
        columns.a = 0;
        columns.b = 1;
        columns.c = 2;
        columns.d = 3;
        columns.e = 4;
        columns.f = 5;
        columns.g = 6;
        columns.h = 7;

        return columns;
    }

    createBoard() {

        let board = {};

        for (let key in this.columns) {

            if (this.columns.hasOwnProperty(key)) {
                for (let n = 1; n <= 8; ++n) {

                    let row = key + n;
                    board[row] = null;
                }
            }
        }

        board = this.initPlayers(board);

        return board;
    }

    initPlayers(board) {
        const user = ['a8', 'c8', 'e8', 'g8', 'b7', 'd7', 'f7', 'h7', 'a6', 'c6', 'e6', 'g6'];
        const machine = ['b3', 'd3', 'f3', 'h3', 'a2', 'c2', 'e2', 'g2', 'b1', 'd1', 'f1', 'h1'];
        let self = this;
        user.forEach(function (i) {
            board[i] = self.createPiece(i, 'user');
        });
        machine.forEach(function (i) {
            board[i] = self.createPiece(i, 'machine');
        });
        return board;
    }

    createPiece(location, player) {
        let piece = {};
        piece.player = player;
        piece.location = location;
        piece.isKing = false;
        return piece;
    }

    getCurrentState() {
        const {history, stepNumber} = this.state;
        const currentHistory = history.slice(0, stepNumber + 1);
        return currentHistory[currentHistory.length - 1];
    }

    handleClick(coordinates) {
        const {winner, activePiece, hasJumped, moves} = this.state;

        if (winner !== null) {
            return;
        }

        const currentState = this.getCurrentState();
        const boardState = currentState.boardState;
        const clickedSquare = boardState[coordinates];

        // Clicked on a piece
        if (clickedSquare !== null) {

            // Can't select machine pieces
            if (clickedSquare.player !== returnPlayerName(currentState.currentPlayer)) {
                return;
            }

            // Unset active piece if it's clicked
            if (activePiece === coordinates && hasJumped === null) {
                this.setState({
                    activePiece: null,
                    moves: [],
                    jumpKills: null,
                });
                return;
            }

            // Can't choose a new piece if player has already jumped.
            if (hasJumped !== null && boardState[coordinates] !== null) {
                return;
            }

            // Set active piece
            let movesData = this.User.getMoves(boardState, coordinates, clickedSquare.isKing, false);

            this.setState({
                activePiece: coordinates,
                moves: movesData[0],
                jumpKills: movesData[1],
            });

            return;
        }

        // Clicked on an empty square
        if (activePiece === null) {
            return;
        }

        // Moving a piece
        if (moves.length > 0) {
            const postMoveState = this.User.movePiece(coordinates, this.state);

            if (postMoveState === null) {
                return;
            }

            this.updateStatePostMove(postMoveState);

            // Start computer move is the player is finished
            if (postMoveState.currentPlayer === false && postMoveState.winner === null) {
                this.computerTurn();
            }
        }
    }

    computerTurn(piece = null) {
        if (this.state.players > 1) {
            return;
        }

        setTimeout(() => {
                const currentState = this.getCurrentState();
                const boardState = currentState.boardState;

                let computerMove;
                let coordinates;
                let moveTo;

                // If var piece != null, the piece has previously jumped.
                if (piece === null) {
                    //computerMove = this.MachineComponent.getRandomMove(boardState, 'player2');
                    computerMove = this.Machine.getSmartMove(this.state, boardState, 'machine');

                    coordinates = computerMove.piece;
                    moveTo = computerMove.moveTo;
                } else {
                    // Prevent the computer player from choosing another piece to move. It must move the active piece
                    computerMove = this.User.getMoves(boardState, piece, boardState[piece].isKing, true);
                    coordinates = piece;
                    moveTo = computerMove[0][Math.floor(Math.random() * computerMove[0].length)];
                }

                const clickedSquare = boardState[coordinates];

                let movesData = this.User.getMoves(boardState, coordinates, clickedSquare.isKing, false);

                this.setState({
                    activePiece: coordinates,
                    moves: movesData[0],
                    jumpKills: movesData[1],
                });

                setTimeout(() => {
                        const postMoveState = this.User.movePiece(moveTo, this.state);

                        if (postMoveState === null) {
                            return;
                        }

                        this.updateStatePostMove(postMoveState);

                        // If the computer player has jumped and is still moving, continue jump with active piece
                        if (postMoveState.currentPlayer === false) {
                            this.computerTurn(postMoveState.activePiece);
                        }
                    },
                    500);
            },
            1000);
    }

    updateStatePostMove(postMoveState) {
        const {history} = this.state;
        this.setState({
            history: history.concat([{
                boardState: postMoveState.boardState,
                currentPlayer: postMoveState.currentPlayer,
            }]),
            activePiece: postMoveState.activePiece,
            moves: postMoveState.moves,
            jumpKills: postMoveState.jumpKills,
            hasJumped: postMoveState.hasJumped,
            stepNumber: history.length,
            winner: postMoveState.winner,
        });
    }

    undo() {
        const {stepNumber, history} = this.state;
        const backStep = parseInt(stepNumber, 10) - 1;
        if (backStep < 0) {
            return;
        }
        const unsetHistory = history.slice(0, backStep + 1);
        this.setState({
            history: unsetHistory,
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: backStep,
            winner: null,
        });
    }

    render() {
        const {name, color} = this.props;
        const {winner, moves, stepNumber, history, activePiece} = this.state;
        const columns = this.columns;
        const currentState = history[stepNumber];
        const boardState = currentState.boardState;
        const currentPlayer = currentState.currentPlayer;

        let gameStatus;

        let undoClass = 'undo';

        if (stepNumber < 1) {
            undoClass += ' disabled';
        }

        switch (winner) {
            case 'userPieces':
                gameStatus = `${name} Wins!`;
                break;
            case 'machinePieces':
                gameStatus = 'Machine Wins!';
                break;
            case 'userMoves':
                gameStatus = `No moves left - ${name} Wins!`;
                break;
            case 'machineMoves':
                gameStatus = 'No moves left - Machine Wins!';
                break;
            default:
                gameStatus = currentState.currentPlayer === true ? `It\'s ${name} turn ` : 'It\'s Machine turn';
                break;
        }
        console.log(color, 'render')

        return (
            <Router history={browserHistory} basename={'react-checkers'}>
                <div className="reactCheckers">
                    <div className="game-status">
                        {gameStatus}
                    </div>
                    <div className="game-board">
                        <BoardComponent
                            boardState={boardState}
                            currentPlayer={currentPlayer}
                            activePiece={activePiece}
                            moves={moves}
                            columns={columns}
                            onClick={(coordinates) => this.handleClick(coordinates)}
                            name={name}
                            color={color}
                        />
                    </div>
                    <div className="time-travel">
                        <button className={undoClass} onClick={() => this.undo()}>Undo</button>
                    </div>
                </div>
            </Router>
        );
    }
}
