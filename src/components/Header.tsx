import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Github, ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-bitcoin-400 to-bitcoin-600 rounded-lg flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-50">Rustreexo</h1>
              <p className="text-xs text-gray-400">WASM Playground</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#education"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-300 hover:text-bitcoin-400 transition-colors cursor-pointer"
            >
              Learn
            </a>
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-300 hover:text-bitcoin-400 transition-colors cursor-pointer"
            >
              Demo
            </a>
            <a
              href="#visualization"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('visualization')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-300 hover:text-bitcoin-400 transition-colors cursor-pointer"
            >
              Visualize
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/mit-dci/rustreexo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <button className="btn-outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;