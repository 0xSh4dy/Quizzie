import MobileNav from "./MobileNav";
import { useState } from "react";

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
                  {click===false?null:<MobileNav></MobileNav>}
              </div>
}
export default Hamburger;