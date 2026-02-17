import { useState } from "react";
import WaitingRoom from "../Components/WaitingRoom";

type Props = {};

export default function GamePage({}: Props) {

    const [isWaiting] = useState(true);

    if (isWaiting) return <WaitingRoom />;

    return (
        <div>



        </div>
    );
}
