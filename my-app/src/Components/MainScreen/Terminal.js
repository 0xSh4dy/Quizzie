import Dashboard from "./Dashboard";
import Commands from "./Commands";
import Discussions from "./Discussion";
import {useState} from 'react';
import { useHistory } from 'react-router';
import CommandList from './CommandList';
var inputDat="";
var inp = false;

function Terminal(){
    const history = useHistory();
    function MainTerm(){
        return (<div>
            <h1>Terminal</h1>
            <input type="text" className="commandSection" placeholder="Enter commands here" onKeyDown={displayOutput}></input>
            <div className="outputSection"></div>
            </div>
        )
    }
    function displayOutput(e){
        let outputSec = document.querySelector(".outputSection");
        
        if(e.code==="Enter"){
           
            let inputText = String(e.target.value);
            inputDat =  inputText.toLowerCase();
            let inputCommand = "";
            let inputCmdDat="";
            for(let i=0;i<inputDat.length;i++){
                inputCommand+=inputDat[i];
                if(inputDat[i]===" "){
                    break;
                }
            }
            for(let i=inputCommand.length;i<inputDat.length;i++){
                inputCmdDat+=inputDat[i];
            }
            inputCommand=inputCommand.trim();
            inputCommand=inputCommand.toLowerCase();
            inputCmdDat= inputCmdDat.toLowerCase();
            if(inputCommand==="render"){
                if(inputCmdDat==="dashboard"){
                    history.push("/dashboard");
                }
                else if(inputCmdDat==="discussions"){
                    history.push("/discussions");
                }
                else if(inputCmdDat==="commands"){
                    history.push("/commands");
                }
                else{
                    outputSec.innerHTML = "$ Invalid page. Pages available to render through the render command are dashboard, discussions and commands"
                }
            }
            else if(inputCommand==="show"){
                if(inputCmdDat==="commands"){
                    let strCommands = "";
                    for(let i=0;i<2;i++){
                        strCommands+=CommandList[i]+'</br>';
                    }
                    outputSec.innerHTML = strCommands;
                }
            }
            else if(inputCommand==="clear"){
                inputCmdDat = inputCmdDat.trim();
                if(inputCmdDat!=""){
                    outputSec.innerHTML= "clear expects no arguments"
                }
                else{
                    outputSec.innerHTML = "";
                }
            }
        }
     
     }
    return <div>
      <MainTerm></MainTerm>
    </div>
}
export default Terminal;