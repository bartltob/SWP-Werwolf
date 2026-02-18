import { FaPlus, FaSignInAlt, FaCog } from "react-icons/fa";

import {useNavigate} from "react-router-dom";
import SetNickname from "../Components/SetNickname.tsx";
import {useState} from "react";


function MainPage() {
    const navigate = useNavigate();
    const [showNickname, setShowNickname] = useState(false);


    if (showNickname) return <SetNickname newRoom={true} />;

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">

            {/* SETTINGS BUTTON TOP RIGHT */}
            <button className="absolute top-6 right-6 bg-gray-800/70 backdrop-blur-md p-4 rounded-full shadow-lg border border-gray-700 hover:border-blue-500 hover:scale-110 transition-all duration-300">
                <FaCog size={22} className="text-blue-400" />
            </button>

            {/* TITLE */}
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide text-center">
                🐺 Werewolf Online
            </h1>
            <p className="text-gray-400 mb-16 text-center">
                Deceive. Survive. Unmask the Werewolf.
            </p>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl">

                {/* Create Room */}
                <div className="bg-gray-800/70 backdrop-blur-md p-10 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-red-500"
                     onClick={() => setShowNickname(true)}>
                    <div className="flex flex-col items-center text-center">
                        <FaPlus size={45} className="text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Create Room</h2>
                        <p className="text-gray-400">
                            Start a new game and invite your friends.
                        </p>
                    </div>
                </div>

                {/* Join Game */}
                <div onClick={() => navigate("/JoinRoom")} className="bg-gray-800/70 backdrop-blur-md p-10 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-purple-500">
                    <div className="flex flex-col items-center text-center">
                        <FaSignInAlt size={45} className="text-purple-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Join Game</h2>
                        <p className="text-gray-400">
                            Join an existing room with a code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
