import React from "react";
import classNames from "classnames";
import "./index.scss";

interface Props {
    img: string;
    showCard: boolean;
    flipCard: (index: number) => void;
    id: number;
}

export const Card = ({ img, showCard, flipCard, id }: Props) => {

    let cardClass = classNames({
        "back-card": true,
        flip: showCard,
    });

    const pokemonIndex = img.split("/")[img.split("/").length - 2];

    return (
        <div className={cardClass} onClick={() => flipCard(id)}>
            <img
                className="front-card"
                src={`https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`}
            />
        </div>
    );
};
