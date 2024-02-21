import items from 'prism-data/Items'
import {v4 as uuidv4} from 'uuid'

const canCraftRecipe = (recipe, gameData) =>{
    const inventoryCounts = getItemQuantities(gameData);

    for (const item of recipe.ingredients) {
        if (inventoryCounts[item.itemName] === undefined || inventoryCounts[item.itemName] < item.quantity) { 
            return false;
        }
    }

    return true;
}

const craftRecipe = (recipe, gameData, setGameData) => {
    if(!canCraftRecipe(recipe, gameData))
        return;

    let newInventory = [];
    const itemCounts = new Map(recipe.ingredients.map(item => [item.itemName, item.quantity]));


    gameData.inventory.forEach(x => {
        if(itemCounts.has(x.name) && itemCounts.get(x.name) > 0)
        {
            itemCounts.set(x.name, itemCounts.get(x.name) - 1);
        }
        else
        {
            newInventory.push(x);
        }
    });

    const item = items.find(x => x.name === recipe.itemName);
    
    if(item)
    {
        const itemsToAdd = Array.from({length:recipe.quantity}, () =>({
            ...item,
            id: uuidv4()
        }));
        newInventory = [...newInventory, ...itemsToAdd];
    }

    setGameData({...gameData, inventory:newInventory});
}

const getItemQuantities = (gameData) =>
{
    const inventoryCounts = {};

    gameData.inventory.forEach(item => {
        if (inventoryCounts[item.name]) {
            inventoryCounts[item.name]++;
        } else {
            inventoryCounts[item.name] = 1;
        }
    });

    return inventoryCounts;
}

export {canCraftRecipe, craftRecipe}