import type { IEditorView } from "../types/editor.types";
import { EditorLine } from "./editor-line";
import { LineNumber } from "./line-number";
import "./editor.styles.css";
import { Cursor } from "./cursor";
import { useEffect } from "react";

export const Editor: React.FC<IEditorView> = (props) => {
  const { state, showLineNumber, onKeyDown } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown(e);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div>
      {state.data.map((item) => {
        return (
          <div key={item.line} className="editor-line">
            {showLineNumber && <LineNumber number={item.line + 1} />}
            <div className="editor-text">
              <EditorLine text={item.text} />
              {state.cursorPosition.line === item.line && <Cursor />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
