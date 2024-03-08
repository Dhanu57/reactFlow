import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';
import './TextUpdater.css'
import TextUpdaterNode from './TextUpdaterNode';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  }
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showJson, setShowJson] = useState(true);
  const [json, setJson] = useState()

  const onNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    [],
  );

  const saveAsJSON = () => {
    setShowJson(!showJson)
    const flowchartData = {
      nodes: nodes,
      edges: edges,
    };
    setJson(JSON.stringify(flowchartData, null, 2))

    console.log(JSON.stringify(flowchartData, null, 2));
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      console.log('type', type)

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      console.log('newNode', newNode)

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const nodeTypes = { textUpdater: TextUpdaterNode }

  const onNodesDelete = (nodes) => {
    console.log('Node clicked:', nodes);
  }

  const onNodeMouseEnter = (node) => {
    console.log('Node mouse:', node);
  }

  return (
    <>
      <header>
        <div style={{ display: 'flex', justifyContent: 'center', background: '#F98866' }}>
          <p style={{ flex: 1, fontSize: '20px', fontWeight: 'bold' }}>Flow Converter</p>

          <button onClick={saveAsJSON} className='button'>Covert to JSON</button>

        </div>
      </header>
      <div style={{ flexDirection: 'row', display: 'flex', flex: 1, height: '100%' }}>

        <ReactFlowProvider>
          <Sidebar />
          {showJson && (
            <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: 800 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodesDelete={onNodesDelete}
                onNodeMouseEnter={onNodeMouseEnter}
                fitView
              >
                <Controls />
              </ReactFlow>
            </div>
          )}
          {!showJson && (
            <pre>{json}</pre>
          )}
        </ReactFlowProvider>


      </div>
    </>
  );
};

export default DnDFlow;
