import { Box, Input, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const GameContainer = styled(Box)(() => ({
	padding: '2em',
	background: 'black',
	height: '100vh',
	overflow: 'hidden',
}));

export const Title = styled(Typography)(() => ({
	fontSize: '2em',
	textAlign: 'center',
	color: 'white',
	background: 'black',
	lineHeight: '1em',
	position: 'relative',
}));

export const GridContainer = styled(Box)(() => ({
	margin: '1em auto',
	border: 'solid 1px black',
	maxHeight: '50%',
	background: 'black',
	aspectRatio: '.9',
}));

export const RowContainer = styled(Box)(() => ({
	display: 'flex',
	justifyContent: ' space-between',
}));

export const CellContainer = styled(Box)(({ status }) => ({
	margin: '2%',
	textAlign: 'center',
	border: 'solid 1px black',
	width: '75%',
	aspectRatio: '1',
	background:
		status === 'correct' ? 'green' : status === 'misplaced' ? 'gold' : status === 'wrong' ? 'gray' : 'lightgray',
	color: 'black',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-around',
}));

export const InfoContainer = styled(Box)(() => ({
	textAlign: 'center',
	margin: '1em',
}));

export const Keyboard = styled(Box)(() => ({
	maxWidth: '350px',
	margin: 'auto',
	div: {
		display: 'flex',
		justifyContent: 'space-evenly',
		height: '40px',
		marginBottom: '1em',
	},
}));

export const Key = styled(Input)(({ status }) => ({
	input: {
		minWidth: '15px',
		textAlign: 'center',
		padding: '5px',
		borderRadius: '5px',
		border: 'none',
		background:
			status === 'correct' ? 'green' : status === 'misplaced' ? 'gold' : status === 'wrong' ? 'gray' : 'white',
		color: 'black',
		cursor: 'pointer',
	},
}));
