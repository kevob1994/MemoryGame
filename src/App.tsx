import React, { useEffect, useState } from "react";
import "./App.scss";
import { HeaderApp } from "./components/Header";
import { MemoryGame } from "./components/MemoryGame";
import { ScoreGame } from "./components/ScoreGame";
import { History } from "./interfaces/interfaces";
import { getHistoryApi } from "./services/services";

function App() {
    const [history, sethistory] = useState<History[]>([]);

    useEffect(() => {
        getHistorial();
    }, []);

    //obtiene el historial de las partidas jugadas
    const getHistorial = async () => {
        let { data }: { data: History[] } = await getHistoryApi();
        sethistory(data);
    };

    return (
        <div className="content-page">
            <HeaderApp />
            <div className="site-layout">
                <ScoreGame history={history} />
                <MemoryGame updateHistorial={getHistorial}/>
            </div>
        </div>
    );
}

export default App;
