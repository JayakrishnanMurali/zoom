import "./App.css";
import { Editor } from "./core/components/editor";
import { useEditor } from "./core/hooks/useEditor";

function App() {
  const { state, handleKeyPress } = useEditor();

  return (
    <>
      <main className="main">
        <Editor state={state} showLineNumber onKeyDown={handleKeyPress} />
      </main>
    </>
  );
}

export default App;
