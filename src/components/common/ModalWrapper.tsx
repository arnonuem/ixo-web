import * as React from 'react';
import * as Modal from 'react-modal';
import styled from 'styled-components';

const modalStyles = {
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		zIndex : '100'
	},
	content: {
		top        : '50%',
		left       : '50%',
		right      : 'auto',
		bottom     : 'auto',
		marginRight: '-50%',
		transform  : 'translate(-50%, -50%)',
		border : '1px solid #0C3550',
		overflow: 'scroll',
		maxHeight: '90vh',
		padding: '0',
		borderRadius: '2px'
	}
};

const ModalInner = styled.div`
	background: linear-gradient(0deg, #F1F0F0 0%, #D6D6D6 100%);
	color: white;
	padding: 10px 30px;
`;

const CloseModal = styled.button`
	color: #282828;
	background: none;
	border: 0;
	top: 0px;
	right: 5px;
	font-size: 40px;
	line-height: 1;
	cursor: pointer;
	font-weight: 100;
	position: absolute;
`;

const FlexContainer = styled.div`
	display: flex;
	padding: 10px 30px 0 0;
	
	i {
		margin-right: 10px;
		font-size: 50px;
	}

	img {
		width: 40px;
		margin-right: 20px;
	}
	
	h3 {
		font-weight: 300;
		font-size: 24px;
		line-height: 1;
		text-transform: uppercase;
		margin: 0;
		font-family: ${props => props.theme.fontRobotoCondensed};
	}

	p {
		font-weight: 300;
		margin: 0;
		font-size: 18px;
		color: ${props => props.theme.fontLightBlue};
		font-family: ${props => props.theme.fontRoboto};
	}
`;

const Line = styled.div`
	background: ${props => props.theme.widgetBorder};
    width: calc(100% + 60px);
    margin: 10px -30px 25px;
	height: 1px;
`;

interface ParentProps {
	isModalOpen: boolean;
	header?: Header;
}

export interface Header {
	title: string;
	subtitle?: string;
	icon?: string;
	image?: string;
	width?: string;
}
interface Callbacks {
	handleToggleModal?: (theStatus: boolean) => void;
}
export interface Props extends ParentProps, Callbacks {}

export const ModalWrapper: React.SFC<Props> = (props) => {

	const renderHeader = () => {
		return (
			<React.Fragment>
				<FlexContainer style={props.header.width && {width: `${props.header.width}px`}}>
				<div>
					{props.header.icon && <i className={`${props.header.icon}`} />}
					{props.header.image && <img src={props.header.image} />}
				</div>
					<div>
						<h3>{props.header.title}</h3>
						{props.header.subtitle && <p>{props.header.subtitle}</p>}
					</div>
				</FlexContainer>
				<Line />
			</React.Fragment>
		);
	};

	return (
		<Modal
			style={modalStyles}
			isOpen={props.isModalOpen}
			onRequestClose={() => props.handleToggleModal(false)}
			contentLabel="Modal"
			ariaHideApp={false}
			// closeTimeoutMS={300}
		>
			<ModalInner>
					<CloseModal onClick={() => props.handleToggleModal(false)}>&times;</CloseModal>
					{props.header && renderHeader()}
					<div>{props.children}</div>
			</ModalInner>
		</Modal>
	);
};