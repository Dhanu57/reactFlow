import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  applyNodeChanges,
  updateNode,
  useUpdateNodeInternals
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';
import './TextUpdater.css'
import TextUpdaterNode from './TextUpdaterNode';

const initialNodes = [
  // {
  //   id: '1',
  //   type: 'input',
  //   data: { label: 'input node' },
  //   position: { x: 250, y: 5 },
  // }
];

let id = 0;
const getId = () => `dndnode_${id++}`;
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showJson, setShowJson] = useState(true);
  const [json, setJson] = useState()

  const [nodeName, setNodeName] = useState('');
  
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [nodeName, setNodes]);

  useEffect(() => {
     nodes.map(ele => {
      if(ele.selected){
        ele.data = {
          ...ele.data,
          label: nodeName,
        };
      }
    })
  }, [nodeName, setNodes]);

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


  const onNodeDoubleClick = (event, node) => {
    console.log('test')
    // const newName = prompt('Enter new name:', node.data.label);
    // if (newName !== null && newName !== '') {
    //   const updatedNode = {
    //     ...node,
    //     data: {
    //       ...node.data,
    //       label: newName,
    //     },
    //   };
    //   // const updatedElements = (nodes, updatedNode);
    //   setNodes(updatedNode);
    // }
  };


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
                fitView
                onNodeDoubleClick={onNodeDoubleClick}
              >
                <div className="updatenode__controls">
                  <label>label:</label>
                  <input
                    value={nodeName}
                    onChange={(evt) => setNodeName(evt.target.value)}
                  />


                </div>

                {/* <Controls /> */}
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
