import { useHistory } from "react-router";
function QuizSettingPage(props){
    const history = useHistory();
    return <div><h1>Set Quiz for {props.dat}</h1>
    <button id="gobck" onClick={()=>{window.location.reload()}}>Go Back</button>
    </div>
}
export default QuizSettingPage;