import React from "react";

import {api_endpoint} from "./Api.js";

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
			<h2>News</h2>
			<ul>
			{ this.state.announcements
			  .map((a) => <li>{a.id}: {a.data.title}</li>) }
			</ul>
		</div>;
	}
}
