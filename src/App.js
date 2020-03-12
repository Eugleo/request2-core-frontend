import React, {Component} from "react";
import "./App.css";
import {Announcements} from "./Announcements.js";

class App extends Component{
  render(){
    return(
      <div className="App">
        <h1>reQuest2</h1>
				<Announcements />
      </div>
    );
  }
}

export default App;
