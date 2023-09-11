import { address, flask_port, flask_port_2 } from "./Endpoint";
import axios from "axios";

export default function FetchEnpoint() {
    //Lista di tutti gli endpoint possibili
    var EndpointList = [address + flask_port, address + flask_port_2];
    shuffle(EndpointList);
    console.log(EndpointList)
    EndpointList.map(
        (data) => {
            console.log(data)
            fetch(data).then( res => {
                if(res.status >= 400){
                    //error
                }else{
                    return data;
                }
            })
        }
    )   
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }