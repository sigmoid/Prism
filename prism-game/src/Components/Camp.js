import LinkButton from './LinkButton';
import CraftingRecipes from 'prism-data/CraftingRecipes';
import { canCraftRecipe, craftRecipe } from '../Managers/CratingManager';

const Camp = (props) => {
    const {fireLevel, gameData, setGameData, setCurrentScreen} = props;

    const renderCraftingRecipes = () => {
        
        return CraftingRecipes.map(x => {
            if(x.prerequisites.length === 0 || x.prerequisites.every((prereq => {return gameData.flags.includes(prereq)})))
                return (<div>
                    <LinkButton disabled={!canCraftRecipe(x, gameData)} key={x.itemName} onClick={() => { craftRecipe(x, gameData, setGameData) }}>{x.itemName}</LinkButton>
                    {x.ingredients.map(item => {return(<label className="ms-2" key={item.itemName + x.itemName}>({item.itemName + ' ' + item.quantity})</label>)})}
                </div>);
        });
    }

    return (
        <div>
            <label>fire:</label>
            <label>{fireLevel}</label>
            <LinkButton onClick={() => {setCurrentScreen('venture')}}>venture out</LinkButton>
            <h3 className="m-5">Crafting</h3>
            {renderCraftingRecipes()}
        </div>);
}

export default Camp;