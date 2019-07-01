import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	const style = {
		backgroundColor: props.isWinningCell ? 'green' : 'inherit'
	};
	return (
		<button className="square" onClick={props.onClick} style={style}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		const winning = this.props.winningCells ? ~this.props.winningCells.indexOf(i) : false;
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				isWinningCell={winning}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			xIsNext: true,
			stepNumber: 0
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares)[0] || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: [...history, {squares: squares}],
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = history.map((step, move) => (
			<li key={move}>
				<Board
					squares={history[move].squares}
					winningCells={null}
					onClick={() => this.jumpTo(move)}
				/>
			</li>
		));

		let status;
		if (winner[0])
			status = `winner is ${winner[0]}!`;
		else
			status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						winningCells={winner[1]}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<div>Current turn: <strong>{this.state.stepNumber}</strong></div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (var i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], lines[i]];
		}
	}
	return [(!~squares.indexOf(null)) ? ' 👎 NO ONE! BOOOOO' : null, null];
}