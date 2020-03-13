import React, {Component} from "react";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import {Announcement, Announcements} from "./Announcements.js";
import {Icon} from './Icon.js';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
	HashRouter as Router,
	Switch, Route, Redirect, useParams } from 'react-router-dom';


class App extends Component{
	render(){
		return(
			<div className="App">
				<Navbar bg="dark" variant="dark" className="navbar-expand-md">
					<Navbar.Brand href="#">
						<span style={{fontVariant: "small-caps"}}>re</span>Quest<sup>2</sup>
					</Navbar.Brand>

					<Nav className="mr-auto">
						<Nav.Link href="#/news"><Icon info wBold/> News</Nav.Link>
					</Nav>

					<Nav className="ml-auto">
						<Nav.Link href="#/login"><Icon signin wBold/> Login</Nav.Link>
						<Nav.Link href="#/register"><Icon user wBold/> Register</Nav.Link>
					</Nav>
				</Navbar>

				<Container className="mt-3">
					<Router><Switch>

						<Route path='/news/:id'>
							<AnnouncementFromHash />
						</Route>

						<Route path='/news'>
							<Announcements />
						</Route>

						<Route path='/login'>
							Login page.
						</Route>

						<Route path='/register'>
							Registration page.
						</Route>

						<Route path='/'>
							<Redirect to='/login'/>
						</Route>
					</Switch></Router>
				</Container>

				<footer className="footer">
					<Container>
						<Row>
							<Col>
								Neco vlevo
							</Col>
							<Col>
								Neco vpravo, asi loga
							</Col>
						</Row>
					</Container>
				</footer>
			</div>
		);
	}
}

function AnnouncementFromHash() {
	var {id} = useParams();
	return <Announcement id={id} />;
}

export default App;
