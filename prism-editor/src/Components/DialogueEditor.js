import { useState, useRef, useEffect } from "react";
import LinkButton from "./LinkButton";
import { v4 as uuidv4 } from "uuid";
import useDebouncedEffect from "use-debounced-effect";
import "react-select-search/style.css";
import { FaClipboardList } from "react-icons/fa";

const DialogueEditor = () => {
  const [conversationData, setConversationData] = useState(null);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(null);

  const inputFile = useRef(null);

  // Save data
  useDebouncedEffect(
    () => {
      if (conversationData) {
        localStorage.setItem(
          "currentConversation",
          JSON.stringify(conversationData)
        );
      }
    },
    1000,
    [conversationData]
  );

  useEffect(()=>{
    if(!conversationData)
    {
        try{
            const data = window.localStorage.getItem('currentConversation')
            setConversationData(JSON.parse(data));
        }
        catch(err)
        {
            
        }
    }
  },[])

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  const exportToJson = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(conversationData),
      fileName: "conversation.json",
      fileType: "text/json",
    });
  };

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setConversationData(JSON.parse(e.target.result));
    };
  };

  const beginEditPrompt = (prompt) => {
    setCurrentPromptIdx(prompt.id);
  };

  const addNewPrompt = (prompt, isNextPrompt) => {
    let newConversationData = conversationData;

    const newPrompt = {
      id: uuidv4(),
      text: "Lorem Ipsum",
      response: [],
      nextPrompt: null,
    };

    newConversationData = [...newConversationData, newPrompt];

    if (prompt && !isNextPrompt) {
      newConversationData = newConversationData.map((x) => {
        return x.id === prompt.id
          ? { ...x, response: [...x.response, newPrompt.id] }
          : x;
      });
    }

    if (prompt && isNextPrompt) {
      newConversationData = newConversationData.map((x) => {
        return x.id === prompt.id ? { ...x, nextPrompt: newPrompt.id } : x;
      });
    }

    setConversationData(newConversationData);
  };

  const clearConversation = () => {
    setConversationData(null);
    setCurrentPromptIdx(null);
  };

  const deletePrompt = (promptToDelete) => {
    if (window.confirm("Are you sure?")) {
      let newConversationData = [];

      for (let prompt of conversationData) {
        const newPrompt = prompt;
        newPrompt.response = newPrompt.response.filter(
          (x) => x !== promptToDelete.id
        );

        if (newPrompt.nextPrompt === promptToDelete.id)
          newPrompt.nextPrompt = null;

        if (newPrompt.id !== promptToDelete.id)
          newConversationData.push(newPrompt);
      }

      setConversationData(newConversationData);
    }
  };

  const removeResponse = (prompt, promptType) => {
    const currentPrompt = conversationData.find(
      (x) => x.id === currentPromptIdx
    );

    if (promptType === "nextPrompt") {
      const newData = conversationData.map((x) =>
        x.nextPrompt === prompt.id ? { ...x, nextPrompt: null } : x
      );
      setConversationData(newData);
    }

    if (promptType === "response") {
      const newResponses = [];

      for (let resp of currentPrompt.response) {
        if (resp !== prompt.id) newResponses.push(resp);
      }

      setConversationData(
        conversationData.map((x) => {
          return x.id === currentPromptIdx
            ? {
                ...x,
                response: newResponses,
              }
            : x;
        })
      );
    }
  };

  const getPrompt = (id) => {
    return conversationData.find((x) => x.id === id);
  };

  const updateCurrentPrompt = (e) => {
    setConversationData((prevConversationData) => {
      return prevConversationData.map((x) =>
        x.id === currentPromptIdx ? { ...x, text: e.target.value } : x
      );
    });
  };

  const addExistingResponse = (responseId) => {
    setConversationData((prev) =>
      prev.map((x) => {
        return x.id === currentPromptIdx
          ? { ...x, response: [...x.response, responseId] }
          : x;
      })
    );
  };

  const addExistingNextPrompt = (promptId) => {
    setConversationData((prev) =>
      prev.map((x) => {
        return x.id === currentPromptIdx ? { ...x, nextPrompt: promptId } : x;
      })
    );
  };

  const renderMenu = () => {
    return (
      <div>
        <h4>Upload File</h4>
        <input
          className="form-control"
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          ref={inputFile}
        ></input>
        <h4>Create New</h4>
        <button className="btn btn-primary" onClick={() => setConversationData([{
            text:"Lorem Ipsum",
            response:[],
            nextPrompt:null,
            id:uuidv4()
        }])}>Create new</button>
      </div>
    );
  };

  const renderPrompts = (inPrompt = false) => {
    return (
      <div>
        {conversationData.map((x) => {
          return renderPrompt(x, inPrompt);
        })}
        <LinkButton onClick={() => addNewPrompt()}>Add New</LinkButton>
      </div>
    );
  };

  const renderPrompt = (prompt, promptType) => {
    return (
      <div key={'render-prompt-' + prompt.id} className="border m-2 rounded">
        <LinkButton onClick={() => beginEditPrompt(prompt)}>
          {prompt.text}
        </LinkButton>
        {promptType ? (
          <LinkButton onClick={() => removeResponse(prompt, promptType)}>
            remove response
          </LinkButton>
        ) : (
          <LinkButton onClick={() => deletePrompt(prompt)}>delete</LinkButton>
        )}
      </div>
    );
  };

  const renderNextPrompt = (currentPrompt) => {
    return (
      <div>
        <h5>next prompt</h5>
        {currentPrompt.nextPrompt ? (
          renderPrompt(getPrompt(currentPrompt.nextPrompt), "nextPrompt")
        ) : (
          <></>
        )}
        <div className="dropdown m-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            add existing next prompt
          </button>
          <div className="dropdown-menu scrollable-dropdown" aria-labelledby="dropdownMenuButton">
            {conversationData.map((x) => {
              return (
                <a
                  key={'existing-prompt-'+x.id}
                  className="dropdown-item"
                  href="#"
                  onClick={() => addExistingNextPrompt(x.id)}
                >
                  {x.text}
                </a>
              );
            })}
          </div>
        </div>
        <LinkButton onClick={() => addNewPrompt(currentPrompt, true)}>
          add new next prompt
        </LinkButton>
      </div>
    );
  };

  const renderResponses = (currentPrompt) => {
    return (
      <div>
        <h5>responses</h5>
        {currentPrompt.response.map((x) => {
          return renderPrompt(getPrompt(x), "response");
        })}

        <div>
          <div className="dropdown m-3">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              add existing response
            </button>
            <div className="dropdown-menu scrollable-dropdown" aria-labelledby="dropdownMenuButton">
              {conversationData.map((x) => {
                return (
                  <a
                    key={'existing-resp-'+x.id}
                    className="dropdown-item"
                    href="#"
                    onClick={() => addExistingResponse(x.id)}
                  >
                    {x.text}
                  </a>
                );
              })}
            </div>
          </div>
          <LinkButton onClick={() => addNewPrompt(currentPrompt)}>
            add new response
          </LinkButton>
        </div>
      </div>
    );
  };

  const renderEditPrompt = () => {
    const currentPrompt = conversationData.find(
      (x) => x.id === currentPromptIdx
    );
    return (
      <div className="mt-5">
        <div>
          <input
            className="form-control"
            onChange={updateCurrentPrompt}
            value={currentPrompt.text}
          ></input>
        </div>
        {renderNextPrompt(currentPrompt)}
        {renderResponses(currentPrompt)}
        <hr />
        <div>
          <LinkButton onClick={() => setCurrentPromptIdx(null)}>
            back to prompts
          </LinkButton>
        </div>
      </div>
    );
  };

  const renderPageContent = () => {
    if (!conversationData) return renderMenu();
    else if (!currentPromptIdx) return renderPrompts();
    else return renderEditPrompt();
  };

  const renderFileIO = () => {
    return (
      <div>
        {conversationData ? (
          <button
            className="btn btn-primary m-2"
            onClick={() => clearConversation()}
          >
            Clear Conversation
          </button>
        ) : (
          <></>
        )}
        {conversationData ? (
          <button className="btn btn-primary m-2" onClick={exportToJson}>
            Download
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <>
      <h1>Dialogue Editor</h1>
      <hr />
      <div className="mt-5 d-flex justify-content-center">
        <div className="w-50">
          {renderFileIO()}
          {renderPageContent()}
        </div>
      </div>
    </>
  );
};

export default DialogueEditor;
