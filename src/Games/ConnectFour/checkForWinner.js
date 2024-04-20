export default function checkForWinner(gridData) {
	const winFunctions = [checkForRowWinner, checkForColWinner, checkForBackslashWinner, checkForSlashWinner];
	for (const winFunction of winFunctions) {
		const winData = winFunction(gridData);
		if (winData) {
			return winData;
		}
	}
}

function checkForRowWinner(gridData) {
	let consecutiveCells = [];
	let previousCell;
	for (const row of gridData) {
		for (const cell of row) {
			if (cell && cell?.name === previousCell?.name) {
				consecutiveCells.push(cell);
			} else {
				consecutiveCells = [cell];
			}
			if (consecutiveCells.length === 4) {
				return { winningCells: consecutiveCells, winner: previousCell };
			}
			previousCell = cell;
		}
	}
}

function checkForColWinner(gridData) {
	for (let colIndex = 0; colIndex <= 6; colIndex++) {
		let consecutiveCells = [];
		let previousCell;
		for (const row of gridData) {
			const cell = row[colIndex];
			if (cell && cell?.name === previousCell?.name) {
				consecutiveCells.push(cell);
			} else {
				consecutiveCells = [cell];
			}
			if (consecutiveCells.length === 4) {
				return { winningCells: consecutiveCells, winner: previousCell };
			}
			previousCell = cell;
		}
	}
}

function checkForBackslashWinner(gridData) {
	const maxRow = gridData.length - 1;
	const maxCol = gridData[0].length - 1;
	let currentRow = 0;
	let currentCol = 0;
	while (true) {
		const currentCell = gridData[currentRow][currentCol];
		if (currentCell && currentRow + 3 <= maxRow && currentCol + 3 <= maxCol) {
			const consecutiveCells = [
				currentCell,
				gridData[currentRow + 1][currentCol + 1],
				gridData[currentRow + 2][currentCol + 2],
				gridData[currentRow + 3][currentCol + 3],
			];
			if (consecutiveCells.every((cell) => cell?.name === currentCell.name)) {
				return { winningCells: consecutiveCells, winner: currentCell };
			}
		}
		if (currentCol < maxCol) {
			currentCol = currentCol + 1;
		} else if (currentRow < maxRow) {
			currentRow = currentRow + 1;
			currentCol = 0;
		} else {
			break;
		}
	}
}

function checkForSlashWinner(gridData) {
	const rowMax = gridData.length - 1;
	const colMax = gridData[0].length - 1;
	let currentRow = rowMax;
	let currentCol = colMax;
	while (true) {
		const currentCell = gridData[currentRow][currentCol];
		if (currentCell && currentRow - 3 >= 0 && currentCol + 3 <= colMax) {
			const consecutiveCells = [
				currentCell,
				gridData[currentRow - 1][currentCol + 1],
				gridData[currentRow - 2][currentCol + 2],
				gridData[currentRow - 3][currentCol + 3],
			];
			if (consecutiveCells.every((cell) => cell?.name === currentCell.name)) {
				return { winningCells: consecutiveCells, winner: currentCell };
			}
		}
		if (currentCol > 0) {
			currentCol = currentCol - 1;
		} else if (currentRow > 0) {
			currentRow = currentRow - 1;
			currentCol = colMax;
		} else {
			break;
		}
	}
}
