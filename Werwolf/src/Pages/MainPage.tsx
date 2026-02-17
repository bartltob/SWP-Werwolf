import { FaPlus, FaSignInAlt, FaCog } from "react-icons/fa";
import {useCreateRoom} from "../Hooks/useCreateRoom.ts";


function MainPage() {
    const { createRoom } = useCreateRoom();

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">

            {/* SETTINGS BUTTON OBEN RECHTS */}
            <button className="absolute top-6 right-6 bg-gray-800/70 backdrop-blur-md p-4 rounded-full shadow-lg border border-gray-700 hover:border-blue-500 hover:scale-110 transition-all duration-300">
                <FaCog size={22} className="text-blue-400" />
            </button>

            {/* TITEL */}
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide text-center">
                🐺 Werwolf Online
            </h1>
            <p className="text-gray-400 mb-16 text-center">
                Täusche. Überlebe. Entlarve den Werwolf.
            </p>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl">

                {/* Zimmer erstellen */}
                <div className="bg-gray-800/70 backdrop-blur-md p-10 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-red-500"
                onClick={() => createRoom()}>
                    <div className="flex flex-col items-center text-center">
                        <FaPlus size={45} className="text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Zimmer erstellen</h2>
                        <p className="text-gray-400">
                            Starte ein neues Spiel und lade deine Freunde ein.
                        </p>
                    </div>
                </div>

                {/* Spiel beitreten */}
                <div className="bg-gray-800/70 backdrop-blur-md p-10 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-purple-500">
                    <div className="flex flex-col items-center text-center">
                        <FaSignInAlt size={45} className="text-purple-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Spiel beitreten</h2>
                        <p className="text-gray-400">
                            Trete einem bestehenden Raum mit einem Code bei.
                        </p>
                    </div>
                </div>

            </div>

            {/* FOOTER */}
            <div className="absolute bottom-6 text-gray-600 text-sm">
                © {new Date().getFullYear()} Werwolf Project
            </div>

        </div>
    );
}

export default MainPage;
