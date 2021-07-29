import React from "react";

export const useChronometer = () => {
    const [time, setTime] = React.useState(0);
    const [timerOn, setTimerOn] = React.useState(false);

    React.useEffect(() => {
        let interval: any = null;

        if (timerOn) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!timerOn) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerOn]);

    const pipeTimer = () => {
        let hour = Math.floor(time / 3600);
        let min = Math.floor((time / 60) % 60);
        let seg = Math.floor(time % 60);

        return `${zeroPad(hour, 2)}:${zeroPad(min, 2)}:${zeroPad(seg, 2)}`;
    };

    const zeroPad = (num: number, places: number) =>
        String(num).padStart(places, "0");

    const startTimer = () => {
        setTimerOn(true);
    };

    const stopTimer = () => {
        setTimerOn(false);
    };

    const resetTimer = () => {
        setTime(0);
    };

    return {
        pipeTimer,
        startTimer,
        stopTimer,
        resetTimer,
    };
};
