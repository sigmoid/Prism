import { useEffect, useState } from "react";
import LinkButton from "./LinkButton";

const Dialogue = (props) => {
  const { gameData, setGameData } = props;

  const [dialogueData, setDialogueData] = useState();
  const [currentPromptIdx, setCurrentPromptIdx] = useState();

  useEffect(() => {
    fetch("/Dialogue/" + gameData.dialogueFile + ".json")
      .then((response) => { console.log('resp', response); return response.json();})
      .then((json) => { console.log(json); setDialogueData(json)})
      .catch(console.log('failed to load dialogue file: ' + gameData.dialogueFile));
  }, [gameData.dialogueFile]);
  
  useEffect(() => {
    if(!currentPromptIdx && dialogueData)
        setCurrentPromptIdx(dialogueData[0].id);
  }, [dialogueData])

  const renderResponse = (idx) => {
    if(dialogueData)
    {
        const currentPrompt = dialogueData.find(x => x.id === idx);
        return(<LinkButton onClick={() => setCurrentPromptIdx(currentPrompt.nextPrompt)}>{currentPrompt.text}</LinkButton>);
    }
  } 

  const renderCurrentPromp = () => {
    if(dialogueData && currentPromptIdx)
    {
        const currentPrompt = dialogueData.find(x => x.id === currentPromptIdx);
        return(<div className="text-center">
            <h3>{currentPrompt.text}</h3>
            {currentPrompt.response.map(y => renderResponse(y))}
        </div>);
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      {renderCurrentPromp()}
    </div>
  );
};

export default Dialogue;
