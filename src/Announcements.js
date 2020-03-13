import React from "react";

import {Link} from 'react-router-dom';

import {api_endpoint} from "./Api.js";
import {Icon} from "./Icon.js";

export class Announcements extends React.Component {
	constructor(props) {
		super(props);
		console.log(api_endpoint);
		this.state={announcements: []}
	}

	componentDidMount() {
		fetch(api_endpoint+"announcements")
		.then((response) => response.json())
		.then((json) => this.setState({announcements: json}));
	}

	render() {
		return <div>
			<h1>News</h1>
			<ul>
			{ this.state.announcements
			  .map((a) =>
					<li key={a.id}>
						<Link to={"/news/"+a.id}>{a.data.title}</Link>
						({a.data.created})
					</li>) }
			</ul>
		</div>;
	}
}

export class Announcement extends React.Component {
	render() {
		return <>
		<h1><Link to="/news"><Icon chevronLeft sEm/></Link> Announcement id {this.props.id}</h1>
		</>;
	}
}
