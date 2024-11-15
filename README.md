# Conversation Editor

The Conversation Editor is a web-based application designed to simplify the creation and management of conversations, quests, and storytelling elements for the [Conversation Plugin](https://github.com/sadge02/conversation-plugin) in Minecraft. This tool provides a visual and intuitive interface for designing the dialogue flows, integrating smoothly with the plugin's JSON-based structure.

## Key Features

### 1. Node Creation

* Supports the creation of all combinations of node types and trigger types as defined by the Conversation Plugin.
* Allows for adding multiple commands to nodes or defining multiple options in choice nodes.
* Automatically generates a structured JSON object template compatible with the plugin.

### 2. Edge Creation

* Connects nodes to define the flow of conversations.
* Automatically updates the JSON structure to reflect the connections.
* Supports branching narratives with choice nodes that allow multiple edges (pathways).

### 3. Interactive Canvas

* Built using [React Flow](https://reactflow.dev/), providing a visual interface to manage nodes and edges.
* Drag-and-drop functionality to reposition nodes for better visualization.
* Clear representation of conversation structure.

### 4. Node Editing

* Select any node to view its JSON properties.
* Edit node attributes, including text, triggers, commands, choices, and requirements.
* Save changes to update the conversation structure dynamically.

### 5. Editing Capabilities

* You can add nodes and edges.
* You can remove nodes or edges.
* You can edit and update/save nodes.

### 6. Exporting

* Assign a unique name to the conversation.
* Specify the start node ID and configure conversation settings.
* Export the finalized conversation as a JSON file.
* Place the exported JSON file in the plugin's `conversations` directory.

The Conversation Editor enables seamless creation and management of branching narratives, providing developers with a tool to simplify using the [Conversation Plugin](https://github.com/sadge02/conversation-plugin). Whether designing simple dialogues, conversations, cutscenes, or questlines, this editor bridges the gap between creativity and technical implementation.
