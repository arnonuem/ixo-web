import * as React from 'react';
import Select from './Select';

export interface ParentProps {
	text?: string;
	id: string;
	options?: any;
}

export interface Callbacks {
	onChange: (event: any) => void;
}

export interface Props extends ParentProps, Callbacks {

}

export default class TemplateSelect extends Select {

	generateSelect = () => {
		let selectOptions = [];

		// TODO: 
		// This should list all the templates for a type. The type ('project, claim; evaluation') 
		// should be passed in as a property

		// Push default as the only available template for now
		const templateList = {'default': 'default'};
		for (var code in templateList) {
			if (templateList.hasOwnProperty(code)) {
				selectOptions.push(<option key={code} value={code}>{templateList[code]}</option>);
			}
		}
		return selectOptions;

	}
}
