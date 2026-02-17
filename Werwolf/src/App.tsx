
import {Route, Routes} from "react-router-dom";
import MainPage from "./Pages/MainPage.tsx";
import GamePage from "./Pages/GamePage.tsx";


function App() {

    return (
       <main>
           <Routes>
               <Route path="/" element={<MainPage />} />
               <Route path="/GamePage" element={<GamePage />} />
           </Routes>
       </main>
    )
}
export default App;
