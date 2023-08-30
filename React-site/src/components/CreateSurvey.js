import "../css/Navigator.css";

import { useEffect } from "react";

import "../css/Survey.css"
import { useState } from "react";
import cancel from "../icons/cancel.png"
function CreateSurvey() {

  const [show, setShow] = useState(false);
  const [options,setOptions] = useState(1)

  function AddOption() {
    setOptions(options+1);
  }

  function RemoveOptions(e) {
    for (let index = parseInt(e.target.className); index < options-1; index++) {
      document.getElementById(index).value = document.getElementById(index+1).value;
    }
    setOptions(options-1);
  }

  function ToggleCreate() {
    setShow(!show)
  }

  function Confirm() {

    var elements =document.getElementsByClassName("option")
    var values = []
    for (let index = 0; index < options; index++) {
      values.push(elements[index].value)
    }

    // Values contine la lista di tutte le options del survey
    console.log(values)

    setShow(false)
    setOptions(1)
  }

  return (
    <div className="SurveySectionTopBar">
    {
      !show &&
      (
        <div className="CreateSurvey" onClick={ToggleCreate}>
          <h2>
            Add Survey
          </h2>           
        </div>
        )
        ||
        show && 
        (
        <div className="SurveyContainer">
          <div className="SurveyHeader">
            <h2>Create New Survey</h2>
          </div>
          <div className="SurveyHeader">
            <input type="text" placeholder ="insert title here" id="title"></input>
            <input type="text" placeholder ="insert description here" id="description"></input>
            <input type="date" placeholder ="insert title here" id="date"></input>
          </div>
        <div className="SurveyBody">
        {
          [...Array(options)].map((a,i) => (
            <div className="SurveyEntry" style={{justifyContent:"spaceAround"}}>
              <span class="dot"></span>
              <input type="text" placeholder ="insert option here" className="option" id={i}></input>
              <div className="XIcon" onClick={RemoveOptions}> <img src={cancel} class={i}></img></div>
            </div> 
          ))
        }
          <div className="SurveyEntry" style={{justifyContent:"spaceAround"}}>
            <span class="dot"></span>
            <input type="text" placeholder ="Add Another option" className="option" onFocus={(e) => e.target.blur()}onClick={AddOption} readOnly="true"></input>
          </div> 
        </div>

        <div className="SurveyFooter" style={{justifyContent: "flex-end"}}>
          <div className="CreateSurvey" onClick={ToggleCreate}>
            <h2 style={{color:"white"}}>
              cancel
            </h2>           
          </div>
          <div className="CreateSurvey" style={{ marginLeft:"1%"}} onClick={Confirm}>
            <h2 style={{color:"white"}}>
              confirm
            </h2>           
          </div>
        </div>
      </div>
      )
    }
    </div>
  );
  
}

export default CreateSurvey;
