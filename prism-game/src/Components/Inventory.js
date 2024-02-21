import React, {useEffect, useState} from 'react';
import LinkButton from './LinkButton';

const Inventory = (props) => {
    const {inventory, stokeFire} = props;

    const renderInventoryItem = (item) => {
        return (
            <div key={item.id} className="m-2">
                <label>{item.name}</label><LinkButton onClick={() => stokeFire(item)}>burn</LinkButton>
            </div>
        )
    }

    return (
        <div>
            <h3>Inventory</h3>
            {inventory?.map(x => renderInventoryItem(x))}
        </div>

    );
}

export default Inventory;