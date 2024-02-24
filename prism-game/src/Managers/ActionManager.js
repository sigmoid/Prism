import items from 'prism-data/Items'
import {v4 as uuidv4} from 'uuid';

const addItem = (itemName, quantity, setGameData) => {
    const item = items.find(x => x.name === itemName);
    
    if(item)
    {
        const itemsToAdd = Array.from({length:quantity}, () =>({
            ...item,
            id: uuidv4()
        }));
        setGameData(prevGameData => ({...prevGameData, inventory:[...prevGameData.inventory, ...itemsToAdd]}));
    }
}

const isActionAvailable = (action, gameData) => {
    for (const i in action.preconditions) {
        const precondition = action.preconditions[i];

        if (precondition.type === 'item') {
            const foundItemIdx = gameData.inventory.findIndex(x => x.itemType === precondition.itemType && x.wear >= precondition.itemWear);
            if (foundItemIdx === -1){
                return false;
            }
        }
    }
    return true;
}

const checkPrecondition = (precondition, gameData, setGameData) =>
{
    if(precondition.type === 'item')
    {
        const foundItemIdx = gameData.inventory.findIndex(x => x.itemName === precondition.itemName && x.wear >= precondition.itemWear);

        if(foundItemIdx !== -1)
        {
            const newInventory = [...gameData.inventory];
            const itemToUpdate = newInventory[foundItemIdx];

            console.log('aaayyyyy1', itemToUpdate, precondition)

            if(itemToUpdate.wear === precondition.itemWear)
            {
                newInventory.splice(foundItemIdx,1);
            }
            else
            {
                newInventory[foundItemIdx] = {...itemToUpdate, wear: itemToUpdate.wear-1};
            }

            setGameData(prevGameData => ({
                ...prevGameData,
                inventory : newInventory
            }));
        }
        else
        {
            return false;
        }
    }

    return true;
}

const performAction = (action, gameData, setGameData) => {
    // Check preconditions
    for(const idx in action.preconditions)
    {
        if(!checkPrecondition(action.preconditions[idx], gameData, setGameData))
            return;
    }

    // Perform Results
    for (const i in action.results) {
        const res = action.results[i];
        if (res.type === 'item') {
            addItem(res.itemName, res.quantity, setGameData);
        }
    }
}

export {
    performAction,
    isActionAvailable
}