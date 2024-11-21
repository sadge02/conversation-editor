import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Background,
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    Handle,
    Position,
    useUpdateNodeInternals
} from "@xyflow/react";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectGroup, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Input } from "../ui/input";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { toast } from "sonner";
import { NodeType } from "../types/NodeType";

import "@xyflow/react/dist/style.css";
import { AlignRight } from "lucide-react";
import { get } from "http";

export function GetChoices(numChoices: number) {
    return Array.from({ length: numChoices }, (_, index) => ({
        "text": "",
        "display_settings": getDisplaySettings(),
        "target": "ENTITY",
        "location": { "x": 0, "y": 0, "z": 0 },
        "requirements": [],
        "node": ""
    }));
}

export function GetCameraSettings() {
    return {
        "cutscene": "NONE",
        "target": "ENTITY",
        "angle": 0,
        "distance_multiplier": 1.0,
        "height_multiplier": 1.0,
        "zoom": 0
    };
}

export function GetDisplaySettings() {
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

export function GetNode(nodeType: string, numChoices: number = 0) {
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

export function GetTrigger(trigger: string) {
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

export function GetCommands(numCommands: number) {
    return Array.from({ length: numCommands }, (_, index) => ({
        "command": "",
        "execute": "START",
        "delay": 0,
        "sender": "CONSOLE"
    }));
}