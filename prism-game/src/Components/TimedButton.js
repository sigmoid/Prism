import React, { useEffect, useState } from 'react';
import LinkButton from './LinkButton';

const TimedButton = ({ children, ...props }) => {
    const { title, onClick, disabled, cooldown } = props;

    const [timer, setTimer] = useState(0);

    const handleClick = (e) => {
        setTimer(Number(cooldown));
        onClick();
    }

    const getTimerDisplay = () => {
        if (timer > 0)
            return (<label>{timer}s</label>);
        return (<></>)
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(prevTimer => Math.max(0, prevTimer - 1));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getDisabled = () => {
        return disabled || timer > 0;
    }
    return (<>
        <LinkButton disabled={getDisabled()} className="btn btn-dark m-2" onClick={handleClick}>{children}</LinkButton>
        {getTimerDisplay()}
    </>);

}

export default TimedButton;