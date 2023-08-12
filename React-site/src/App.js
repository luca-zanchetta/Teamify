import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios';
import React, {useState, useEffect } from "react";

import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import Reset from "./Reset";
import HomeLoggedIn from "./HomeLoggedIn";
    
function App() {
    //data è la variabile dello stato, setData è la funzione per settare il suo valore
    const [data, setData] = useState([{}])
    //use effect viene usato per ottenere la route di interesse. La response delle api
    //viene converita in json e poi caricate dentro la variabili data 
    useEffect(() => {
        fetch("http://localhost:5000").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
            )
    }, [])
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element= {<Home />} />
              <Route path="login" element= {<Login />} />
              <Route path="signup" element= {<SignUp />} />
              <Route path="reset" element= {<Reset />} />
              <Route path="home" element= {<HomeLoggedIn />} />
          </Routes>
      </BrowserRouter>
    )
}

export default App;
