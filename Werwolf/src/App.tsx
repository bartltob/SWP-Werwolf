
import {Route, Routes} from "react-router-dom";
import MainPage from "./Pages/MainPage.tsx";
import GamePage from "./Pages/GamePage.tsx";
import JoinRoomPage from "./Pages/JoinRoomPage.tsx";


function App() {

    return (
       <main>
           <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/GamePage" element={<GamePage />} />
                <Route path="/JoinRoom" element={<JoinRoomPage />} />
           </Routes>
       </main>
    )
}
export default App;
