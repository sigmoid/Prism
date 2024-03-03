import React, {useEffect, useState} from 'react';
import TimedButton from './TimedButton';
import Inventory from './Inventory';
import Camp from './Camp'
import Venture from './Venture';
import Dialogue from './Dialogue'
import testMap from '../Map/testMap.json';

const Game = (props) =>{
    const [gameData, setGameData] = useState({
        inventory: [{name:'stick', id:0, burnValue:40}, {name:'stick', id:1, burnValue:40}],
        mapData:[
        ],
        flags:[],
        playerPosition:[9,5],
        fireLevel:100,
        inventoryCapacity: 100,
        currentScreen:'camp'
    });

    const setCurrentScreen = (screen) => {
        setGameData({...gameData, currentScreen:screen});
    }

    const stokeFire = (item) =>{
        setGameData(prevGameData => ({...prevGameData, fireLevel: prevGameData.fireLevel + item.burnValue, inventory: prevGameData.inventory.filter(x => x.id !== item.id)}));
    }

    // Load
    useEffect(()=>{
        setGameData({...gameData, mapData:testMap});        
    },[])

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            setGameData(prevGameData => ({...prevGameData, fireLevel: Math.max(0,prevGameData.fireLevel - 1)}));
        }, 1000);

        return () => clearInterval(intervalId);
    },[]);

    const renderRightSide = () =>{
        if(gameData.currentScreen === 'camp')    
            return (<Camp fireLevel={gameData.fireLevel} gameData={gameData} setGameData={setGameData} setCurrentScreen={setCurrentScreen}/>);
        else if (gameData.currentScreen === 'venture')
            return (<Venture setCurrentScreen={setCurrentScreen} gameData={gameData} setGameData={setGameData}></Venture>);
        else if (gameData.currentScreen === 'dialogue')
            return (<Dialogue gameData={gameData} setGameData={setGameData}></Dialogue>)
    }

    return (
        <div className="main-page-container">
            <div className="m-3 left">
                <Inventory gameData={gameData} canBurn={gameData.currentScreen === "camp"} stokeFire={stokeFire}/>
            </div>
            <div className="m-3 right">
                {renderRightSide()}
            </div>
        </div>
    );
}

export default Game;