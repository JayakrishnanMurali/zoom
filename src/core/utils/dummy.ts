import type { EditorState } from "../types/editor.types";

export const DUMMY_EDITOR: EditorState = {
  data: [
    {
      line: 0,
      text: "Hello, Jayakrishnan!!",
    },
    {
      line: 1,
      text: "This is a sample text editor.",
    },
    {
      line: 2,
      text: "yea!",
    },
    {
      line: 3,
      text: "",
    },
  ],
  cursorPosition: {
    column: 0,
    line: 0,
  },
  selection: null,
  totalLines: 4,
  metadata: {
    createdAt: new Date(),
    filePath: "/",
    updatedAt: new Date(),
  },
};
