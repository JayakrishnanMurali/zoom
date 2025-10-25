import "./App.css";
import { Editor } from "./core/components/Editor";
import { DUMMY_EDITOR } from "./core/utils/dummy";

function App() {
  return (
    <>
      <main className="main">
        <Editor
          state={DUMMY_EDITOR}
          onKeyDown={() => {
            // TODO
          }}
        />
      </main>
    </>
  );
}

export default App;
