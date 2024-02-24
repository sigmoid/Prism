import React, {useEffect, useState} from 'react';
import LinkButton from './LinkButton';

const Inventory = (props) => {
    const {gameData, canBurn, stokeFire} = props;

    const renderInventoryItem = (item) => {
        return (
            <div key={item.id} className="m-2">
                <label>{item.name}</label><LinkButton disabled={!canBurn} onClick={() => stokeFire(item)}>burn</LinkButton>
            </div>
        )
    }

    const renderEncumbrance = () => {
        const inventoryWeight = gameData?.inventory?.reduce((acc, obj) => (obj.weight) ? acc + Number(obj.weight) : acc, 0);
        return (<div>
            <h4>{inventoryWeight}/{gameData.inventoryCapacity}</h4>
        </div>)
    }

    return (
        <div>
            <h3>Inventory</h3>
            {renderEncumbrance()}
            {gameData?.inventory?.map(x => renderInventoryItem(x))}
        </div>

    );
}

export default Inventory;