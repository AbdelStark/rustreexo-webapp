import { useState } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Shield, Zap } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import AccumulatorDemo from './components/AccumulatorDemo';
import TreeVisualization from './components/TreeVisualization';
import EducationSection from './components/EducationSection';
import Footer from './components/Footer';
import DebugPanel from './components/DebugPanel';

function App() {
  const [activeTab, setActiveTab] = useState<'stump' | 'pollard'>('stump');

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <Hero />
        
        {/* Education Section */}
        <EducationSection />
        
        {/* Interactive Demo Section */}
        <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-bitcoin-500 mr-3" />
                <h2 className="text-4xl font-bold text-gray-50">
                  Interactive Utreexo Demo
                </h2>
              </div>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Interactive demonstration of the Utreexo accumulator operations using a WebAssembly implementation.
                Test addition, proof generation, and verification with both Stump and Pollard variants.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="glass-effect rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('stump')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'stump'
                      ? 'bg-bitcoin-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Stump (Verification)
                </button>
                <button
                  onClick={() => setActiveTab('pollard')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'pollard'
                      ? 'bg-bitcoin-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <TreePine className="w-4 h-4 inline mr-2" />
                  Pollard (Full Accumulator)
                </button>
              </div>
            </div>

            {/* Demo Content */}
            <div className="max-w-5xl mx-auto">
              <AccumulatorDemo activeTab={activeTab} />
            </div>
          </div>
        </section>

        {/* Tree Visualization Section */}
        <section id="visualization" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-6">
                <TreePine className="w-8 h-8 text-bitcoin-500 mr-3" />
                <h2 className="text-4xl font-bold text-gray-50">
                  Binary Tree Visualization
                </h2>
              </div>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Visualization of the Merkle forest structure used by the Utreexo accumulator.
                Shows how elements are positioned according to the binary representation of the leaf count.
              </p>
            </motion.div>

            <TreeVisualization />
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Debug Panel - only in development */}
      {import.meta.env.MODE === 'development' && <DebugPanel />}
    </div>
  );
}

export default App;