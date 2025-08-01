import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Database, TreePine } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-500/5 via-transparent to-bitcoin-600/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bitcoin-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-effect border border-bitcoin-500/20 text-bitcoin-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Rust Implementation
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-50 mb-6 leading-tight">
              Utreexo{' '}
              <span className="bg-gradient-to-r from-bitcoin-400 to-bitcoin-600 bg-clip-text text-transparent">
                Accumulator
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-400 max-w-4xl mx-auto mb-8 leading-relaxed">
              A dynamic hash-based accumulator for Bitcoin's UTXO set, providing compact representation 
              with logarithmic-sized inclusion proofs. Based on the{' '}
              <a 
                href="https://github.com/utreexo/biptreexo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-bitcoin-400 hover:text-bitcoin-300 underline underline-offset-2 transition-colors"
              >
                draft BIP specification
              </a>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a href="#demo" className="btn-primary text-lg px-8 py-4">
              <TreePine className="w-5 h-5 mr-2" />
              Try Demo
            </a>
            <a href="https://github.com/mit-dci/rustreexo" target="_blank" rel="noopener noreferrer" className="btn-outline text-lg px-8 py-4">
              <Database className="w-5 h-5 mr-2" />
              View Source
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="card text-center">
              <div className="text-3xl font-bold text-bitcoin-500 mb-2">O(log₂ N)</div>
              <div className="text-gray-400">Accumulator Size</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-bitcoin-500 mb-2">SHA512/256</div>
              <div className="text-gray-400">Hash Function</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-bitcoin-500 mb-2">Merkle Forest</div>
              <div className="text-gray-400">Data Structure</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce-subtle"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;