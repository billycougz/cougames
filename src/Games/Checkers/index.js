import { useState } from 'react';
import { GameContainer, Title, InfoContainer, CellContainer, GridContainer, RowContainer, GamePiece } from './styles';

const players = [
	{ index: 0, name: 'Red', color: 'red' },
	{ index: 1, name: 'Black', color: 'white' },
];

const initializeGrid = () => {
	const red = () => ({ ...players[0] });
	const black = () => ({ ...players[1] });
	return [
		[red(), null, red(), null, red(), null, red(), null],
		[null, red(), null, red(), null, red(), null, red()],
		[red(), null, red(), null, red(), null, red(), null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, black(), null, black(), null, black(), null, black()],
		[black(), null, black(), null, black(), null, black(), null],
		[null, black(), null, black(), null, black(), null, black()],
	];
};

const getCellId = (row, col) => `cell-${row}-${col}`;

const renderThen = (fn) => setTimeout(() => fn(), 100);

const isBlackSpace = (rowIndex, colIndex) => !Boolean((rowIndex + colIndex) % 2);

export function Checkers() {
	const [activePlayer, setActivePlayer] = useState(players[0]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [gridData, setGridData] = useState(initializeGrid());
	const [selectedPiece, setSelectedPiece] = useState(null);
	const [isJumpRequired, setIsJumpRequired] = useState(false);

	/**
	 * 1. If the clicked piece is the active player's piece, select it
	 *
	 * 2. Assuming a piece is selected:
	 * If backward, ensure king
	 * Ensure a player is not already on the space
	 * If jump, handle jump
	 * Else if jump required, alert jump required
	 * If single space, handle move
	 *
	 * 3. If edge row, make king
	 *
	 * 4. If opponent has no remaining pieces, declare winner
	 *
	 * Handle jump:
	 * Remove jumped piece
	 * Handle move
	 * If jump available, wait for jump then handle jump
	 *
	 * Handle move:
	 * Clear selected cell
	 * Set clicked cell
	 */
	const handleCellClick = (rowIndex, colIndex) => {
		const doSelect = gridData[rowIndex][colIndex]?.name === activePlayer.name;
		if (doSelect) {
			console.log(getAvailablePlays(gridData, activePlayer, { rowIndex, colIndex }));

			setSelectedPiece({ rowIndex, colIndex });
		} else if (selectedPiece) {
			if (!isValidDirection(rowIndex)) {
				return;
			}
			const jumpedPiece = getJumpedPosition(rowIndex, colIndex);
			const isJumpAvailable = hasAvailableJump(gridData);
			if (jumpedPiece) {
				handleMove(rowIndex, colIndex, jumpedPiece);
			} else if (isJumpAvailable && isJumpRequired) {
				return;
			} else if (isValidMove(rowIndex, colIndex)) {
				handleMove(rowIndex, colIndex);
			}
		}
	};

	const isValidDirection = (rowIndex, colIndex) => {
		const { isKing } = gridData[selectedPiece.rowIndex][selectedPiece.colIndex];
		if (isKing) {
			return true;
		}
		return activePlayer.index ? rowIndex < selectedPiece.rowIndex : rowIndex > selectedPiece.rowIndex;
	};

	const isValidMove = (rowIndex, colIndex) => {
		return (
			isBlackSpace(rowIndex, colIndex) &&
			Math.abs(rowIndex - selectedPiece.rowIndex) === 1 &&
			Math.abs(colIndex - selectedPiece.colIndex) === 1 &&
			!gridData[rowIndex][colIndex]
		);
	};

	const handleMove = (rowIndex, colIndex, jumpedPiece) => {
		gridData[rowIndex][colIndex] = gridData[selectedPiece.rowIndex][selectedPiece.colIndex];
		gridData[selectedPiece.rowIndex][selectedPiece.colIndex] = null;
		const kinged = rowIndex === 0 || rowIndex === 7;
		if (kinged) {
			gridData[rowIndex][colIndex].isKing = true;
		}
		if (jumpedPiece) {
			gridData[jumpedPiece.row][jumpedPiece.col] = null;
			const isJumpAvailable = false; // ToDo
			if (isJumpAvailable) {
				return;
			}
		}
		setGridData([...gridData]);
		setSelectedPiece(null);
		const winner = gridData.every((row) =>
			row.every((cell) => cell?.name !== players[activePlayer.index ? 0 : 1].name)
		);
		if (winner) {
			renderThen(() => alert('Winner!'));
		} else {
			const newActivePlayer = activePlayer.index ? players[0] : players[1];
			setActivePlayer(newActivePlayer);
		}
	};

	const getAvailablePlays = (grid, activePlayer, selectedPiece, doubleJump) => {
		let hasJump = false;
		const movesAndJumps = grid.map((row, rowIndex) =>
			row.map((cell, colIndex) => {
				if (cell && cell.color === activePlayer.color) {
					const moves = [];
					const jumps = [];
					const isKing =
						cell.isKing || (cell.color === 'red' && rowIndex === 0) || (cell.color === 'white' && rowIndex === 7);

					// Check available moves
					const directions = isKing ? [-1, 1] : activePlayer.color === 'red' ? [1] : [-1];
					directions.forEach((dir) => {
						const newRow = rowIndex + dir;
						const leftCol = colIndex - 1;
						const rightCol = colIndex + 1;

						// Check diagonal moves
						if (newRow >= 0 && newRow < grid.length) {
							if (leftCol >= 0 && !grid[newRow][leftCol]) {
								moves.push({ row: newRow, col: leftCol });
							}
							if (rightCol < grid[newRow].length && !grid[newRow][rightCol]) {
								moves.push({ row: newRow, col: rightCol });
							}
						}
					});

					// Check available jumps
					directions.forEach((dir) => {
						const enemyRow = rowIndex + 2 * dir;
						const leftEnemyCol = colIndex - 2;
						const rightEnemyCol = colIndex + 2;

						if (enemyRow >= 0 && enemyRow < grid.length) {
							if (
								leftEnemyCol >= 0 &&
								grid[rowIndex + dir][colIndex - 1] &&
								grid[rowIndex + dir][colIndex - 1].color !== activePlayer.color &&
								!grid[enemyRow][leftEnemyCol]
							) {
								hasJump = true;
								jumps.push({ row: enemyRow, col: leftEnemyCol });
							}
							if (
								rightEnemyCol < grid[enemyRow].length &&
								grid[rowIndex + dir][colIndex + 1] &&
								grid[rowIndex + dir][colIndex + 1].color !== activePlayer.color &&
								!grid[enemyRow][rightEnemyCol]
							) {
								hasJump = true;
								jumps.push({ row: enemyRow, col: rightEnemyCol });
							}
						}
					});

					return { moves, jumps };
				}
				return null;
			})
		);

		const availablePlays = movesAndJumps.map((row) =>
			row.map((cell) => (!cell ? cell : hasJump ? cell.jumps : cell.moves))
		);

		if (selectedPiece) {
			const { rowIndex, colIndex } = selectedPiece;
			return availablePlays[rowIndex][colIndex][hasJump || doubleJump ? 'jumps' : 'moves'];
		}

		return availablePlays;
	};

	const hasAvailableJump = (gridData) => {
		// Iterate through each cell in the grid
		for (let rowIndex = 0; rowIndex < gridData.length; rowIndex++) {
			for (let colIndex = 0; colIndex < gridData[rowIndex].length; colIndex++) {
				// Check if the cell contains a piece belonging to the active player
				const cell = gridData[rowIndex][colIndex];
				if (cell && cell.name === activePlayer.name) {
					// Check potential jumps
					for (let i = -2; i <= 2; i += 4) {
						for (let j = -2; j <= 2; j += 4) {
							const jumpedRow = rowIndex + i;
							const jumpedCol = colIndex + j;
							const betweenRow = rowIndex + i / 2;
							const betweenCol = colIndex + j / 2;
							if (
								jumpedRow >= 0 &&
								jumpedRow < gridData.length &&
								jumpedCol >= 0 &&
								jumpedCol < gridData[jumpedRow].length &&
								Math.abs(i) === 2 &&
								Math.abs(j) === 2 &&
								!gridData[jumpedRow][jumpedCol] &&
								betweenRow >= 0 &&
								betweenRow < gridData.length &&
								betweenCol >= 0 &&
								betweenCol < gridData[betweenRow].length &&
								gridData[betweenRow][betweenCol] &&
								gridData[betweenRow][betweenCol].name !== activePlayer.name
							) {
								// Found an available jump
								return true;
							}
						}
					}
				}
			}
		}
		// No available jumps found
		return false;
	};

	const handleNewGameClick = () => {
		setIsGameOver(false);
		setGridData(initializeGrid());
	};

	const getJumpedPosition = (rowIndex, colIndex) => {
		const rowDiff = rowIndex - selectedPiece.rowIndex;
		const colDiff = colIndex - selectedPiece.colIndex;
		const isSpaceAvailable = !gridData[rowIndex][colIndex];
		const isAbsTwo = (diff) => Math.abs(diff) === 2;
		const getJumpedPosition = (index, diff) => index + (diff < 0 ? 1 : -1);
		const rowJumped = getJumpedPosition(rowIndex, rowDiff);
		const colJumped = getJumpedPosition(colIndex, colDiff);
		const isJump = gridData[rowJumped][colJumped]?.name === players[activePlayer.index ? 0 : 1].name;
		return isJump && isAbsTwo(rowDiff) && isAbsTwo(colDiff) && isSpaceAvailable
			? { row: rowJumped, col: colJumped }
			: null;
	};

	return (
		<GameContainer>
			<Title>Checkers</Title>

			<InfoContainer>
				{isGameOver ? (
					<button onClick={handleNewGameClick}>Start new game</button>
				) : (
					<span>
						<strong>Now Playing:</strong>
						<GamePiece color={activePlayer.color} sample />
					</span>
				)}
			</InfoContainer>

			<GridContainer>
				{gridData.map((row, rowIndex) => (
					<RowContainer>
						{row.map((gamePiece, colIndex) => (
							<CellContainer
								id={getCellId(rowIndex, colIndex)}
								rowIndex={rowIndex}
								colIndex={colIndex}
								onClick={() => handleCellClick(rowIndex, colIndex)}
							>
								{gamePiece && <GamePiece color={gamePiece?.color} isKing={gamePiece?.isKing} />}
							</CellContainer>
						))}
					</RowContainer>
				))}
			</GridContainer>
		</GameContainer>
	);
}
