# Text Editor Development Roadmap

**Project**: Building a Simple Text Editor from Scratch
**Architecture**: MVC (Model-View-Controller)
**Tech Stack**: React + TypeScript + Vite
**Goal**: Learn MVC while building a functional notepad-style text editor

---

## Understanding MVC Architecture

### What is MVC?

**MVC** (Model-View-Controller) separates your code into three parts:

- **Model**: Your data and business logic (the text content, cursor position, etc.)
- **View**: What the user sees (the rendered text, UI elements)
- **Controller**: Handles user input and updates the Model

### MVC in React

In React applications, MVC translates to:

- **Model**: State management (your `EditorState`, data structures)
- **View**: React components (JSX/TSX files)
- **Controller**: Event handlers and custom hooks

### The MVC Flow

```
User Input → Controller → Updates Model → View Re-renders
     ↑                                            ↓
     └──────────── User sees changes ─────────────┘
```

### Key Principle

**The View should never directly modify the Model. It always goes through the Controller.**

---

## Phase 1: Core Data Structure (Model)

### What You'll Learn

- Defining your data structure
- Thinking about state management
- TypeScript type definitions

### Tasks

- [x] Create basic `TextBuffer` type
- [x] Create basic `EditorState` type
- [x] Add `CursorPosition` type (line, column)
- [x] Add cursor to `EditorState`
- [x] Add `Selection` type (for future text selection)
- [x] Consider adding metadata (file path, modified status)

### File: `src/core/types/editor.types.ts`

**Concepts**:

- Your `EditorState` is your "Model" - it holds all the data
- Keep it simple: text lines + cursor position + selection
- The model should have NO UI logic, just data

**Example structure to aim for**:

```typescript
export type CursorPosition = {
  line: number;
  column: number;
};

export type Selection = {
  start: CursorPosition;
  end: CursorPosition;
} | null;

export type EditorState = {
  totalLines: number;
  data: TextBuffer[];
  cursor: CursorPosition;
  selection: Selection;
};
```

---

## Phase 2: Build the View (Simple Display)

### What You'll Learn

- Rendering data as UI (the "View" in MVC)
- React component composition
- Displaying state without modifying it

### Tasks

- [x] Create `src/components/Editor.tsx` component
- [x] Render each line from `EditorState.data`
- [x] Display line numbers (optional but helpful)
- [x] Create a cursor component/element
- [x] Style the editor to look like a text area
- [x] Make cursor blink with CSS animation

### File: `src/components/Editor.tsx`

**Concepts**:

- View = React component that displays your model
- Takes state as props, displays it
- Doesn't know HOW to change data, just shows it
- Pure presentation component

**Implementation approach**:

```typescript
// Props: receives state from parent
interface EditorProps {
  state: EditorState;
  onKeyDown: (e: KeyboardEvent) => void;
}

// Render:
// - Map each line to a div
// - Position cursor at correct line/column
// - Focus management for keyboard input
```

### Additional View Components

- [x] Create `src/components/EditorLine.tsx` (renders single line)
- [x] Create `src/components/Cursor.tsx` (blinking cursor)
- [x] Create `src/components/LineNumbers.tsx` (optional)

---

## Phase 3: Build the Controller (Event Handlers)

### What You'll Learn

- Handling user input and updating state
- Custom React hooks
- Event handling in React

### Tasks

- [x] Create `src/hooks/useEditor.ts` custom hook
- [x] Initialize editor state
- [x] Implement `handleKeyPress()` - when user types
- [x] Implement `insertCharacter()` - add character at cursor
- [x] Implement `deleteCharacter()` - remove character (Backspace)
- [-] Implement `moveCursor()` - arrow keys
- [-] Implement `handleEnter()` - create new line

### File: `src/hooks/useEditor.ts`

**Concepts**:

- Controller = logic that updates the Model based on user actions
- In React, this is often a custom hook
- Handles: keyboard events, text insertion, cursor movement
- Returns: state + functions to modify it

**Hook structure**:

```typescript
export function useEditor() {
  const [state, setState] = useState<EditorState>(initialState);

  const insertCharacter = (char: string) => {
    /* ... */
  };
  const deleteCharacter = () => {
    /* ... */
  };
  const moveCursor = (direction: "up" | "down" | "left" | "right") => {
    /* ... */
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    /* ... */
  };

  return {
    state,
    insertCharacter,
    deleteCharacter,
    moveCursor,
    handleKeyPress,
  };
}
```

---

## Phase 4: Connect Everything (MVC in Action)

### What You'll Learn

- How Model, View, and Controller work together
- Component composition in React
- Data flow in MVC

### Tasks

- [x] Update `src/App.tsx` to use `useEditor` hook
- [x] Pass state to Editor component
- [x] Pass event handlers to Editor component
- [x] Set up keyboard event listeners
- [-] Test basic typing functionality
- [-] Test cursor movement

### File: `src/App.tsx`

**The MVC flow**:

1. User types → Controller catches event (`handleKeyPress`)
2. Controller updates → Model (`setState` changes `EditorState`)
3. Model changes → View re-renders (React updates `Editor` component)

**Code structure**:

```typescript
function App() {
  // Controller: useEditor hook manages state and provides functions
  const { state, handleKeyPress } = useEditor();

  return (
    // View: Editor component displays state
    <Editor state={state} onKeyDown={handleKeyPress} />
  );
}
```

---

## Phase 5: Add Basic Features (One at a time)

### What You'll Learn

- Building features incrementally
- Handling edge cases
- Testing and debugging

### Feature 1: Typing Characters

- [ ] Capture keyboard events for printable characters
- [ ] Insert character at cursor position
- [ ] Move cursor forward after insertion
- [ ] Handle typing at end of line
- [ ] Handle typing in middle of line

### Feature 2: Backspace/Delete

- [ ] Implement Backspace (delete before cursor)
- [ ] Implement Delete key (delete after cursor)
- [ ] Handle deleting at start of line (merge with previous)
- [ ] Handle deleting at end of line
- [ ] Prevent deletion when at start of document

### Feature 3: Enter Key (New Lines)

- [ ] Split line at cursor position
- [ ] Create new line
- [ ] Move cursor to start of new line
- [ ] Increment total line count
- [ ] Handle Enter at end of line
- [ ] Handle Enter in middle of line

### Feature 4: Arrow Key Navigation

- [ ] Arrow Left: move cursor left
- [ ] Arrow Right: move cursor right
- [ ] Arrow Up: move cursor to previous line
- [ ] Arrow Down: move cursor to next line
- [ ] Handle boundaries (start/end of line, first/last line)
- [ ] Remember column position when moving up/down

### Feature 5: Home/End Keys

- [ ] Home: jump to start of current line
- [ ] End: jump to end of current line
- [ ] Ctrl+Home: jump to start of document (optional)
- [ ] Ctrl+End: jump to end of document (optional)

---

## Phase 6: Advanced Features (Future)

### Text Selection

- [ ] Track selection start and end
- [ ] Highlight selected text
- [ ] Shift+Arrow keys for selection
- [ ] Mouse-based selection (click and drag)
- [ ] Select all (Ctrl+A)

### Copy/Paste

- [ ] Copy selected text (Ctrl+C)
- [ ] Cut selected text (Ctrl+X)
- [ ] Paste from clipboard (Ctrl+V)
- [ ] Handle clipboard API

### Undo/Redo

- [ ] Maintain history stack
- [ ] Implement undo (Ctrl+Z)
- [ ] Implement redo (Ctrl+Y or Ctrl+Shift+Z)
- [ ] Group typing operations

### File Operations

- [ ] Open file
- [ ] Save file
- [ ] Save as
- [ ] Track modified status
- [ ] Warn on unsaved changes

### Search/Replace

- [ ] Find text (Ctrl+F)
- [ ] Replace text (Ctrl+H)
- [ ] Find next/previous
- [ ] Case-sensitive search
- [ ] Regular expression search (advanced)

### Syntax Highlighting

- [ ] Choose a language (start with simple one)
- [ ] Tokenize text
- [ ] Apply syntax colors
- [ ] Consider using a library (e.g., Prism.js, highlight.js)

### Line Numbers

- [ ] Display line numbers in gutter
- [ ] Sync scroll with editor
- [ ] Highlight current line number

### Additional Polish

- [ ] Tab key support (insert spaces or tab character)
- [ ] Auto-indentation
- [ ] Scroll when cursor goes off-screen
- [ ] Line wrapping toggle
- [ ] Status bar (line, column, file info)
- [ ] Multiple cursors (very advanced)

---

## MVC Checklist for Each Feature

When adding a new feature, ask yourself:

### Model Questions

- [ ] What new data do I need to track?
- [ ] Do I need to update my types?
- [ ] How does this change the state structure?

### View Questions

- [ ] How do I display this to the user?
- [ ] Do I need a new component?
- [ ] What props does my component need?

### Controller Questions

- [ ] What user actions trigger this feature?
- [ ] What functions do I need to handle these actions?
- [ ] How do I update the model in response?

---

## Common Pitfalls to Avoid

1. **Don't mix concerns**

   - Keep view components pure (no state modification)
   - Keep controller logic separate from rendering

2. **Don't mutate state directly**

   - Always use `setState` with new objects
   - Use spread operators or immutability helpers

3. **Handle edge cases**

   - Cursor at boundaries (start/end of line/document)
   - Empty lines
   - Empty document

4. **Keep it simple**
   - Start with the simplest version that works
   - Add complexity incrementally
   - Don't over-engineer early

---

## Progress Tracker

### Overall Progress

- [ ] Phase 1: Core Data Structure (Model) - STARTED
- [ ] Phase 2: Build the View (Simple Display)
- [ ] Phase 3: Build the Controller (Event Handlers)
- [ ] Phase 4: Connect Everything (MVC in Action)
- [ ] Phase 5: Add Basic Features
- [ ] Phase 6: Advanced Features

### Milestones

- [ ] Can display static text
- [ ] Can type and see characters appear
- [ ] Can move cursor with arrow keys
- [ ] Can delete characters
- [ ] Can create new lines
- [ ] Have a functional basic notepad
- [ ] (Optional) Added advanced features

---

## Learning Resources

### MVC Concepts

- Model = "What data do I have?"
- View = "How do I show it?"
- Controller = "How do I change it?"

### React + MVC

- Model = `useState`, data structures, types
- View = JSX components, pure presentation
- Controller = Event handlers, custom hooks, business logic

### Debugging Tips

- Use React DevTools to inspect state
- Console.log state changes in your controller
- Test one feature at a time
- Start simple, add complexity gradually

---

## Notes & Learnings

(Use this section to jot down things you learn along the way)

### Things I learned:

-

### Challenges I faced:

-

### Ideas for future improvements:

- ***

  **Remember**: The goal is to learn MVC architecture while building something functional. Take your time, understand each concept, and don't hesitate to ask questions!

  **Next Step**: Complete the remaining tasks in Phase 1 (add cursor types to `editor.types.ts`)
