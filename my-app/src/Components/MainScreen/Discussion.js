import { useEffect, useState} from "react";
import io from 'socket.io-client';
let socket;
let name = sessionStorage.getItem("loggedInUsername");
let endpoint = 'localhost:4000';
const room = 1;
let k=0;
function Discussions(){
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState("");
    const [users,setUsers] = useState("");
    // For socket connection
    function ShowMsgs(props){
        return <div className="discMsgs" key={k++}>
            <span>{props.user} :&nbsp;&nbsp;</span><span>{props.text}</span>
            </div>
    }
    useEffect(()=>{
        socket = io(endpoint);
        socket.emit('join',{name,room},()=>{});
        return ()=>{
            socket.emit('disconnec');
            socket.off();
        }
    },[endpoint])
    //For messages
    useEffect(()=>{
        socket.on('message',message=>{
            setMessages(messages=>[...messages,message])
        }
        
    )
    },[]);
    
    function prepareMessage(e){
        e.preventDefault();
        
        if(message){
            socket.emit('sendMessage',message);
        }
        setMessage("");
    }
    
    return(
        <div className="discussions">
                <div className="discussionMessages">
                {messages.map(ShowMsgs)} 
                </div>
            <div className="discData">
            <input placeholder="Enter message" onChange={(event)=>setMessage(event.target.value) } onKeyPress={
                e=>e.key==='Enter'?prepareMessage(e):null
            } value={message}></input>

            <button onClick={(e)=>prepareMessage(e)}>Send</button>
            </div>
        </div>
    )
}
export default Discussions;