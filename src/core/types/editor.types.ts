export type TextBuffer = {
  lineNumber: number;
  lineText: string;
};

export type CursorPosition = {
  line: number;
  column: number;
};

export type Selection = {
  start: CursorPosition;
  end: CursorPosition;
} | null;

export type Metadata = {
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EditorState = {
  totalLines: number;
  data: TextBuffer[];
  cursorPosition: CursorPosition;
  selection: Selection;
  metadata: Metadata;
};
