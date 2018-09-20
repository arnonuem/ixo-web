require('dotenv').config();
import { isoCountries } from '../lib/commonData';

export function formatJSONDate(jsonDateTimeString: string): string {
	return new Date(jsonDateTimeString).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
}

export function formatJSONTime(jsonDateTimeString: string): string {
	return new Date(jsonDateTimeString).toLocaleTimeString();
}

export function formatJSONDateTime(jsonDateTimeString: string): string {
	return new Date(jsonDateTimeString).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
}

export function capitalizeFirstLetter(theString: string) {
	return theString.charAt(0).toUpperCase() + theString.slice(1);
}

export function floorandRemoveDuplicateSDGs(projects: any[]) {
	return projects = projects.map((project, i) => {
		let tempProject = project;
		tempProject.data.sdgs = project.data.sdgs.map((sdg) => {
			return Number(String(sdg).split('.')[0]);
		});
		tempProject.data.sdgs = Array.from(new Set(tempProject.data.sdgs));
		return tempProject;
	});
}

export function SDGsCount(projects: any[]) {
	var sdgArray = new Array(17);
	for (let project of projects) {
		let tempProject = project;
		tempProject.data.sdgs = project.data.sdgs.map((sdg) => {
			return Number(String(sdg).split('.')[0]);
		});
		tempProject.data.sdgs = Array.from(new Set(tempProject.data.sdgs));
		for ( let o = 0; o < tempProject.data.sdgs.length; o++) {
			sdgArray[o]++;
		}
	}
	return sdgArray;

}

export function excerptText(theText: string, words: number = 20) {
	const cutOffCount = words;
	const wordCount = theText.split(' ').length - 1;

	if (wordCount > cutOffCount) {
		let count = 0;
		let theIndex = 0;

		for (let i = 0; i < theText.length - 1; i++) {
			if (count < cutOffCount) {
				if (theText[i] === ' ') {
					count++;
				}
			} else {
				theIndex = i;
				break;
			}
		}
		return theText.slice(0, theIndex - 1) + '...';
	} else {
		return theText;
	}
}

export function getCountryName (countryCode: string) {
	if (isoCountries.hasOwnProperty(countryCode)) {
		return isoCountries[countryCode];
	} else {
		return countryCode;
	}
}

export function getIxoWorldRoute(path: string) {
	let origin = process.env.REACT_APP_IXO_WORLD_ORIGIN || 'https://ixo.world';
	return origin + path;
}