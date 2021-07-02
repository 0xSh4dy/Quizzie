import Terminal from './Terminal';
import Dashboard from "./Dashboard";
import Discussions from './Discussion'; 
import Commands from './Commands';
import {BrowserRouter as Router, Route, Switch,Link} from 'react-router-dom';
import Logout from './Logout';
const loggedInUsername = sessionStorage.getItem("loggedInUsername");
function UserNameNav(){
    return <h2 style={{display:'inline', position:'absolute', right:10}}> Welcome, {loggedInUsername} !</h2>
}

function Navbar(){
    return (
        <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/terminal" id="ter">Terminal</Link>
              </li>
              <li>
                <Link to="/discussions">Discussions</Link>
              </li>
              <li>
                <Link to="/commands">Commands</Link>
              </li>
              <li>
                <UserNameNav></UserNameNav>
              </li>
              <li>
                <Logout></Logout>
              </li>
            </ul>
          </nav>

          <Switch>
            
          <Route path="/dashboard">
                <div className="centerNav">
                    <Dashboard/>
                </div>
            </Route>
            <Route path="/terminal">
              <div className="centerNavTer">
              <Terminal />
              </div>
            </Route>
            <Route path="/discussions">
                <div className="centerNav">
                    <Discussions></Discussions>
                </div>
            </Route>
            <Route path="/commands">
              <div className="centerNav">
                <Commands></Commands>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
  
    )
}
export default Navbar;