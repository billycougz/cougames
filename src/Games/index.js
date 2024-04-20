import { useState } from 'react';
import { ConnectFour } from './ConnectFour';
import { Wordle } from './Wordle';
import { Checkers } from './Checkers';

const games = [
	{ name: 'Connect4', Component: ConnectFour },
	{ name: 'Wordle', Component: Wordle },
	{ name: 'Checkers', Component: Checkers },
];

export default function Games() {
	const [activeGame, setActiveGame] = useState(games[0]);
	return (
		<div>
			<div>
				{games.map((game) => (
					<button onClick={() => setActiveGame(game)}>{game.name}</button>
				))}
				<activeGame.Component />
			</div>
		</div>
	);
}
