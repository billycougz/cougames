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
	border: 'solid 1px black',
	aspectRatio: '1.25',
	maxHeight: 'calc(100vh - 250px)',
	background: 'mediumblue',
}));

export const RowContainer = styled(Box)(() => ({
	display: 'flex',
	justifyContent: ' space-between',
}));

export const CellContainer = styled(Box)(({ color, sample }) => ({
	margin: '2%',
	textAlign: 'center',
	border: 'solid 1px black',
	borderRadius: '100%',
	width: sample ? '25px !important' : '75%',
	aspectRatio: '1',
	background: color || 'lightgray',
	height: sample ? '25px !important' : '',
	'&:hover': {
		cursor: sample ? '' : 'pointer',
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
