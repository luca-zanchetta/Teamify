import "../css/Navigator.css";

import { useEffect } from "react";
import "../css/Survey.css"
import chat from "../icons/chat.png";
import cancel from "../icons/cancel.png";
import face from "../img/face.jpeg";
import { useState } from "react";
import { address, flask_port } from "./Endpoint";
import axios from "axios";

function Survey(props) {
  const [vote, setShow] = useState(false);
  const [checkedVote, setCheckedVote] = useState(props.entries.map((data) => { if(data[2]) return data[3]}))
  const [poolID, SetPool] = useState(props.id)
  const username=localStorage.getItem("LoggedUser");
  console.log(username);
  
  async function ToggleVote() {
    
    if(vote){
      await axios
      .post(address + flask_port + "/vote", {
          pool_id:poolID,
          username: username,
          option_id: checkedVote,
        }).then((response) => {
        // console.log(response);
        if (response.data.status === 200) {
          window.location.replace(window.location.href);
        }
      }).catch(function (error) {
        if (error.response) {
          // Print error data
          console.log("Data: " + error.response.data);
          console.log("Status: " + error.response.status);
          console.log("Headers: " + error.response.headers);

          // Handle error
          if (error.response.status === 400) {
            sessionStorage.setItem("inviteError_alert", "true");
            window.location.replace(window.location.href); // For alert purposes only
          }
        }
      });
    }
      setShow(!vote);
  }

  function OnSurveyChange(e) {
    console.log(e.target.value)
    setCheckedVote(e.target.value)
  }
  
  useEffect(() => {
    props.entries.forEach(element => {
      if(element[2])
        setCheckedVote(element[1])
    });
    
    SetPool(props.id)
  }, []);

  return (
    <div className="SurveyContainer">
      <div className="SurveyHeader">
        <h2>{props.title}</h2>
      </div>

      <div className="SurveyBody">

      {props.entries.map(
        function(data, i){
          const color = data[3]== checkedVote? "green": "red"
          if(!vote)
            return (
              <div className="SurveyEntry">
                <h2>{data[0]}</h2>
                <div className="SurveyValue">
                  <h2>{data[1]}</h2>
                  <div className="SurveyBar" style={{width:data[0], backgroundColor:color}}></div>
                  {
                    data[3] == checkedVote && (
                      <h3>You voted this</h3>
                    )
                  }
                </div>
              </div> 
            )
          else
            return (
              <div className="SurveyInputEntry">
                <input type="radio" id={data[1]} name={props.title} value={data[3]} checked={data[3] == checkedVote} onChange={OnSurveyChange}></input>
                <label for={data[1]}>{data[1]}</label>
              </div>
            )                 
       })
      }
      </div>
      <div className="SurveyFooter">
        <div>
          <h2>Total votes: {props.votes} • Created by {props.author} • {props.date}</h2>
        </div>
        <div className="SurveyButtonCont">
          <div className="SurveyButton" onClick={ToggleVote}>
            <h2>
              { vote && ("Vote") || !vote && ("Edit")}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Survey;
