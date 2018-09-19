import * as React from 'react';
import styled from 'styled-components';
import { WidgetWrapper, gridSizes } from '../common/WidgetWrapper';
import { LayoutWrapper } from '../common/LayoutWrapper';
import BarChartProjects, { BarColors } from '../widgets/BarChartProjects';
import { WorldMap, LatLng } from '../widgets/WorldMap';
import { isoCountriesLatLng } from '../../lib/commonData';
import { SDGArray } from '../../lib/commonData';

const Container = styled.div`
	color: white;
	flex: 1 1 auto;
	display: flex;
`;

const ProjectCount = styled.h1`
	color: #A11C43;
`;

const SDGsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	max-width: 100%;
	margin-top: 50px;
`;

const SDG = styled.div`
	width: 60px;
	height: 60px;
	box-shadow: 0 3px 11px 0 rgba(0,0,0,0.31);
	margin: 0 15px 15px 0;
	position: relative;
	cursor: pointer;

	img {
		width: 100%;
		height: 100%;
		transition: opacity 0.3s ease;
	} 
`;

export interface ParentProps {
	projects: any[];
	claims: any[];
	claimsTotalRequired: number;
	agents: any;
}

export const ProjectsDashboard: React.SFC<ParentProps> = ({projects, claims, claimsTotalRequired, agents}) => {

	const getProjectsLatLng = () => {
		let markers = [];
		for (var i = 0; i < projects.length; ++i) {
			let proj = projects[i].data;
			let latLng = isoCountriesLatLng[proj.projectLocation];
			if (latLng) {
				markers.push(new LatLng(latLng.lat, latLng.lng));
			}
		}
		return markers;
	};

	const formatProjectCount = (count: number) => {
		var n = count;
		return n.toLocaleString();
	};

	return (
		<Container>
		<LayoutWrapper>
			<div className="row">
				<div className="col-md-12">
					<SDGsContainer>
						{SDGArray.map((sdg, idx) => {
							return (
								<SDG key={idx} style={{background: sdg.color}}>
									<img src={`./sdgs/${idx + 1}.png`}/>
								</SDG>
							);
						})}
						<SDG key={18} style={{background: 'white'}}>
							<img src={`./sdgs/18.png`}/>
						</SDG>
					</SDGsContainer>	
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<WidgetWrapper title="Ventures" path={``}>
						<ProjectCount>
							{formatProjectCount(projects.length)}
						</ProjectCount>
						<BarChartProjects 
							barData={[
								{data: projects, color: BarColors.yellow, label: 'Ventures Submitted'},
							]}
						/>
					</WidgetWrapper>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<WidgetWrapper title="Venture location activity" path={``} gridHeight={gridSizes.standard}>
						<WorldMap markers={getProjectsLatLng()}/>
					</WidgetWrapper>
				</div>
			</div>
		</LayoutWrapper>
		</Container>
	);
};