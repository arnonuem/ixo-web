// require('dotenv').config();
import * as React from 'react';
import { ImageLoader, imageQuality } from '../common/ImageLoader';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { countryLatLng } from '../../lib/commonData';
import { Button, ButtonTypes } from '../common/Buttons';
import { successToast, errorToast } from '../helpers/Toast';
import { ErrorTypes } from '../../types/models';

const Text = styled.input`
	margin: 20px 0;
	display: block;
	width: 100%;
`;

const TextArea = styled.textarea`
	margin: 20px 0;
	display: block;
	width: 100%;
	height: 150px;
`;

const SmallTextArea = TextArea.extend`
	height: 50px;
`;
const BigTextArea = TextArea.extend`
	height: 150px;
`;

const Container = styled.div`
	button {
		margin: 0 10px 10px 10px;
	}
`;
export interface StateProps {
	ixo: any;
	keysafe?: any;
}

export interface State {
	croppedImg: any;
	imageKey: string;
	claimSchema: string;
	claimSchemaKey: string;
	claimForm: string;
	claimFormKey: string;
	projectJson: string;
	project: Object;

	fetchedImage: string;
	fetchedFile: string;
}	

let defaultProject = {
	title: '',
	ownerName: '',
	ownerEmail: '',
	shortDescription: '',
	longDescription: '',
	impactAction: '',
	projectLocation: '',
	requiredClaims: 0,
	autoApprove: ['SA'],
	sdgs: [],
	templates: {
		claim: {
			schema: '',
			form: ''
		}
	},
	evaluatorPayPerClaim: '0',
	socialMedia: {
		facebookLink: '',
		instagramLink: '',
		twitterLink: '',
		webLink: ''
	},
	serviceEndpoint: process.env.REACT_APP_DEFAULT_PDS,
	imageLink: '',
	founder: {
		name: '',
		email: '',
		countryOfOrigin: '',
		shortDescription: '',
		websiteURL: '',
		logoLink: ''
	}
};

export class ProjectCreate extends React.Component<StateProps, State> {

	state = {
			croppedImg: null,
			imageKey: null,
			claimSchema: '',
			claimSchemaKey: null,
			claimForm: '',
			claimFormKey: null,
			projectJson: JSON.stringify(defaultProject),
			project: defaultProject,
			fetchedImage: null,
			fetchedFile: '',
			};

	handleCreateProject = () => {
		console.log(this.state.project);
		if (this.props.keysafe === null) {
		errorToast('Please install IXO Credential Manager first.');
		} else {
			if (this.state.croppedImg && this.state.claimSchema.length > 0 && this.state.claimForm.length > 0) {
				let promises = [];
				promises.push(
					this.props.ixo.project.createPublic(this.state.croppedImg, this.state.project.serviceEndpoint).then((res: any) => {
						successToast('Uploaded image successfully');
						let newProject = this.state.project;
						newProject.imageLink = res.result;
						this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
						return res.result;
					})
				);
				Promise.all(promises).then((results) => {
					let projectObj: string = this.state.projectJson;
					this.props.keysafe.requestSigning(projectObj, (error: any, signature: any) => {
						
						this.props.ixo.project.createProject(JSON.parse(projectObj), signature, this.state.project.serviceEndpoint).then((res: any) => {
							if (res.error) {
								errorToast(res.error.message, ErrorTypes.message);
							} else {
								successToast('Venture submitted successfully');
							}
						});
					});
				});
			}
		}
	}

	handlePdsUrlChange = (event: any) => {
		let newProject = this.state.project;
		newProject.serviceEndpoint = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleProjectChange = (event: any) => {
		this.setState({project: JSON.parse(event.target.value), projectJson: event.target.value});
	}

	handleImage = (base64Image) => {
		this.setState({croppedImg: base64Image });
	}
	
	uploadImage = (event) => {
		console.log(this.state.croppedImg);
		this.props.ixo.project.createPublic(this.state.croppedImg, this.state.project.serviceEndpoint).then((res: any) => {
			console.log('Uploaded: ', res);
			let newProject = this.state.project;
			newProject.imageLink = res.result;
			this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
		});
	}

	fetchImage = (event) => {
		this.props.ixo.project.fetchPublic(this.state.project.imageLink, this.state.project.serviceEndpoint).then((res: any) => {
			console.log('Fetched: ', res);
			let imageSrc = 'data:' + res.contentType + ';base64,' + res.data;
			this.setState({fetchedImage: imageSrc});
		});
	}

	handleFileSelected = (type, base64File) => {
		if (type === 'schema') {
			this.setState({claimSchema: base64File });
		}
		if (type === 'form') {
			this.setState({claimForm: base64File });
		}
	}
	
	uploadFile = (type) => {
		let fileToUpload: string;
		if (type === 'schema') {
			fileToUpload = this.state.claimSchema;
		}
		if (type === 'form') {
			fileToUpload = this.state.claimForm;
		}

		this.props.ixo.project.createPublic(fileToUpload, this.state.project.serviceEndpoint).then((res: any) => {
			console.log('Uploaded: ', res);
			let newProject = this.state.project;
			if (type === 'schema') {
				newProject.templates.claim.schema = res.result;
			}
			if (type === 'form') {
				newProject.templates.claim.form = res.result;
			}
			this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
		});
	}

	handlePropertyChanged = (prop: string, event: any) => {
		let newProject = this.state.project;
		newProject[prop] = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleRequiredClaimsChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.requiredClaims = parseInt(event.target.value.trim(), 10);
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleOwnerNameChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.ownerName = event.target.value;
		newProject.founder.name = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleOwnerEmailChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.ownerEmail = event.target.value.trim();
		newProject.founder.email = event.target.value.trim();
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleSDGChanged = (event: any) => {
		let newProject = this.state.project;
		let sdgs = event.target.value;
		// remove all whitespaces
		// @ts-ignore
		sdgs = sdgs.replace(/ /g, '');
		let sdgList = sdgs.split(',');

		newProject.sdgs = sdgList;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	render() {
		return (
			<div>
				<Container className="container">
					<div className="row">
						<div className="col-md-12">
							<br />
							<Text placeholder="Project datastore url example: http://104.155.142.57:5000/ or http://beta.elysian.ixo.world:5000/" value={this.state.project.serviceEndpoint} onChange={this.handlePdsUrlChange} />
							<ImageLoader quality={imageQuality.medium} placeholder="Choose project image file" imageWidth={960} aspect={16 / 9} imageCallback={this.handleImage}/>
							<Text placeholder="Title" value={this.state.project.title} onChange={(ev) => this.handlePropertyChanged('title', ev)}/>
							<Text placeholder="Owner Name" value={this.state.project.ownerName} onChange={this.handleOwnerNameChanged} />
							<Text placeholder="Owner Email" value={this.state.project.ownerEmail} onChange={this.handleOwnerEmailChanged} />
							<SmallTextArea placeholder="Short Description" value={this.state.project.shortDescription} onChange={(ev) => this.handlePropertyChanged('shortDescription', ev)}/>
							<BigTextArea placeholder="Long Description" value={this.state.project.longDescription} onChange={(ev) => this.handlePropertyChanged('longDescription', ev)}/>
							<select value={this.state.project.projectLocation} onChange={(ev) => this.handlePropertyChanged('projectLocation', ev)}>
							{countryLatLng.map( (v) => {
								return (
									<option key={v.alpha2} value={v.alpha2}>{v.country}</option>
								);
							})}
							</select>
							<Text placeholder="SDG list (comma separated)" value={this.state.project.sdgs} onChange={this.handleSDGChanged}/>
							<Text placeholder="Required number of claims" value={this.state.project.requiredClaims} onChange={this.handleRequiredClaimsChanged}/>
							<br />
							<Button type={ButtonTypes.gradient} onClick={this.handleCreateProject}>SUBMIT VENTURE</Button>
						</div>
					</div>
				</Container>
			</div>
		); 
	}
}

function mapStateToProps(state: PublicSiteStoreState): StateProps {
	return {
		ixo: state.ixoStore.ixo,
		keysafe: state.keysafeStore.keysafe
	};
}

export const ProjectCreateConnected = (connect(
	mapStateToProps
)(ProjectCreate));