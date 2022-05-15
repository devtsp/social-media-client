import React from 'react';
import { Popup } from 'semantic-ui-react';

const ButtonPopup = ({ content, children }) => {
	return <Popup inverted content={content} trigger={children} />;
};

export default ButtonPopup;
