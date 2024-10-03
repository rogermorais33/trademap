import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home"
import ComtradeAPI from "./pages/a";

 function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/API" element={<ComtradeAPI/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default RoutesApp;