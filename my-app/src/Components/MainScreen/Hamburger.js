import MobileNav from "./MobileNav";
import { useState } from "react";
import Logout from "./Logout";
function Nodata(){
  return <div className="nodata">
    <div id="nodataLogout"><Logout/></div>
    <p>Click on the hamburger icon to view the navigation menu</p>
    <p>Please report bugs if you find any. It would really help the developer</p>
    <p>The site is currently under rapid development and testing phase. But, you may still
      use most of the powerful tools of the platform. </p>
  </div>
}
function Hamburger(){
    const [click,setClick] = useState(false);

    return <div>
                <div className="navBurger" onClick={()=>{
                if(click===false){setClick(true)}
                else{setClick(false)}
                
                console.log("yoyo");
                  }}>
                <div className="navBurgerDiv"></div>
                <div className="navBurgerDiv"></div>
                <div className="navBurgerDiv"></div>
                </div>
                  {click===false?<Nodata/>:<MobileNav></MobileNav>}
              </div>
}
export default Hamburger;