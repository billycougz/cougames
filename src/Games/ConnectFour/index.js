import { useState } from 'react';
import { GameContainer, Title, InfoContainer, CellContainer, GridContainer, RowContainer } from './styles';
import checkForWinner from './checkForWinner';

const players = [
	{ index: 0, name: 'Red', color: 'red' },
	{ index: 1, name: 'Yellow', color: 'gold' },
];

const initializeGrid = () => {
	const row = [null, null, null, null, null, null, null];
	return Array.from({ length: 6 }, () => [...row]);
};

const getCellId = (row, col) => `cell-${row}-${col}`;

const renderThen = (fn) => setTimeout(() => fn(), 100);

export function ConnectFour() {
	const [activePlayer, setActivePlayer] = useState(players[0]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [gridData, setGridData] = useState(initializeGrid());

	const handleCellClick = (colIndex) => {
		if (isGameOver) return;
		const executeMove = (colIndex) => {
			for (const row of [...gridData].reverse()) {
				if (!row[colIndex]) {
					row[colIndex] = activePlayer;
					return gridData;
				}
			}
		};
		const updatedGridData = executeMove(colIndex);
		if (updatedGridData) {
			setGridData([...updatedGridData]);
			const winData = checkForWinner(gridData);
			if (winData) {
				renderThen(() => alert(`Game over. Congratulations ${winData.winner.name}!`));
				setIsGameOver(true);
			} else if (gridData.every((row) => row.every((cell) => cell))) {
				renderThen(() => alert(`Game over. There are no available moves.`));
				setIsGameOver(true);
			} else {
				setActivePlayer(activePlayer.index ? players[0] : players[1]);
			}
		}
	};

	const handleNewGameClick = () => {
		setIsGameOver(false);
		setGridData(initializeGrid());
	};

	return (
		<GameContainer>
			<Title>
				CONNECT<span>4</span>
			</Title>

			<InfoContainer>
				{isGameOver ? (
					<button onClick={handleNewGameClick}>Start new game</button>
				) : (
					<span>
						<strong>Now Playing:</strong>
						<CellContainer color={activePlayer.color} sample />
					</span>
				)}
			</InfoContainer>

			<GridContainer>
				{gridData.map((row, rowIndex) => (
					<RowContainer>
						{row.map((cell, colIndex) => (
							<CellContainer
								id={getCellId(rowIndex, colIndex)}
								color={cell?.color}
								onClick={() => handleCellClick(colIndex)}
							/>
						))}
					</RowContainer>
				))}
			</GridContainer>
		</GameContainer>
	);
}
