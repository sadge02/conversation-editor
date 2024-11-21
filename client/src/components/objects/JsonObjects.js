"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChoices = GetChoices;
exports.GetCameraSettings = GetCameraSettings;
exports.GetDisplaySettings = GetDisplaySettings;
exports.GetNode = GetNode;
exports.GetTrigger = GetTrigger;
exports.GetCommands = GetCommands;
require("@xyflow/react/dist/style.css");
function GetChoices(numChoices) {
    return Array.from({ length: numChoices }, (_) => ({
        "text": "",
        "display_settings": GetDisplaySettings(),
        "target": "ENTITY",
        "location": { "x": 0, "y": 0, "z": 0 },
        "requirements": [],
        "node": ""
    }));
}
function GetCameraSettings() {
    return {
        "cutscene": "NONE",
        "target": "ENTITY",
        "angle": 0,
        "distance_multiplier": 1.0,
        "height_multiplier": 1.0,
        "zoom": 0
    };
}
function GetDisplaySettings() {
    return {
        "face": "CENTER",
        "shadow": false,
        "alignment": "CENTER",
        "text_opacity": 0,
        "see_through": false,
        "visible": false,
        "glowing": false,
        "scale": 1.0,
        "background": 0,
        "line_width": 100,
        "bind_to_entity": "LOW_ELEVATION",
        "elevation": 0
    };
}
function GetNode(nodeType, numChoices = 0) {
    switch (nodeType) {
        case "TITLE":
            return {
                "title": "",
                "fade_in": 1,
                "fade_out": 1,
                "duration": 5
            };
        case "SUBTITLE":
            return {
                "subtitle": "",
                "fade_in": 1,
                "fade_out": 1,
                "duration": 5
            };
        case "TITLE_SUBTITLE":
            return {
                "title": "",
                "subtitle": "",
                "fade_in": 1,
                "fade_out": 1,
                "duration": 5
            };
        case "INPUT":
            return {
                "text": "",
                "variable": ""
            };
        case "CHOICE":
            return {
                "text": "",
                "target": "ENTITY",
                "location": { "x": 0, "y": 0, "z": 0 },
                "entity": "",
                "display_settings": GetDisplaySettings(),
                "choices": GetChoices(numChoices)
            };
        case "DISPLAY":
            return {
                "text": "",
                "duration": 5,
                "target": "ENTITY",
                "location": { "x": 0, "y": 0, "z": 0 },
                "entity": "",
                "camera_settings": GetCameraSettings(),
                "display_settings": GetDisplaySettings()
            };
        case "CHAT":
            return {
                "text": ""
            };
        case "BOSS_BAR":
            return {
                "text": "",
                "progress": 0,
                "duration": 5
            };
        case "ACTION_BAR":
            return {
                "text": "",
                "duration": 5
            };
    }
    return null;
}
function GetTrigger(trigger) {
    switch (trigger) {
        case "BLOCK":
            return {
                "trigger_type": "BLOCK",
                "action": "INTERACT",
                "location": { "x": 0, "y": 0, "z": 0 },
                "remove": false
            };
        case "ITEM":
            return {
                "trigger_type": "ITEM",
                "action": "USE",
                "name": "",
                "amount": 1,
                "consume": 0
            };
        case "COMMAND":
            return {
                "trigger_type": "COMMAND"
            };
        case "LOCATION":
            return {
                "trigger_type": "LOCATION",
                "location": { "x": 0, "y": 0, "z": 0 },
                "radius": 5
            };
        case "ENTITY":
            return {
                "trigger_type": "ENTITY",
                "action": "INTERACT",
                "entity": ""
            };
        case "ELIMINATE":
            return {
                "trigger_type": "ELIMINATE",
                "eliminate": "ANY",
                "quantity": 1
            };
        case "TIME":
            return {
                "trigger_type": "TIME",
                "delay": 0
            };
        case "INTERACT":
            return {
                "trigger_type": "INTERACT"
            };
    }
    return null;
}
function GetCommands(numCommands) {
    return Array.from({ length: numCommands }, (_) => ({
        "command": "",
        "execute": "START",
        "delay": 0,
        "sender": "CONSOLE"
    }));
}
