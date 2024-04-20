import { useEffect, useState } from 'react';
import {
	GameContainer,
	Title,
	InfoContainer,
	CellContainer,
	GridContainer,
	RowContainer,
	Keyboard,
	Key,
} from './styles';

const initializeGrid = () => {
	const row = [null, null, null, null, null];
	return Array.from({ length: 6 }, () => [...row]);
};

const getCellId = (row, col) => `cell-${row}-${col}`;

const renderThen = (fn) => setTimeout(() => fn(), 100);

const initializeKeys = () => [
	[
		{ value: 'Q' },
		{ value: 'W' },
		{ value: 'E' },
		{ value: 'R' },
		{ value: 'T' },
		{ value: 'Y' },
		{ value: 'U' },
		{ value: 'I' },
		{ value: 'O' },
		{ value: 'P' },
	],
	[
		{ value: 'A' },
		{ value: 'S' },
		{ value: 'D' },
		{ value: 'F' },
		{ value: 'G' },
		{ value: 'H' },
		{ value: 'J' },
		{ value: 'K' },
		{ value: 'L' },
	],
	[
		{ value: 'ENTER' },
		{ value: 'Z' },
		{ value: 'X' },
		{ value: 'C' },
		{ value: 'V' },
		{ value: 'B' },
		{ value: 'N' },
		{ value: 'M' },
		{ value: 'DEL' },
	],
];

export function Wordle() {
	const [word, setWord] = useState('EVERY');
	const [keys, setKeys] = useState(initializeKeys());
	const [isGameOver, setIsGameOver] = useState(false);
	const [gridData, setGridData] = useState(initializeGrid());

	useEffect(() => {
		window.addEventListener('keyup', (e) => {
			handleInput(e.key.toUpperCase());
		});
	}, []);

	const handleNewGameClick = () => {
		setIsGameOver(false);
		setGridData(initializeGrid());
	};

	const isMisplaced = (rowIndex, index) => {
		const rowValues = gridData[rowIndex].map(({ value }) => value);
		const currentValue = rowValues[index];
		const alreadyMatchedCount = Array.from(rowValues).reduce((count, letter, letterIndex) => {
			if (letter === currentValue && letterIndex < index) {
				count = count + 1;
			}
			return count;
		}, 0);
		const validPositions = Array.from(word).reduce((positions, letter, letterIndex) => {
			if (letter === currentValue) {
				positions.push(letterIndex);
			}
			return positions;
		}, []);
		const allInstancesMatched = validPositions.every((position) => rowValues[position] === currentValue);
		return !allInstancesMatched && alreadyMatchedCount < validPositions.length;
	};

	const handleInput = (value) => {
		if (isGameOver) return;
		const activeRowIndex = gridData.findIndex((row) => !row[4] || row[4].status === 'pending');
		const firstAvailableColIndex = gridData[activeRowIndex].findIndex((cell) => !cell || !cell?.status);
		if (value === 'ENTER') {
			if (firstAvailableColIndex === -1) {
				let updatedKeys = keys;
				for (let i = 0; i < 5; i++) {
					setTimeout(() => {
						const { value } = gridData[activeRowIndex][i];
						const status = value === word[i] ? 'correct' : isMisplaced(activeRowIndex, i) ? 'misplaced' : 'wrong';
						gridData[activeRowIndex][i] = { value, status };
						setGridData([...gridData]);
						updatedKeys = updatedKeys.map((row) =>
							row.map((key) => ({ ...key, status: !key.status && key.value === value ? status : key.status }))
						);
						setKeys([...updatedKeys]);
						if (gridData[activeRowIndex].every(({ status }) => status === 'correct')) {
							setIsGameOver(true);
							renderThen(() => alert('Good work!'));
						} else if (activeRowIndex === 5) {
							setIsGameOver(true);
							renderThen(() => alert('Better luck next time...'));
						}
					}, (i + 1) * 500);
				}
			}
		} else if (value === 'DEL') {
			const lastFilledColIndex = firstAvailableColIndex > 0 ? firstAvailableColIndex - 1 : 4;
			gridData[activeRowIndex][lastFilledColIndex] = null;
			setGridData([...gridData]);
		} else {
			gridData[activeRowIndex][firstAvailableColIndex] = { value, status: 'pending' };
			setGridData([...gridData]);
		}
	};

	return (
		<GameContainer>
			<Title>Wordle</Title>

			<InfoContainer>{isGameOver && <button onClick={handleNewGameClick}>Start new game</button>}</InfoContainer>

			<GridContainer>
				{gridData.map((row, rowIndex) => (
					<RowContainer>
						{row.map((cell, colIndex) => (
							<CellContainer id={getCellId(rowIndex, colIndex)} status={cell?.status}>
								{cell?.value}
							</CellContainer>
						))}
					</RowContainer>
				))}
			</GridContainer>
			<Keyboard>
				{keys.map((row) => (
					<div>
						{row.map((key) => (
							<Key
								key={key.value}
								type='button'
								value={key.value}
								status={key.status}
								onClick={(e) => handleInput(e.target.value)}
							/>
						))}
					</div>
				))}
			</Keyboard>
		</GameContainer>
	);
}
