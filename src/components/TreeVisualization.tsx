import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw, Play, Pause } from 'lucide-react';

interface TreeNode {
  id: string;
  x: number;
  y: number;
  level: number;
  hash: string;
  children?: string[];
  parent?: string;
  isRoot: boolean;
  isLeaf: boolean;
}

interface TreeEdge {
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const TreeVisualization: React.FC = () => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [edges, setEdges] = useState<TreeEdge[]>([]);
  const [nextLeafCount, setNextLeafCount] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Tree dimensions and layout constants
  const TREE_WIDTH = 800;
  const TREE_HEIGHT = 400;
  const LEVEL_HEIGHT = 60;
  const NODE_SPACING = 80;

  // Calculate node position based on tree structure
  const calculatePosition = (level: number, index: number, totalAtLevel: number): { x: number; y: number } => {
    const y = TREE_HEIGHT - (level * LEVEL_HEIGHT) - 40;
    const totalWidth = Math.max(totalAtLevel * NODE_SPACING, NODE_SPACING);
    const startX = (TREE_WIDTH - totalWidth) / 2;
    const x = startX + (index * (totalWidth / Math.max(totalAtLevel - 1, 1))) + NODE_SPACING / 2;
    
    return { x: Math.max(40, Math.min(x, TREE_WIDTH - 40)), y };
  };

  // Generate a simple hash for visualization
  const generateHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
  };

  // Build tree structure from leaf count
  const buildTree = useCallback((leafCount: number): { nodes: TreeNode[], edges: TreeEdge[] } => {
    if (leafCount === 0) return { nodes: [], edges: [] };

    const newNodes: TreeNode[] = [];
    const newEdges: TreeEdge[] = [];
    let nodeCounter = 0;

    // Create leaves first
    const leaves: TreeNode[] = [];
    for (let i = 0; i < leafCount; i++) {
      const position = calculatePosition(0, i, leafCount);
      const leaf: TreeNode = {
        id: `leaf-${i}`,
        ...position,
        level: 0,
        hash: generateHash(`leaf-${i}-${Date.now()}`),
        isRoot: false,
        isLeaf: true
      };
      leaves.push(leaf);
      newNodes.push(leaf);
    }

    // Build tree bottom-up
    let currentLevel = leaves;
    let level = 1;

    while (currentLevel.length > 1) {
      const nextLevel: TreeNode[] = [];
      
      // Pair up nodes and create parents
      for (let i = 0; i < currentLevel.length; i += 2) {
        const leftChild = currentLevel[i];
        const rightChild = currentLevel[i + 1];
        
        if (rightChild) {
          // Create parent node
          const position = calculatePosition(level, Math.floor(i / 2), Math.ceil(currentLevel.length / 2));
          const parent: TreeNode = {
            id: `node-${nodeCounter++}`,
            ...position,
            level,
            hash: generateHash(`${leftChild.hash}${rightChild.hash}`),
            children: [leftChild.id, rightChild.id],
            isRoot: false,
            isLeaf: false
          };
          
          // Update children to reference parent
          leftChild.parent = parent.id;
          rightChild.parent = parent.id;
          
          nextLevel.push(parent);
          newNodes.push(parent);
          
          // Create edges
          newEdges.push({
            from: parent.id,
            to: leftChild.id,
            x1: parent.x,
            y1: parent.y,
            x2: leftChild.x,
            y2: leftChild.y
          });
          
          newEdges.push({
            from: parent.id,
            to: rightChild.id,
            x1: parent.x,
            y1: parent.y,
            x2: rightChild.x,
            y2: rightChild.y
          });
        } else {
          // Odd node out, promote to next level
          const position = calculatePosition(level, Math.floor(i / 2), Math.ceil(currentLevel.length / 2));
          leftChild.x = position.x;
          leftChild.y = position.y;
          leftChild.level = level;
          nextLevel.push(leftChild);
        }
      }
      
      currentLevel = nextLevel;
      level++;
    }

    // Mark root(s)
    currentLevel.forEach(node => {
      node.isRoot = true;
    });

    return { nodes: newNodes, edges: newEdges };
  }, []);

  // Add a leaf to the tree
  const addLeaf = async () => {
    setIsAnimating(true);
    const { nodes: newNodes, edges: newEdges } = buildTree(nextLeafCount);
    
    // Animate the addition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNodes(newNodes);
    setEdges(newEdges);
    setNextLeafCount(prev => prev + 1);
    setIsAnimating(false);
  };

  // Remove a leaf from the tree
  const removeLeaf = async () => {
    if (nextLeafCount <= 1) return;
    
    setIsAnimating(true);
    const newLeafCount = nextLeafCount - 1;
    const { nodes: newNodes, edges: newEdges } = buildTree(newLeafCount);
    
    // Animate the removal
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNodes(newNodes);
    setEdges(newEdges);
    setNextLeafCount(newLeafCount);
    setIsAnimating(false);
  };

  // Reset the tree
  const resetTree = () => {
    setNodes([]);
    setEdges([]);
    setNextLeafCount(1);
    setSelectedNode(null);
  };

  // Auto-build demonstration
  const [isAutoBuilding, setIsAutoBuilding] = useState(false);
  
  const startAutoDemo = () => {
    setIsAutoBuilding(true);
    setNextLeafCount(1);
    
    const buildStep = (count: number) => {
      if (count > 8 || !isAutoBuilding) {
        setIsAutoBuilding(false);
        return;
      }
      
      const { nodes: newNodes, edges: newEdges } = buildTree(count);
      setNodes(newNodes);
      setEdges(newEdges);
      setNextLeafCount(count + 1);
      
      setTimeout(() => buildStep(count + 1), 1000);
    };
    
    buildStep(1);
  };

  const stopAutoDemo = () => {
    setIsAutoBuilding(false);
  };

  // Initialize with a simple tree
  React.useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = buildTree(4);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNextLeafCount(5);
  }, [buildTree]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={addLeaf}
          disabled={isAnimating || isAutoBuilding}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Leaf
        </button>
        
        <button
          onClick={removeLeaf}
          disabled={isAnimating || isAutoBuilding || nextLeafCount <= 1}
          className="btn-secondary"
        >
          <Minus className="w-4 h-4 mr-2" />
          Remove Leaf
        </button>
        
        <button
          onClick={resetTree}
          disabled={isAnimating || isAutoBuilding}
          className="btn-outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>
        
        <div className="flex items-center space-x-2">
          {!isAutoBuilding ? (
            <button
              onClick={startAutoDemo}
              disabled={isAnimating}
              className="btn-outline"
            >
              <Play className="w-4 h-4 mr-2" />
              Auto Demo
            </button>
          ) : (
            <button
              onClick={stopAutoDemo}
              className="btn-outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Demo
            </button>
          )}
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="card">
        <div className="mb-4 text-center">
          <h4 className="text-lg font-semibold text-gray-50 mb-2">
            Merkle Tree Structure
          </h4>
          <p className="text-sm text-gray-400">
            Leaves: {nextLeafCount - 1} | Levels: {Math.max(0, Math.ceil(Math.log2(nextLeafCount)))} | 
            Total Nodes: {nodes.length}
          </p>
        </div>

        <div className="relative bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          <svg
            width={TREE_WIDTH}
            height={TREE_HEIGHT}
            className="w-full h-auto"
            viewBox={`0 0 ${TREE_WIDTH} ${TREE_HEIGHT}`}
          >
            {/* Edges */}
            <AnimatePresence>
              {edges.map((edge, index) => (
                <motion.line
                  key={`${edge.from}-${edge.to}`}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  className="tree-edge"
                />
              ))}
            </AnimatePresence>

            {/* Nodes */}
            <AnimatePresence>
              {nodes.map((node, index) => (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    className={`transition-all duration-200 ${
                      node.isRoot
                        ? 'fill-bitcoin-500 stroke-bitcoin-400'
                        : node.isLeaf
                        ? 'fill-blue-500/20 stroke-blue-400'
                        : 'fill-green-500/20 stroke-green-400'
                    } ${
                      selectedNode === node.id
                        ? 'stroke-4 drop-shadow-lg'
                        : 'stroke-2'
                    }`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    className="text-xs font-mono fill-gray-200 pointer-events-none"
                  >
                    {node.isLeaf ? 'L' : node.isRoot ? 'R' : 'N'}
                  </text>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-400 mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-400"></div>
                <span className="text-gray-300">Leaf Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-400"></div>
                <span className="text-gray-300">Internal Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-bitcoin-500 border border-bitcoin-400"></div>
                <span className="text-gray-300">Root Node</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Details */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600"
            >
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-gray-50">Node Details</h5>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>{' '}
                        <span className="text-gray-200">
                          {node.isRoot ? 'Root' : node.isLeaf ? 'Leaf' : 'Internal'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Level:</span>{' '}
                        <span className="text-gray-200">{node.level}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Hash:</span>{' '}
                        <span className="font-mono text-bitcoin-400">{node.hash}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TreeVisualization;