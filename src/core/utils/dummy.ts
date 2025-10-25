import type { EditorState } from "../types/editor.types";

export const DUMMY_EDITOR: EditorState = {
  data: [
    {
      line: 1,
      text: "Hello, Jayakrishnan!!",
    },
    {
      line: 2,
      text: "This is a sample text editor.",
    },
    {
      line: 3,
      text: "yea!",
    },
    {
      line: 4,
      text: "",
    },
  ],
  cursorPosition: {
    column: 1,
    line: 1,
  },
  selection: null,
  totalLines: 3,
  metadata: {
    createdAt: new Date(),
    filePath: "/",
    updatedAt: new Date(),
  },
};
