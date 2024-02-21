import { useEffect, useRef } from 'react';
import fireLogo from '../img/fire.png'
import Inventory from './Inventory';
import LinkButton from './LinkButton';
import { isActionAvailable, performAction } from '../Managers/ActionManager';

import TimedButton from './TimedButton';

const Venture = (props) => {
    const {gameData, setGameData, setCurrentScreen} = props;

    const containerRef = useRef(null);

    useEffect(()=>{
        containerRef.current.focus();
    },[gameData]);
    
    const onKeyDown = (e) => {
        console.log('you bastartd')
        if (e.key === "ArrowUp"){
            e.preventDefault();
            move('n');
        }
        if (e.key === "ArrowDown"){
            e.preventDefault();
            move('s');
        }
        if (e.key === "ArrowRight"){
            e.preventDefault();
            move('e');
        }
        if (e.key === "ArrowLeft"){
            e.preventDefault();
            move('w');
        }
    }

    const move = (direction) =>{
        let xMove = 0;
        let yMove = 0;

        console.log('move', direction);

        if(direction === 'e')
            xMove = 1;
        if(direction === 'w')
            xMove = -1;
        if(direction === 'n')
            yMove = -1;
        if(direction === 's')
            yMove = 1;

        const curPos = gameData.playerPosition;
        const dest = gameData.mapData[curPos[1] + yMove][curPos[0] + xMove];
        console.log('curpos,', curPos, ' dest', dest);

        // Don't let the player move into mountains
        if(dest.tileType === 'Mountain')
            return;

        if(dest.tileType === 'Camp')
            setCurrentScreen('camp');

        setGameData(prevGameData => ({...prevGameData, playerPosition:[prevGameData.playerPosition[0]+xMove, prevGameData.playerPosition[1]+yMove]}));
    }

    const getCurrentTile = () => {
        return gameData.mapData[gameData.playerPosition[1]][gameData.playerPosition[0]];
    }

    const renderMap = () => {

        return (<div className='map-area'>{gameData.mapData.map((row, yIdx) => {
            return (<span>{
                row.map((tile, xIdx) => {
                    if (gameData.playerPosition[0] === xIdx && gameData.playerPosition[1] === yIdx)
                        return '👨';
                    else
                        return (<label className='ms-1'> {tile.visual}</label>);
                })}
                <br />
            </span>);

        })}</div>);
    }

    const renderActions=()=>{
        const currentTile = getCurrentTile();

        if(currentTile.actions)
        {
            return (<div>
                <h5>Actions</h5>
                {currentTile.actions.map(x => (<TimedButton disabled={!isActionAvailable(x, gameData)} key={currentTile.id+x.name+'_btn'} cooldown={x.cooldown} onClick={() => performAction(x, gameData, setGameData)}>{x.name}</TimedButton>))}
            </div>);
        }
    }

    return (
        <div ref={containerRef} className='no-border' onKeyDown={onKeyDown} tabIndex={0}>
            <div><LinkButton onClick={() => { move('n') }}>move up</LinkButton></div>
            <div className="mb-5 mt-5 row align-items-center justify-content-between">
                <div className="col">
                    <div className="float-end">
                        <LinkButton onClick={() => { move('w') }}>move left</LinkButton>
                    </div>
                </div>
                <div className="col">{renderMap()}</div>
                <div className="col">
                    <div className="float-start">
                        <LinkButton onClick={() => { move('e') }}>move right</LinkButton>
                    </div>
                </div>
            </div>
            <div><LinkButton className="mt-4" onClick={() => { move('s') }}>move down</LinkButton></div>
            <h3 className="mt-5">{getCurrentTile().description}</h3>
            <hr />
            {renderActions()}
            
        </div>);
}

export default Venture;