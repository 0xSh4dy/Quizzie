import { useHistory } from 'react-router';
import { useRef } from 'react';
import CommandList from './CommandList';
import HelpText from './HelpItems';
import axios from "axios";
var inputDat="";
var inp = false;
var inpPos = "";
var sessEmail = sessionStorage.getItem("logEmail");
var sessName="";
function Terminal(){
    const history = useHistory();
    var outputSec = useRef(null);
    function MainTerm(){
        return (<div className="terminalData1">
            <h1>Terminal</h1>
            <input type="text" className="commandSection" placeholder="Enter commands here" onKeyDown={displayOutput} autoComplete="off"></input>
            <div ref={outputSec} className="outputSection">Welcome to the Quizzie platform made by Rakshit.
            Type <strong>help</strong> in the input section to get started. Or, type  <strong>show commands</strong> in the input section to view the list of available commands</div>
            </div>
        )
    }
    function displayOutput(e){
        
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/authRenderer"
        }).then((resp)=>{
            inpPos = resp.data;
        }).catch(error=>console.log(error));
        
        if(e.code==="Enter"){
           
            let inputText = String(e.target.value);
            e.target.value="";
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
            inputCmdDat= inputCmdDat.replace(/\s/g,"");
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
                    outputSec.current.innerHTML = "$ Invalid page. Pages available to render through the render command are dashboard, discussions and commands"
                }
            }
            else if(inputCommand==="logout"){
                sessionStorage.removeItem("isLoggedIn");
                sessionStorage.removeItem("position");
                sessionStorage.removeItem("loggedInUsername");
                sessionStorage.removeItem("logEmail");
            
                if(sessionStorage.getItem("teacherLog")){
                sessionStorage.removeItem("teacherLog");
                }
              window.location.reload();
            }
            else if(inputCommand==="show"){
                if(inputCmdDat==="commands"){
                    let strCommands = "";
                    for(let i=0;i<CommandList.length;i++){
                        strCommands+=CommandList[i]+'</br>';
                    }
                    outputSec.current.innerHTML = strCommands;
                }
                else if(inputCmdDat==="courses"){
                    if(inpPos==="teacher"){
                    axios({
                        method:'GET',
                        url:'http://127.0.0.1:4000/data/courses'
                    }).then((resp)=>{
                        let respDat = "Courses created by you are: </br>";
                        for(let i=0;i<(resp.data).length;i++){
                            respDat = respDat+resp.data[i]+'</br>'
                        }
                        outputSec.current.innerHTML = respDat;
                    }).catch(err=>console.log(err));
                }
                else if(inpPos==="student"){
                    axios({
                        method:'GET',
                        url:'http://127.0.0.1:4000/data/studCourses'
                }).then((respons)=>{
                    console.log(respons.data);
                    let studCourse = [];
                    for(let k=1;k<respons.data.length;k++){
                        studCourse.push(respons.data[k].course[0].crstud+'</br>');
                    }
                    outputSec.current.innerHTML=`Courses in which you have participated are: ${studCourse}`
                }).catch(err=>console.log(err));
                }
                }
            }
            else if(inputCommand==="clear"){
                if(inputCmdDat!=""){
                    outputSec.current.innerHTML= "clear expects no arguments"
                }
                else{
                    outputSec.current.innerHTML = "";
                }
            }

            else if(inputCommand==="create-course"){
                if(inputCmdDat===""){
                    outputSec.current.innerHTML = "Error, course name can't be empty";
                }
                else{
                    if(inpPos==="teacher"){
                    let body = {course:inputCmdDat};
                    axios({
                        method:'post',
                        url:'http://127.0.0.1:4000/mainScr/teacher/courses',
                        data:body
                    }).then((resp)=>{
                        if(resp.status>500){
                            outputSec.current.innerHTML = "Server side error";
                        }
                        else if(resp.data==="Yes" ){
                            outputSec.current.innerHTML = `Created a new course ${inputCmdDat}`;
                            sessionStorage.setItem("courseClick",inputCmdDat)
                        }
                        
                        else{
                            outputSec.current.innerHTML = "Oops, some error occured. Please try again";
                        }

                    }).catch(error=>console.log(error));
                }
                else if(inpPos==="student"){
                    outputSec.current.innerHTML="Only teachers can create courses";
                }
                else{
                    outputSec.current.innerHTML = "Oops, some connection error. Please try again";
                }
                }
            }
            else if(inputCommand==="help"){
                 outputSec.current.innerHTML = HelpText;
            }
            else if(inputCommand==="delete-course"){
                if(inputCmdDat===""){
                    outputSec.current.innerHTML = "Course can't be empty";
                }
                else{
                    if(inpPos==="teacher"){
                    let body={
                        del:inputCmdDat
                    }
                    axios({
                      method:'POST',
                      url:'http://127.0.0.1:4000/mainScr/teacher/delete',
                      data:body
                    }).then((resp)=>{
                        if(resp.data==="Yes"){outputSec.current.innerHTML=`Deleted the course ${inputCmdDat}`}
                        else{
                            outputSec.current.innerHTML="Failed to delete the course. Either the course does not exist, or there is some connecton error."
                        }
                    }).catch((err)=>{
                        outputSec.current.innerHTML=err;
                    })
                }
                else if(inpPos==="student"){
                    outputSec.current.innerHTML = "Students cannot delete courses";
                }
                }
            }
            else if(inputCommand==="join-course"){
                let n = inputCmdDat.indexOf("-emotp");
                let joinCmdSub = (inputCmdDat.slice(0,n));
                let n1 = n+6;
                let n2 = inputCmdDat.length;
                let joinCmdEmail = (inputCmdDat.slice(n1,n2));
                let body={
                    studentCrsRequest:joinCmdSub,
                    studentEmailRequest:joinCmdEmail
                }
                axios({
                    method:'POST',
                    url:'http://127.0.0.1:4000/mainScr/teacher/join',
                    data:body
                }).then((resp)=>{
                    if(resp.data==="Yes"){
                outputSec.current.innerHTML = `Joined a new course ${joinCmdSub} and teacher name is ${joinCmdEmail}`

                    }
                    else if(resp.data==="No"){
                        outputSec.current.innerHTML = "Invalid course name or invalid email";
                    }
                    else if(resp.data==="Naah"){
                        outputSec.current.innerHTML = "You have already registered for that course";
                    }
                }).catch(err=>console.log(err));
                
            }
            else{
                outputSec.current.innerHTML = "Invalid command! Type show commands to view all commands or click on the commands list GUI to view them."
            }
        }
     
     }
    return <div>
      <MainTerm></MainTerm>
    </div>
}
export default Terminal;