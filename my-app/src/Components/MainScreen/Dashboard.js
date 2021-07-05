import { useState,useEffect } from "react";
import axios from "axios";
import StudentDashBoard from './StudentDashboard';
let a =1;
function MyCourses(props){
    return <li key={a++}>{props}</li>
}
function EventDashboard(){
    return (
        <h1>Event Dashboard</h1>
    )
}

function Dashboard(){
    const [gotCourseData,setCourseData]=useState(false);
    const [dat,setDat] = useState([]);
    const [position,setPosition] = useState("");
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/studentboard"
        }).then((resp)=>{
            setPosition(resp.data);
        })
        .catch(err=>console.log(err));
    },[])
    
    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/courses"
        }).then((results)=>{
            if(results.data!="No"){
            setDat(results.data);
            
            setCourseData(true);
        }
        else if(results.data==="No"){
            axios({
                method:"GET",
                url:"http://127.0.0.1:4000/mainScr/teacher/quizDat"
            }).then((respon)=>{
                let datq = respon.data;
                let len1=  datq.length;
                let datArray = [];
                for(let i=0;i<len1;i++){
                    datArray.push(JSON.parse(datq[i]));
                }
                
            }).catch(error=>console.log(error));
        }
        }).catch(err=>console.log(err));

       
    },[]);
    if(gotCourseData===true&&position==="teacher"){
        const dat1 = [...dat];
        console.log(dat1);
        return <div className="dashClass">
            <h1 >My Courses</h1>
                <div className="dash">
                <div className="dash1">
                {dat1.map(MyCourses)}
                </div>
                <div className="dash2">
                <EventDashboard></EventDashboard>
                </div>
                </div>
        </div>
    }
    else if(position==="student"){
        return <StudentDashBoard></StudentDashBoard>
    }
    else{
        return <h1>Loading...</h1>
    }
    
}
export default Dashboard;