import LinkButton from './LinkButton';
import CraftingRecipes from 'prism-data/CraftingRecipes';
import { canCraftRecipe, craftRecipe } from '../Managers/CratingManager';

const Camp = (props) => {
    const {fireLevel, gameData, setGameData, setCurrentScreen} = props;

    const renderCraftingRecipes = () => {
        return CraftingRecipes.map(x => {
            if(canCraftRecipe(x, gameData))
                return (<LinkButton key={x.itemName} onClick={() => {craftRecipe(x, gameData, setGameData)}}>{x.itemName}</LinkButton>);
            else
               return (<></>)
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