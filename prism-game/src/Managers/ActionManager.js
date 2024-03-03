import items from 'prism-data/Items'
import {v4 as uuidv4} from 'uuid';

const playerHasCapacity = (gameData, newItemWeight) => {
    const inventoryWeight = gameData.inventory.reduce((acc, item) => (item.weight) ? acc + item.weight : acc, 0);

    if (inventoryWeight + newItemWeight > gameData.inventoryCapacity)
        return false;

    return true;
}

const addItem = (itemName, quantity, gameData, setGameData) => {
    const item = items.find(x => x.name === itemName);
    
    if(item && playerHasCapacity(gameData, item.weight))
    {
        const itemsToAdd = Array.from({length:quantity}, () =>({
            ...item,
            id: uuidv4()
        }));
        setGameData(prevGameData => ({...prevGameData, inventory:[...prevGameData.inventory, ...itemsToAdd]}));
        return true;
    }
    return false;
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
            addItem(res.itemName, res.quantity, gameData, setGameData);
        }
        else if(res.type === 'random-item'){
            const totalWeight = res.possibleDrops.reduce((acc, obj) => Number(acc) + Number(obj.probability),0);
            const randomNum = Math.random() * totalWeight;

            let cumulativeProbability = 0;

            for(const obj of res.possibleDrops)
            {
                cumulativeProbability +=  obj.probability;
                if(randomNum <= cumulativeProbability)
                {
                    addItem(obj.itemName, obj.quantity, gameData, setGameData);
                    return;
                }
            }
        }
        else if (res.type === 'dialogue'){
            const dialogueFile = res.filename;
            setGameData({...gameData, currentScreen:'dialogue', dialogueFile:dialogueFile});
        }
    }
}

export {
    performAction,
    isActionAvailable
}