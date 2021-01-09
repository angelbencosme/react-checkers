import React, {Component} from 'react';
import * as utils from '../utils/utils.js';

function Square({onClick, squareClasses}) {
    return (
        <button className={"square " + (squareClasses)} onClick={onClick}/>
    );
}

export default class BoardComponent extends Component {

    renderSquare(coordinates, squareClasses) {
        const {onClick} = this.props;
        return (
            <Square
                key={coordinates}
                squareClasses={squareClasses}
                onClick={() => onClick(coordinates)}
            />
        );
    }

    render() {
        const {moves, boardState, activePiece, columns, currentPlayer, color} = this.props;
        let boardRender = [];
        let columnsRender = [];
        for (let coordinates in boardState) {

            if (!boardState.hasOwnProperty(coordinates)) {
                continue;
            }

            const col = utils.getColAsInt(columns, coordinates);
            const row = utils.getRowAsInt(coordinates);

            const currentPlayerName = utils.returnPlayerName(currentPlayer);

            const colorClass = ((utils.isOdd(col) && utils.isOdd(row)) || (!utils.isOdd(col) && !(utils.isOdd(row)))) ? 'white' : 'black';

            let squareClasses = [];

            squareClasses.push(coordinates);
            squareClasses.push(colorClass);

            if (activePiece === coordinates) {
                squareClasses.push('isActive')
            }

            if (moves.indexOf(coordinates) > -1) {
                let coloration = '';
                if (currentPlayerName === 'user' && color === 'light') {
                    coloration = 'light';
                }

                if (currentPlayerName === 'user' && color === 'dark') {
                    coloration = 'dark';
                }

                if (currentPlayerName === 'machine' && color === 'light') {
                    coloration = 'dark';
                }

                if (currentPlayerName === 'machine' && color === 'dark') {
                    coloration = 'light';
                }

                let moveClass = `movable ${coloration}-move`;
                squareClasses.push(moveClass);
            }

            if (boardState[coordinates] !== null) {
                if (boardState[coordinates].player === 'user' && color === 'light') {
                    squareClasses.push('light piece');
                }

                if (boardState[coordinates].player === 'user' && color === 'dark') {
                    squareClasses.push('dark piece');
                }

                if (boardState[coordinates].player === 'machine' && color === 'light') {
                    squareClasses.push('dark piece');
                }

                if (boardState[coordinates].player === 'machine' && color === 'dark') {
                    squareClasses.push('light piece');
                }

                if (boardState[coordinates].isKing === true) {
                    squareClasses.push('king');
                }
            }

            squareClasses = squareClasses.join(' ');

            columnsRender.push(this.renderSquare(coordinates, squareClasses, boardState[coordinates]));

            if (columnsRender.length >= 8) {
                columnsRender = columnsRender.reverse();
                boardRender.push(<div key={boardRender.length} className="board-col">{columnsRender}</div>);
                columnsRender = [];
            }
        }

        return (boardRender);
    }
}
