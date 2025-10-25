import type { IEditorView } from "../types/editor.types";
import { EditorLine } from "./editor-line";
import { LineNumber } from "./line-number";
import "./editor.styles.css";
import { Cursor } from "./cursor";

export const Editor: React.FC<IEditorView> = (props) => {
  const { state } = props;

  return (
    <div>
      {state.data.map((item) => {
        return (
          <div key={item.line} className="editor-line">
            <LineNumber number={item.line} />
            <EditorLine text={item.text} />
            {state.cursorPosition.line === item.line && <Cursor />}
          </div>
        );
      })}
    </div>
  );
};
