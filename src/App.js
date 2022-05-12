import GraphCanvas from "./components/GraphCanvas";
import Pannel from "./components/Pannel"

import './App.css';
import {useState} from "react";

function App() {

  const [entries, setEntries] = useState([])
  const [factorized, setFactorized] = useState(true)

/*
| | | | __ _ _ __   __| | | ___ _ __ ___
| |_| |/ _` | '_ \ / _` | |/ _ \ '__/ __|
|  _  | (_| | | | | (_| | |  __/ |  \__ \
|_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
*/

  function handleSubmit(e) {
    e.preventDefault()
    const formdata = new FormData(document.getElementById(e.target.id))
    
    const nodes = []

    for(const [key, val] of formdata.entries())
      if (val !== "") nodes.push(val)

    setEntries(nodes)
  }

  function handleSwitch(e) {
    setFactorized(e.target.checked)
  }

  return (
    <div className="App">
        <input type="hidden" id="switch" value={factorized}/>
        <GraphCanvas nodes={entries} factorized={factorized}/>
        <Pannel switchCallback={handleSwitch} submitCallback={handleSubmit}/>
    </div>
  );
}

export default App;
