import React, { useEffect, useState } from "react";
import "./index.scss";
import { Row, Col, Button, Modal } from "antd";
import { Card } from "../Card";
import { ApiPokemon, History, PokemonCard } from "../../interfaces/interfaces";
import { useChronometer } from "../../hooks/useChronometer";
import { getPokemonsApi, postHistoryApi } from "../../services/services";

interface IMemoryGameeProps {
    updateHistorial: () => Promise<void>;
}

export const MemoryGame = ({ updateHistorial }: IMemoryGameeProps) => {
    const [listPokemon, setListPokemon] = useState<PokemonCard[]>([]);
    const [previewSelect, setPreviewSelect] = useState<number>(-1);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [engGameModal, setEngGameModal] = useState<boolean>(false);
    const [inGame, setInGame] = useState<boolean>(false);
    const [errCount, setErrCount] = useState<number>(0);
    const { pipeTimer, startTimer, stopTimer, resetTimer } = useChronometer();

    useEffect(() => {
        if (
            !listPokemon.some(
                (pokemonItem: PokemonCard) => pokemonItem.couplet === false
            ) &&
            listPokemon.length > 0
        ) {
            //si todas las cartas estan volteadas termina el juego y salva el historial
            stopTimer();
            saveHistory();
            setEngGameModal(true);
        }
    }, [listPokemon]);

    //guarda el historial y actualiza la lista del historial
    const saveHistory = async () => {
        const history: History = {
            time: pipeTimer(),
            count_errors: errCount,
        };
        await postHistoryApi(history);
        updateHistorial();
    };

    //inicia el juego
    const startGame = async () => {
        let { data }: { data: ApiPokemon } = await getPokemonsApi();
        let newList = data.results.map(
            (pokemon: PokemonCard, index: number) => ({
                ...pokemon,
                id: index,
                showCard: false,
                couplet: false,
            })
        );
        setListPokemon(
            [...newList, ...newList].sort(
                (pokemon: PokemonCard) => Math.random() - 0.5
            )
        );
        setPreviewSelect(-1);
        setInGame(true);
        startTimer();
    };

    const flipCard = (position: number) => {
        if (listPokemon[position].couplet === true) return;

        if (previewSelect === -1) {
            //si entra es que no tiene una card seleccionada previamente
            setPreviewSelect(position);
            setListPokemon(
                listPokemon.map((pokemonItem: PokemonCard, index) => {
                    if (position === index) {
                        return {
                            ...pokemonItem,
                            showCard: true,
                            couplet: true,
                        };
                    }
                    return pokemonItem;
                })
            );
        } else {
            //si entra es que ya tiene una card seleccionada y voltea la nueva
            setListPokemon(
                listPokemon.map((pokemonItem: PokemonCard, index) => {
                    if (position === index) {
                        return {
                            ...pokemonItem,
                            showCard: true,
                            couplet: true,
                        };
                    }
                    return pokemonItem;
                })
            );
            if (listPokemon[position].id === listPokemon[previewSelect].id) {
                //si entra es que la card seleccionada previamente y la actual son iguales y se dejan abiertas
                setPreviewSelect(-1);
            } else {
                //si entra es que la card seleccionada previamente y la actual son diferentes y se vuelven a voltear y suma un error
                setErrCount(errCount + 1);
                setTimeout(function () {
                    setListPokemon(
                        listPokemon.map((pokemonItem: PokemonCard, index) => {
                            if (position === index || index === previewSelect) {
                                return {
                                    ...pokemonItem,
                                    showCard: false,
                                    couplet: false,
                                };
                            }
                            return pokemonItem;
                        })
                    );
                    setPreviewSelect(-1);
                }, 500);
            }
        }
    };

    //resetea el juego y todos los valores
    const resetGame = async () => {
        setErrCount(0);
        resetTimer();
        setListPokemon([]);
        startGame();
        setShowModal(false);
        setEngGameModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const modalEndGameCancel = () => {
        setEngGameModal(false);
    };

    const resetModal = () => {
        
        if (
            !listPokemon.some(
                (pokemonItem: PokemonCard) => pokemonItem.couplet === false
            ) &&
            listPokemon.length
        ) {
            //resetea el juego y todos los valores sin preguntar
            resetGame();
        } else {
            //pregunta si desea resetear
            setShowModal(true);
        }
    };

    return (
        <>
            <div className="content-game">
                <div className="header">
                    <Button
                        block
                        onClick={() => {
                            inGame ? resetModal() : startGame();
                        }}
                    >
                        {inGame ? "Nuevo juego" : "Iniciar juego"}
                    </Button>
                    <div className="chronometer">
                        <h2>Tiempo - {pipeTimer()}</h2>
                        <h2>Errores: {errCount}</h2>
                    </div>
                </div>
                <Row className="row">
                    {listPokemon.length > 0
                        ? listPokemon.map(
                              (pokemonItem: PokemonCard, position: number) => (
                                  <Col md={4} sm={8} xs={8}>
                                      <Card
                                          img={pokemonItem.url}
                                          showCard={pokemonItem.showCard}
                                          flipCard={flipCard}
                                          id={position}
                                          key={position}
                                      />
                                  </Col>
                              )
                          )
                        : null}
                </Row>
            </div>
            <Modal
                title="Resetear juego"
                visible={showModal}
                onOk={resetGame}
                onCancel={handleCancel}
                okText="Resetear"
                cancelText="Continuar"
            >
                <p>Esta seguro que desea resetear el juego?</p>
            </Modal>
            <Modal
                title="Fin de juego"
                visible={engGameModal}
                onOk={resetGame}
                onCancel={modalEndGameCancel}
                okText="Nuevo juego"
                cancelText="Cancelar"
            >
                <p>Felicitaciones, terminó el juego!!</p>
                <p>
                    Con un tiempo de {pipeTimer()} y {errCount} errores
                </p>
            </Modal>
        </>
    );
};
