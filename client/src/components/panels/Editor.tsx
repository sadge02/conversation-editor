import React, { useState, useCallback } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectGroup, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Input } from '../ui/input';

import '@xyflow/react/dist/style.css';


const getNodeId = () => `randomnode_${+new Date()}`;

const initialNodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: -50 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 0, y: 50 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Added node' },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <div className='flex flex-row gap-12'>
      <div className='w-[1080px] h-[720px]'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 2 }}
          style={{ backgroundColor: "#F7F9FB" }}
        >
          <Background />
          <Panel position="top-center" className='flex flex-row gap-5'>
            <Input type="text" id="nodeID" placeholder="Node ID" className="w-[175px] h-[40px] bg-black text-white border-black active:scale-95 transition"/>
            <Select>
              <SelectTrigger className="w-[175px] h-[40px] bg-black text-white border-black active:scale-95 transition">
                <SelectValue placeholder="Node Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="TITLE">Title Node</SelectItem>
                  <SelectItem value="SUBTITLE">Subtitle Node</SelectItem>
                  <SelectItem value="TITLE_SUBTITLE">Title Subtitle Node</SelectItem>
                  <SelectItem value="INPUT">Input Node</SelectItem>
                  <SelectItem value="CHOICE">Choice Node</SelectItem>
                  <SelectItem value="DISPLAY">Display Node</SelectItem>
                  <SelectItem value="CHAT">Chat Node</SelectItem>
                  <SelectItem value="BOSS_BAR">Boss Bar Node</SelectItem>
                  <SelectItem value="ACTION_BAR">Action Bar Node</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[175px] h-[40px] bg-black text-white border-black active:scale-95 transition">
                <SelectValue placeholder="Trigger Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="BLOCK">Block Trigger</SelectItem>
                  <SelectItem value="ITEM">Item Trigger</SelectItem>
                  <SelectItem value="COMMAND">Command Trigger</SelectItem>
                  <SelectItem value="LOCATION">Location Trigger</SelectItem>
                  <SelectItem value="ENTITY">Entity Trigger</SelectItem>
                  <SelectItem value="ELIMINATE">Eliminate Trigger</SelectItem>
                  <SelectItem value="TIME">Time Trigger</SelectItem>
                  <SelectItem value="INTERACT">Interact Trigger</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="w-[100px] h-[40px] bg-black text-white border-black active:scale-95 transition" variant="outline" onClick={onAdd}>Add Node</Button>
          </Panel>
        </ReactFlow>
      </div>
      <div className='w-[250px]'>
        <h1 className='text-white'>AAAAAAA</h1>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);
