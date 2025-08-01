import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, Hash, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import init, { WasmStump, WasmPollard } from '@rustreexo/rustreexo-wasm-web';

interface AccumulatorDemoProps {
  activeTab: 'stump' | 'pollard';
}

interface AccumulatorState {
  leaves: number;
  roots: string[];
  isLoading: boolean;
  error: string | null;
}

// Utility functions for hash operations
const generateRandomHash = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
};

const isValidHash = (hash: string): boolean => {
  return /^[a-fA-F0-9]{64}$/.test(hash);
};

const AccumulatorDemo: React.FC<AccumulatorDemoProps> = ({ activeTab }) => {
  const [stumpState, setStumpState] = useState<AccumulatorState>({
    leaves: 0,
    roots: [],
    isLoading: false,
    error: null,
  });
  
  const [pollardState, setPollardState] = useState<AccumulatorState>({
    leaves: 0,
    roots: [],
    isLoading: false,
    error: null,
  });

  const [stump, setStump] = useState<WasmStump | null>(null);
  const [pollard, setPollard] = useState<WasmPollard | null>(null);
  const [, setWasmInitialized] = useState(false);
  const [newHashInput, setNewHashInput] = useState('');
  const [proofData, setProofData] = useState<string>('');
  const [proofTargetHash, setProofTargetHash] = useState<string>(''); // Store the hash the proof was generated for
  const [verificationResult, setVerificationResult] = useState<{valid: boolean; error?: string} | null>(null);
  const [addedHashes, setAddedHashes] = useState<string[]>([]); // Track hashes added to the accumulator

  // Initialize WASM and accumulators
  useEffect(() => {
    const initAccumulators = async () => {
      try {
        console.log('🚀 [WASM] Initializing WASM module...');
        
        // Initialize the WASM module first
        await init();
        setWasmInitialized(true);
        console.log('✅ [WASM] WASM module initialized');
        
        console.log('🔧 [WASM] Creating WasmStump instance...');
        const stumpInstance = new WasmStump();
        console.log('✅ [WASM] WasmStump created', {
          leaves: Number(stumpInstance.num_leaves()),
          roots: stumpInstance.roots()
        });
        
        console.log('🔧 [WASM] Creating WasmPollard instance...');
        const pollardInstance = new WasmPollard();
        console.log('✅ [WASM] WasmPollard created', {
          leaves: Number(pollardInstance.num_leaves()),
          roots: pollardInstance.roots()
        });
        
        setStump(stumpInstance);
        setPollard(pollardInstance);
        
        // Initialize states
        const stumpState = {
          leaves: Number(stumpInstance.num_leaves()),
          roots: stumpInstance.roots(),
          isLoading: false,
          error: null
        };
        
        const pollardState = {
          leaves: Number(pollardInstance.num_leaves()),
          roots: pollardInstance.roots(),
          isLoading: false,
          error: null
        };
        
        console.log('📊 [WASM] Initial state:', { stumpState, pollardState });
        
        setStumpState(stumpState);
        setPollardState(pollardState);
      } catch (error) {
        console.error('❌ [WASM] Failed to initialize accumulators:', error);
        console.error('❌ [WASM] Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        setStumpState(prev => ({ ...prev, error: `Initialization failed: ${error}` }));
        setPollardState(prev => ({ ...prev, error: `Initialization failed: ${error}` }));
      }
    };

    initAccumulators();
    
    // Cleanup function
    return () => {
      stump?.free();
      pollard?.free();
    };
  }, []);

  const handleGenerateRandomHash = () => {
    console.log('🎲 [WASM] Generating random hash...');
    const randomHash = generateRandomHash();
    console.log('✅ [WASM] generateRandomHash() -> Success:', randomHash);
    setNewHashInput(randomHash);
  };

  const addToAccumulator = async () => {
    if (!newHashInput.trim() || !isValidHash(newHashInput)) {
      alert('Please enter a valid 64-character hex hash');
      return;
    }

    const setState = activeTab === 'stump' ? setStumpState : setPollardState;
    const accumulator = activeTab === 'stump' ? stump : pollard;

    if (!accumulator) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log(`🔧 [WASM] Adding element to ${activeTab}:`, { hash: newHashInput });
      
      if (activeTab === 'stump' && stump) {
        // Note: Stump accumulators are designed for verification, not direct modification
        // without valid proofs. For demo purposes, we'll show a message about this limitation.
        console.log('⚠️ [WASM] Stump requires valid proofs for modification');
        
        throw new Error(
          'Stump accumulators require valid proofs to add elements. ' +
          'In a real application, you would receive proofs from a full node. ' +
          'For adding elements, please use the Pollard accumulator tab.'
        );
      } else if (activeTab === 'pollard' && pollard) {
        // Pollard can add elements directly
        const emptyProof = JSON.stringify({ targets: [], proof: [], hashes: [] });
        console.log('🔧 [WASM] Calling pollard.modify() with hash:', newHashInput);
        
        const additions = [{ hash: newHashInput, remember: true }];
        pollard.modify(emptyProof, JSON.stringify(additions), []);
        
        const newState = {
          leaves: Number(pollard.num_leaves()),
          roots: pollard.roots(),
          isLoading: false,
          error: null
        };
        
        console.log('✅ [WASM] pollard.modify() -> Success. New state:', newState);
        setPollardState(newState);
        
        // Track the added hash
        setAddedHashes(prev => [...prev, newHashInput]);
      }

      setNewHashInput('');
    } catch (error) {
      console.error(`❌ [WASM] Failed to add element to ${activeTab}:`, error);
      console.error('❌ [WASM] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        input: newHashInput
      });
      
      if (activeTab === 'stump') {
        setStumpState(prev => ({ ...prev, isLoading: false, error: `Failed to add: ${error}` }));
      } else {
        setPollardState(prev => ({ ...prev, isLoading: false, error: `Failed to add: ${error}` }));
      }
    }
  };

  const resetAccumulator = async () => {
    console.log(`🔄 [WASM] Resetting ${activeTab} accumulator...`);
    
    if (activeTab === 'stump') {
      setStumpState(prev => ({ ...prev, isLoading: true, error: null }));
    } else {
      setPollardState(prev => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      if (activeTab === 'stump') {
        console.log('🔧 [WASM] Creating new WasmStump instance...');
        if (stump) stump.free(); // Clean up old instance
        const newStump = new WasmStump();
        
        const newState = {
          leaves: Number(newStump.num_leaves()),
          roots: newStump.roots(),
          isLoading: false,
          error: null
        };
        
        console.log('✅ [WASM] WasmStump created. New state:', newState);
        setStump(newStump);
        setStumpState(newState);
      } else {
        console.log('🔧 [WASM] Creating new WasmPollard instance...');
        if (pollard) pollard.free(); // Clean up old instance
        const newPollard = new WasmPollard();
        
        const newState = {
          leaves: Number(newPollard.num_leaves()),
          roots: newPollard.roots(),
          isLoading: false,
          error: null
        };
        
        console.log('✅ [WASM] WasmPollard created. New state:', newState);
        setPollard(newPollard);
        setPollardState(newState);
      }
      
      console.log('🗑️ [WASM] Clearing proof data and verification results');
      setProofData('');
      setVerificationResult(null);
      setAddedHashes([]); // Clear tracked hashes
    } catch (error) {
      console.error(`❌ [WASM] Failed to reset ${activeTab}:`, error);
      console.error('❌ [WASM] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (activeTab === 'stump') {
        setStumpState(prev => ({ ...prev, isLoading: false, error: `Failed to reset: ${error}` }));
      } else {
        setPollardState(prev => ({ ...prev, isLoading: false, error: `Failed to reset: ${error}` }));
      }
    }
  };

  const generateProof = async () => {
    console.log('🔍 [WASM] Generating proof...');
    
    if (activeTab !== 'pollard' || !pollard) {
      console.warn('⚠️ [WASM] Proof generation only available for Pollard accumulator');
      alert('Proof generation is only available for Pollard accumulator');
      return;
    }

    console.log('🔧 [WASM] Added hashes available for proof generation:', addedHashes);
    
    if (addedHashes.length === 0) {
      console.warn('⚠️ [WASM] No elements in accumulator for proof generation');
      alert('No elements have been added to the accumulator. Please add some elements first.');
      return;
    }

    setPollardState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Generate proof for a specific hash or all roots
      let targetHash: string;
      let proof: string;
      
      if (newHashInput.trim() && isValidHash(newHashInput) && addedHashes.includes(newHashInput)) {
        // Generate proof for the specified hash if it exists in the accumulator
        targetHash = newHashInput;
        console.log('🔧 [WASM] Calling pollard.prove_single() for specified hash:', targetHash);
        proof = pollard.prove_single(targetHash);
      } else if (newHashInput.trim() && isValidHash(newHashInput) && !addedHashes.includes(newHashInput)) {
        // Hash is valid but not in accumulator
        console.warn('⚠️ [WASM] Hash not found in accumulator:', newHashInput);
        alert(`The hash ${newHashInput.substring(0, 8)}... is not in the accumulator. Please add it first or select a different hash.`);
        setPollardState(prev => ({ ...prev, isLoading: false }));
        return;
      } else {
        // Generate proof for the first added element
        targetHash = addedHashes[0];
        console.log('🔧 [WASM] Calling pollard.prove_single() for first added hash:', targetHash);
        proof = pollard.prove_single(targetHash);
      }
      
      console.log('✅ [WASM] pollard.prove_single() -> Success:', {
        targetHash,
        proofLength: proof.length,
        proofPreview: proof.substring(0, 100) + (proof.length > 100 ? '...' : '')
      });
      
      setProofData(proof);
      setProofTargetHash(targetHash); // Store the target hash for verification
      setPollardState(prev => ({ ...prev, isLoading: false }));
      
      alert(`Proof generated for hash: ${targetHash.substring(0, 8)}...${targetHash.substring(56)}`);
    } catch (error) {
      console.error('❌ [WASM] Proof generation failed:', error);
      console.error('❌ [WASM] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        targetHash: newHashInput.trim() || 'first root',
        rootsAvailable: pollard?.roots().length || 0
      });
      
      setPollardState(prev => ({ ...prev, isLoading: false, error: `Proof generation failed: ${error}` }));
      setProofData(`Error: ${error}`);
      setProofTargetHash(''); // Clear target hash on error
    }
  };

  const verifyProof = async () => {
    console.log('✅ [WASM] Verifying proof...');
    
    if (!proofData.trim()) {
      console.warn('⚠️ [WASM] No proof data provided for verification');
      alert('Please provide proof data to verify');
      return;
    }

    const accumulator = activeTab === 'stump' ? stump : pollard;
    if (!accumulator) {
      console.error('❌ [WASM] No accumulator instance available for verification');
      return;
    }
    
    console.log('🔧 [WASM] Using accumulator:', activeTab);
    console.log('🔧 [WASM] Proof data length:', proofData.length);

    try {
      // Determine target hashes for verification
      let targetHashes: string[] = [];
      
      // First priority: use the stored target hash from proof generation
      if (proofTargetHash && isValidHash(proofTargetHash)) {
        targetHashes = [proofTargetHash];
        console.log('🔧 [WASM] Using stored target hash from proof generation:', proofTargetHash);
      }
      // Second priority: use input hash if provided
      else if (newHashInput.trim() && isValidHash(newHashInput)) {
        targetHashes = [newHashInput];
        console.log('🔧 [WASM] Using input hash as target:', newHashInput);
      } 
      // Last resort: use one of the accumulator roots
      else {
        const roots = accumulator.roots();
        console.log('🔧 [WASM] Current accumulator roots:', roots);
        
        if (roots.length > 0) {
          targetHashes = [roots[0]];
          console.log('🔧 [WASM] Using first root as target:', roots[0]);
        } else {
          console.error('❌ [WASM] No target hashes available for verification');
          setVerificationResult({ valid: false, error: 'No target hashes available for verification' });
          return;
        }
      }
      
      console.log('🔧 [WASM] Calling accumulator.verify() with:', {
        proofDataLength: proofData.length,
        targetHashes,
        accumulatorType: activeTab
      });

      const result = accumulator.verify(proofData, targetHashes);
      const verificationResult = { valid: result, error: result ? undefined : 'Proof verification failed' };
      
      console.log('✅ [WASM] accumulator.verify() -> Result:', verificationResult);
      setVerificationResult(verificationResult);
    } catch (error) {
      console.error('❌ [WASM] Proof verification failed:', error);
      console.error('❌ [WASM] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        proofDataLength: proofData.length,
        inputHash: newHashInput,
        accumulatorType: activeTab
      });
      
      setVerificationResult({ valid: false, error: `Verification failed: ${error}` });
    }
  };

  const copyToClipboard = (text: string) => {
    console.log('📋 [WASM] Copying to clipboard:', { 
      textLength: text.length, 
      preview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
    });
    navigator.clipboard.writeText(text).then(() => {
      console.log('✅ [WASM] Successfully copied to clipboard');
    }).catch((error) => {
      console.error('❌ [WASM] Failed to copy to clipboard:', error);
    });
  };

  const currentState = activeTab === 'stump' ? stumpState : pollardState;
  
  // Log tab changes for debugging
  useEffect(() => {
    console.log(`🔄 [WASM] Switched to ${activeTab} tab`, {
      state: currentState,
      hasAccumulator: activeTab === 'stump' ? !!stump : !!pollard
    });
  }, [activeTab]);
  
  // Log input validation
  useEffect(() => {
    if (newHashInput.trim()) {
      const valid = isValidHash(newHashInput);
      console.log('🔍 [WASM] Hash input validation:', {
        input: newHashInput,
        isValid: valid,
        length: newHashInput.length
      });
    }
  }, [newHashInput]);
  
  // Log proof data changes
  useEffect(() => {
    if (proofData.trim()) {
      console.log('📄 [WASM] Proof data updated:', {
        length: proofData.length,
        preview: proofData.substring(0, 100) + (proofData.length > 100 ? '...' : ''),
        isValidJSON: (() => {
          try {
            JSON.parse(proofData);
            return true;
          } catch {
            return false;
          }
        })()
      });
    }
  }, [proofData]);
  
  // Log verification results
  useEffect(() => {
    if (verificationResult) {
      console.log('✅ [WASM] Verification result updated:', verificationResult);
    }
  }, [verificationResult]);

  return (
    <div className="space-y-8">
      {/* Accumulator State Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-50">
            {activeTab === 'stump' ? 'Stump' : 'Pollard'} State
          </h3>
          <button
            onClick={resetAccumulator}
            disabled={currentState.isLoading}
            className="btn-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${currentState.isLoading ? 'animate-spin' : ''}`} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Leaf Count</div>
              <div className="text-2xl font-mono text-bitcoin-400">{currentState.leaves}</div>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Root Count</div>
              <div className="text-2xl font-mono text-bitcoin-400">{currentState.roots.length}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-400 mb-2">Root Hashes</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {currentState.roots.length > 0 ? (
                currentState.roots.map((root, index) => (
                  <div key={index} className="hash-display group cursor-pointer" onClick={() => copyToClipboard(root)}>
                    <div className="flex items-center justify-between">
                      <span className="truncate">{root}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm italic">No roots (empty accumulator)</div>
              )}
            </div>
          </div>
        </div>

        {currentState.error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {currentState.error}
          </div>
        )}
      </motion.div>

      {/* Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Operation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <h4 className="text-xl font-semibold text-gray-50 mb-4">
            {activeTab === 'stump' ? 'Stump Operations' : 'Add Elements'}
          </h4>
          
          <div className="space-y-4">
            {activeTab === 'stump' ? (
              // Stump-specific UI
              <div className="space-y-4">
                <div className="p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-yellow-400 font-medium mb-1">Stump Design</h5>
                      <p className="text-yellow-200 text-sm">
                        Stump accumulators are <strong>lightweight</strong> and designed for <strong>proof verification only</strong>. 
                        They store only the accumulator roots and can verify proofs efficiently with minimal memory usage.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-bitcoin-500/30 bg-bitcoin-500/10 rounded-lg">
                  <h5 className="text-bitcoin-400 font-medium mb-2">Demo Workflow:</h5>
                  <ol className="text-bitcoin-200 text-sm space-y-1 list-decimal list-inside">
                    <li>Switch to <strong>Pollard</strong> tab to add elements</li>
                    <li>Use <strong>Generate Proof</strong> to create a proof</li>
                    <li>Return to <strong>Stump</strong> tab</li>
                    <li>Paste the proof in the verification section</li>
                    <li>Click <strong>Verify Proof</strong> to validate</li>
                  </ol>
                </div>
              </div>
            ) : (
              // Pollard-specific UI
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Hash (32 bytes hex)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newHashInput}
                      onChange={(e) => setNewHashInput(e.target.value)}
                      placeholder="Enter 64-character hex hash..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 text-sm font-mono focus:outline-none focus:border-bitcoin-500"
                    />
                    <button
                      onClick={handleGenerateRandomHash}
                      className="btn-secondary whitespace-nowrap"
                    >
                      <Hash className="w-4 h-4 mr-1" />
                      Random
                    </button>
                  </div>
                  {newHashInput && !isValidHash(newHashInput) && (
                    <div className="text-red-400 text-xs mt-1">Invalid hash format</div>
                  )}
                </div>

                <button
                  onClick={addToAccumulator}
                  disabled={currentState.isLoading || !newHashInput.trim() || !isValidHash(newHashInput)}
                  className="btn-primary w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Pollard
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Proof Operations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <h4 className="text-xl font-semibold text-gray-50 mb-4">Proof Operations</h4>
          
          <div className="space-y-4">
            {activeTab === 'pollard' && (
              <div className="space-y-4">
                <button
                  onClick={generateProof}
                  disabled={pollardState.isLoading || addedHashes.length === 0}
                  className="btn-outline w-full"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Generate Proof
                </button>
                <div className="text-xs text-gray-500">
                  {newHashInput.trim() && isValidHash(newHashInput) 
                    ? addedHashes.includes(newHashInput)
                      ? `Will generate proof for: ${newHashInput.substring(0, 8)}...`
                      : `Hash ${newHashInput.substring(0, 8)}... is not in accumulator`
                    : addedHashes.length > 0
                      ? `Will generate proof for first added element: ${addedHashes[0].substring(0, 8)}...`
                      : 'No elements available for proof generation'
                  }
                </div>
                
                {addedHashes.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Available for proof generation:</div>
                    <div className="max-h-20 overflow-y-auto space-y-1">
                      {addedHashes.map((hash, index) => (
                        <div 
                          key={index} 
                          className="text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-300 truncate"
                          onClick={() => setNewHashInput(hash)}
                          title={hash}
                        >
                          {hash.substring(0, 16)}...{hash.substring(48)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Proof Data (JSON)</label>
              <textarea
                value={proofData}
                onChange={(e) => setProofData(e.target.value)}
                placeholder="Paste proof data here or generate one..."
                className="w-full h-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 text-xs font-mono resize-none focus:outline-none focus:border-bitcoin-500"
              />
            </div>

            <button
              onClick={verifyProof}
              disabled={!proofData.trim()}
              className="btn-primary w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify Proof
            </button>

            <AnimatePresence>
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-lg border ${
                    verificationResult.valid
                      ? 'bg-green-900/20 border-green-500/30 text-green-400'
                      : 'bg-red-900/20 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-center">
                    {verificationResult.valid ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">
                      {verificationResult.valid ? 'Proof is valid!' : `Invalid proof: ${verificationResult.error}`}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccumulatorDemo;