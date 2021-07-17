import {BrowserRouter as Router, Link, Route,Switch} from 'react-router-dom';
import Dashboard from './Dashboard';
import Discussions from './Discussion';
import Commands from './Commands';
import Terminal from './Terminal';
function MobileNav(){
    return <Router>
    <div className="mobileRouter">
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/terminal">Terminal</Link>
                </li>
                <li>
                    <Link to="/discussions">Discussions</Link>
                </li>
                <li>
                    <Link to="/commands">Commands</Link>
                </li>
            </ul>
           <Switch>
               <Route path="/dashboard">
                   <div className="mobileRoutes" id="mobileDashboard"><Dashboard/></div>
               </Route>
               <Route path="/terminal">
                   <div className="mobileRoutes" id="mobileTerminal"><Terminal/></div>
               </Route>
               <Route path="/discussions">
               <div className="mobileRoutes" id="mobileDiscussions"><Discussions/></div>
                   
               </Route>
               <Route path="/commands">
               <div className="mobileRoutes" id="mobileCommands"><Commands/></div>

               </Route>
           </Switch>
        </div>

        </Router>
}
export default MobileNav;