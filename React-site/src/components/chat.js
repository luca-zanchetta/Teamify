import "../css/Navigator.css";

import { useEffect } from "react";

import "../css/chat.css"
import chat from "../icons/chat.png";
import cancel from "../icons/cancel.png";
import face from "../img/face.jpeg";
import { useState } from "react";

function Chat() {
  const [show, setShow] = useState(false);

  function ToggleChat() {
    setShow(!show);
  }

  function OnChatSubmit(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode                        
        e.preventDefault();
        var text = e.target.value
        console.log("text sumbitted: " + text)
        e.target.value = ""
    }
  }
  function showChat() {

  }

  useEffect(() => {
    showChat();
  }, []);

  return (
    <div className="Bubble">
        {
            !show &&
            (
                <>
                    <img src={chat} onClick={ToggleChat}></img>
                </>
            )
            ||
            show &&
            (
                <div className="ChatContainer">
                    <div className="ChatTopBar">
                        <h3>
                            team 2
                            <i class="arrow up"></i>
                        </h3>
                        <img src={cancel} onClick={ToggleChat}></img>
                    </div>
                    <hr></hr>
                    <div className="ChatBody">
                        <div class="ChatEntry">
                            <img src={face}></img>
                            <div className="ChatEntryText">
                                <h2>
                                    Username
                                </h2>
                                <h3>
                                    Acuna matata a tutti ragazzi, ben ritrovati dal vostro ciccio gamer 89!
                                </h3>
                            </div>
                        </div>
                        <div class="ChatEntry">
                            <img src={face}></img>
                            <div className="ChatEntryText">
                                <h2>
                                    Username
                                </h2>
                                <h3>
                                siuummmm! forza juve
                                </h3>
                                <h5>
                                    28/08 - 16:54
                                </h5>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <input type="text" onKeyDown={OnChatSubmit} id="chatInput">
                    </input>
                 </div>
            )
        }
    </div>
  );
}

export default Chat;
