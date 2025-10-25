import { useState } from "react";
import type { CursorDirection, EditorState } from "../types/editor.types";

const INITIAL_STATE: EditorState = {
  cursorPosition: {
    column: 0,
    line: 0,
  },
  selection: null,
  totalLines: 1,
  metadata: null,
  data: [
    {
      line: 0,
      text: "",
    },
  ],
};

export const useEditor = () => {
  const [state, setState] = useState<EditorState>(INITIAL_STATE);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (
      [
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Backspace",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }

    const isPrintableCharacter =
      e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

    switch (e.key) {
      case "Enter":
        handleEnter();
        break;
      case "ArrowRight":
        moveCursor("right");
        break;
      case "ArrowLeft":
        moveCursor("left");
        break;
      case "ArrowUp":
        moveCursor("up");
        break;
      case "ArrowDown":
        moveCursor("down");
        break;
      case "Backspace":
        deleteCharacter();
        break;
      default:
        if (isPrintableCharacter) {
          insertCharacter(e.key);
        }
        break;
    }
  };

  const insertCharacter = (char: string) => {
    setState((prev) => {
      const { line, column } = prev.cursorPosition;
      const currentLine = prev.data[line];

      if (!currentLine) return prev;

      const textLine = currentLine.text;

      const beforeCursor = textLine.slice(0, column);
      const afterCursor = textLine.slice(column);
      const newText = `${beforeCursor}${char}${afterCursor}`;

      const newData = prev.data.map((lineData, idx) =>
        idx === line ? { ...lineData, text: newText } : lineData
      );

      return {
        ...prev,
        data: newData,
        cursorPosition: {
          ...prev.cursorPosition,
          column: column + 1,
        },
      };
    });
  };

  const deleteCharacter = () => {
    setState((prev) => {
      const { line, column } = prev.cursorPosition;

      if (line === 0 && column === 0) return prev;

      const currentLine = prev.data[line];

      if (!currentLine) return prev;

      // Case 1: Cursor is at start of line (merge with previous line)
      if (column === 0) {
        const prevLine = prev.data[line - 1];

        if (!prevLine) return prev;

        const mergedText = prevLine.text + currentLine.text;

        const newData = prev.data
          .filter((_, idx) => idx !== line)
          .map((item, idx) =>
            idx === line - 1
              ? { ...item, text: mergedText }
              : idx > line - 1
              ? { ...item, line: item.line - 1 }
              : item
          );

        return {
          ...prev,
          data: newData,
          totalLines: prev.totalLines - 1,
          cursorPosition: {
            line: line - 1,
            column: prevLine.text.length,
          },
        };
      }

      // Case 2: Delete character before cursor in same line
      const textLine = currentLine.text;
      const beforeCursor = textLine.slice(0, column - 1);
      const afterCursor = textLine.slice(column);
      const newText = beforeCursor + afterCursor;

      const newData = prev.data.map((item, idx) =>
        idx === line ? { ...item, text: newText } : item
      );

      return {
        ...prev,
        data: newData,
        cursorPosition: {
          ...prev.cursorPosition,
          column: column - 1,
        },
      };
    });
  };

  const moveCursor = (dir: CursorDirection) => {
    setState((prev) => {
      const newCursorPos = getCursorPosition(prev, dir);
      return {
        ...prev,
        cursorPosition: newCursorPos,
      };
    });
  };

  const handleEnter = () => {
    setState((prev) => {
      const { line, column } = prev.cursorPosition;
      const currentLine = prev.data[line];

      if (!currentLine) return prev;

      const textLine = currentLine.text;

      const beforeCursor = textLine.slice(0, column);
      const afterCursor = textLine.slice(column);

      const newData = [
        ...prev.data.slice(0, line),
        { ...currentLine, text: beforeCursor },
        { line: line + 1, text: afterCursor },
        ...prev.data.slice(line + 1).map((item) => ({
          ...item,
          line: item.line + 1,
        })),
      ];

      return {
        ...prev,
        data: newData,
        totalLines: prev.totalLines + 1,
        cursorPosition: {
          line: line + 1,
          column: 0,
        },
      };
    });
  };

  const getCursorPosition = (
    currentState: EditorState,
    dir: CursorDirection
  ): EditorState["cursorPosition"] => {
    switch (dir) {
      case "left":
        return handleCursorLeft(currentState);
      case "right":
        return handleCursorRight(currentState);
      case "up":
        return handleCursorUp(currentState);
      case "down":
        return handleCursorDown(currentState);
      default:
        return currentState.cursorPosition;
    }
  };

  const handleCursorDown = (
    currentState: EditorState
  ): EditorState["cursorPosition"] => {
    const { line, column } = currentState.cursorPosition;
    const lastLineIndex = currentState.totalLines - 1;

    if (line === lastLineIndex) {
      return currentState.cursorPosition;
    }

    const nextLine = currentState.data[line + 1];

    if (!nextLine) return currentState.cursorPosition;

    const newColumn = Math.min(column, nextLine.text.length);

    return {
      line: line + 1,
      column: newColumn,
    };
  };

  const handleCursorUp = (
    currentState: EditorState
  ): EditorState["cursorPosition"] => {
    const { line, column } = currentState.cursorPosition;

    if (line === 0) {
      return currentState.cursorPosition;
    }

    const prevLine = currentState.data[line - 1];

    if (!prevLine) return currentState.cursorPosition;

    const newColumn = Math.min(column, prevLine.text.length);

    return {
      line: line - 1,
      column: newColumn,
    };
  };

  const handleCursorLeft = (
    currentState: EditorState
  ): EditorState["cursorPosition"] => {
    const { line, column } = currentState.cursorPosition;

    if (line === 0 && column === 0) {
      return currentState.cursorPosition;
    }

    if (column === 0) {
      const prevLine = currentState.data[line - 1];

      if (!prevLine) return currentState.cursorPosition;

      return {
        line: line - 1,
        column: prevLine.text.length,
      };
    }

    return {
      line,
      column: column - 1,
    };
  };

  const handleCursorRight = (
    currentState: EditorState
  ): EditorState["cursorPosition"] => {
    const { line, column } = currentState.cursorPosition;
    const currentLine = currentState.data[line];

    if (!currentLine) return currentState.cursorPosition;

    const isAtEndOfLine = column === currentLine.text.length;
    const lastLineIndex = currentState.totalLines - 1;

    if (line === lastLineIndex && isAtEndOfLine) {
      return currentState.cursorPosition;
    }

    if (isAtEndOfLine) {
      return {
        line: line + 1,
        column: 0,
      };
    }

    return {
      line,
      column: column + 1,
    };
  };

  return {
    state,
    handleKeyPress,
    insertCharacter,
    deleteCharacter,
    moveCursor,
    handleEnter,
  };
};
