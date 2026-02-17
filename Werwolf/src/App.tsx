
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";


function App() {

    return (
       <main>
           <Routes>
               <Route path="/" element={<MainPage />} />
           </Routes>
       </main>
    )
}
export default App;
