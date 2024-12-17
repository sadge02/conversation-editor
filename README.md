# Conversation Editor

The Conversation Editor is a web-based application designed to simplify the creation and management of conversations, quests, and storytelling elements for the [Conversation Plugin](https://github.com/sadge02/conversation-plugin) in Minecraft. This tool provides an intuitive visual interface for designing the dialogue flow.

## Key Features

### 1. Nodes

* Supports the creation of all combinations of *node types* and *trigger types* as defined in the *Conversation Plugin*.
* Allows for adding multiple commands to nodes or defining multiple options with the *Choice Node* type.

### 2. Edge Creation

* Connect nodes to define the flow of conversations.
* Automatically updates the JSON structure to reflect the connections.
* Supports branching narratives (*Choice Nodes*).

### 3. Interactive Canvas

* Built using [React Flow](https://reactflow.dev/) and provides a visual interface to manage nodes and edges.
* The ability to reposition nodes for better visualization.
* Ability to create edges by dragging the individual handles of the nodes.
* Clear representation of the conversation structure and flow.

### 4. Node Editing

* Select any node to view its JSON properties.
* Edit node attributes on the left side panel.
* Changes are automatically saved.

### 5. Editing Capabilities

* You can add nodes and edges.
* You can remove nodes and edges.
* You can edit nodes.

### 6. Exporting

* Exports structured JSON conversation compatible with the *Conversation Plugin*.
* Assign a unique name to the conversation.
* Specify the start node ID and configure conversation settings.
* Pick the conversation settings.
* Export the finalized conversation as a JSON file.
* Place the exported JSON file in the plugin's `ConversationPlugin` directory.

### 7. Importing

* Pick a conversation file.
* Click the *Import* button.
* Be careful as importing clears your work on the canvas.

The *Conversation Editor* enables seamless creation and management of branching narratives, providing developers with a tool to simplify the use of the [Conversation Plugin](https://github.com/sadge02/conversation-plugin). Whether designing simple dialogues, conversations, cutscenes, or questlines, this editor bridges the gap between creativity and technical implementation.
