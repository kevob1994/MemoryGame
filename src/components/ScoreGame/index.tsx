import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import React, { useState, useEffect } from "react";
import { History } from "../../interfaces/interfaces";
import { DownOutlined } from "@ant-design/icons";
import classNames from "classnames";
import "./index.scss";

interface IScoreGameProps {
    history: History[];
}

export const ScoreGame = ({ history }: IScoreGameProps) => {
    const screens = useBreakpoint();
    const [showList, setShowList] = useState(true);
    const [statusIcon, setStatusIcon] = useState(true);
    useEffect(() => {
        !screens.lg ? setShowList(false) : setShowList(true);
    }, [screens]);

    let iconClass = classNames({
        transition: !statusIcon,
    });
    return (
        <div className="content-score">
            <div className="header-list">
                <h1>Historial </h1>
                {!screens.lg ? (
                    <>
                        <DownOutlined
                            className={iconClass}
                            onClick={() => {
                                setShowList(!showList);
                                setStatusIcon(!statusIcon);
                            }}
                        />
                    </>
                ) : null}
            </div>
            {showList ? (
                <div className="list">
                    {history.length > 0 ? (
                        history.map((item, index: number) => (
                            <div className="item-list">
                                <p className="index">{index + 1} -</p>
                                <div className="info-score">
                                    <p># Errores: {item.count_errors}</p>
                                    <p>Duración: {item.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        null
                    )}
                </div>
            ) : null}
        </div>
    );
};
