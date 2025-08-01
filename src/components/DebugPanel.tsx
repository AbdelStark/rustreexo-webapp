import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import { getLogHistory, clearLogHistory, exportLogs } from '../utils/wasmLogger';

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState(getLogHistory());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Refresh logs periodically
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLogs(getLogHistory());
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleExportLogs = () => {
    const logData = exportLogs();
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rustreexo-wasm-logs-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    clearLogHistory();
    setLogs([]);
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-bitcoin-500 hover:bg-bitcoin-600 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Toggle Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-40 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                  <Bug className="w-5 h-5 mr-2 text-bitcoin-500" />
                  WASM Debug Logs
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ×
                </button>
              </div>
              
              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportLogs}
                  className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </button>
                
                <button
                  onClick={handleClearLogs}
                  className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear
                </button>
                
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                    autoRefresh 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {autoRefresh ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                  Auto Refresh
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                {logs.length} entries • Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No logs yet. Try interacting with the app to see WASM API calls.
                </div>
              ) : (
                logs.slice().reverse().map((log, index) => (
                  <motion.div
                    key={`${log.timestamp}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border text-xs font-mono ${
                      log.error 
                        ? 'bg-red-900/20 border-red-500/30 text-red-400'
                        : 'bg-slate-800 border-slate-600 text-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-bitcoin-400">
                        {log.method}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {log.inputs && log.inputs.length > 0 && (
                      <div className="mb-2">
                        <div className="text-gray-400 text-xs mb-1">Inputs:</div>
                        <div className="bg-slate-900 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.inputs, null, 1)}
                        </div>
                      </div>
                    )}
                    
                    {log.outputs && (
                      <div className="mb-2">
                        <div className="text-gray-400 text-xs mb-1">Outputs:</div>
                        <div className="bg-slate-900 p-2 rounded text-xs overflow-x-auto">
                          {typeof log.outputs === 'string' && log.outputs.length > 100
                            ? `${log.outputs.substring(0, 100)}...`
                            : JSON.stringify(log.outputs, null, 1)
                          }
                        </div>
                      </div>
                    )}
                    
                    {log.error && (
                      <div className="mb-2">
                        <div className="text-red-400 text-xs mb-1">Error:</div>
                        <div className="bg-red-900/30 p-2 rounded text-xs overflow-x-auto text-red-300">
                          {JSON.stringify(log.error, null, 1)}
                        </div>
                      </div>
                    )}
                    
                    {log.duration !== undefined && (
                      <div className="text-gray-500 text-xs">
                        Duration: {log.duration.toFixed(2)}ms
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DebugPanel;