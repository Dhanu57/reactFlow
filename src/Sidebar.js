import React from 'react';
import TextUpdaterNode from './TextUpdaterNode';

export default () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">You can drag these nodes to the pane on the right.</div>
            <>
                <div style={{ height: '50px', width: '100px', border: '1px solid #0041d0', borderRadius: '30px' }} onDragStart={(event) => onDragStart(event, 'terminal')} draggable>
                </div>
                <p style={{ marginBottom: '10px', paddingLeft: '25px' }}>Terminal</p>
            </>
            <>
                <div style={{ borderRadius: '50%', height: '100px', width: '100px', border: '1px solid #0041d0' }} onDragStart={(event) => onDragStart(event, 'reference')} draggable>
                </div>
                <p style={{ marginBottom: '10px', paddingLeft: '8px' }}> On-page reference</p>
            </>
            <>
                <div style={{ height: '50px', width: '100px', border: '1px solid #0041d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onDragStart={(event) => onDragStart(event, 'process')} draggable>
                </div>
                <p style={{ marginBottom: '10px', paddingLeft: '25px' }}>Process</p>
            </>
            <>
                <div style={{ transform: 'skew(20deg)', height: '50px', width: '100px', border: '1px solid #0041d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onDragStart={(event) => onDragStart(event, 'input/output')} draggable>
                </div>
                <p style={{ marginBottom: '25px', paddingLeft: '25px' }}>Input/Output</p>
            </>
            <div onDragStart={(event) => onDragStart(event, 'Desicion')} draggable>
              
                <div style={{
                    height: '60px', textalign: 'center', transform: 'rotate(45deg)', width: '60px', border: '1px solid #0041d0'
                }}>
                  
                </div>
                <p style={{ marginBottom: '10px' }}>Desicion Symbol</p>
            </div>

        </aside>
    );
};
