import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const GameContainer = styled(Box)(() => ({
	margin: '2em',
}));

export const Title = styled(Typography)(() => ({
	fontSize: '2em',
	textAlign: 'center',
	color: 'white',
	background: 'black',
	lineHeight: '1em',
	border: '2px solid white',
	borderRadius: '1em',
	padding: '5px 1em .6em 1em',
	position: 'relative',
	top: '-10px',
	span: {
		color: 'red',
		fontSize: '3em',
		position: 'relative',
		top: '1.2rem',
		textShadow: `
        1px -1px 0 white,  
         1px -1px 0 white,
        -1px  1px 0 white,
         1px  1px 0 white;
        `,
	},
}));

export const GridContainer = styled(Box)(() => ({
	margin: '1em auto',
	aspectRatio: '1.25',
	maxHeight: 'calc(100vh - 250px)',
}));

export const RowContainer = styled(Box)(() => ({
	display: 'flex',
	justifyContent: ' space-between',
}));

export const CellContainer = styled(Box)(({ rowIndex, colIndex }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	textAlign: 'center',
	width: '75%',
	aspectRatio: '1',
	background: (rowIndex + colIndex) % 2 ? 'red' : 'black',
	'&:hover': {
		cursor: 'pointer',
	},
}));

export const GamePiece = styled(Box)(({ color, sample, isKing }) => ({
	position: 'relative',
	border: 'solid 1px black',
	borderRadius: '100%',
	width: sample ? '25px !important' : '75%',
	aspectRatio: '1',
	background: color,
	height: sample ? '25px !important' : '',
	'&:hover': {
		cursor: sample ? '' : 'pointer',
	},
	'&::before': {
		content: isKing ? '"♔"' : "''",
		position: 'absolute',
		top: '45%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		fontSize: '40px',
		color: 'black',
	},
}));

export const InfoContainer = styled(Box)(() => ({
	textAlign: 'center',
	'.MuiBox-root': {
		display: 'inline-block',
		margin: '0 0 0 10px',
		top: '10px',
		position: 'relative',
	},
}));
