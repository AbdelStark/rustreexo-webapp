import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Github, ExternalLink, Heart, Code, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const links = {
    resources: [
      { name: 'Draft BIP Specification', href: '#', external: false },
      { name: 'Utreexo Paper', href: 'https://eprint.iacr.org/2019/611.pdf', external: true },
      { name: 'Python Implementation', href: 'https://github.com/utreexo/pytreexo', external: true },
      { name: 'Go Implementation', href: 'https://github.com/utreexo/utreexo', external: true },
    ],
    technical: [
      { name: 'GitHub Repository', href: 'https://github.com/mit-dci/rustreexo', external: true },
      { name: 'WASM Package', href: '#', external: false },
      { name: 'TypeScript SDK', href: '#', external: false },
      { name: 'API Reference', href: '#', external: false },
    ],
    community: [
      { name: 'Bitcoin Dev Mailing List', href: 'https://lists.linuxfoundation.org/mailman/listinfo/bitcoin-dev', external: true },
      { name: 'Rust Community', href: 'https://www.rust-lang.org/community', external: true },
      { name: 'WebAssembly', href: 'https://webassembly.org/', external: true },
      { name: 'Contribute', href: 'https://github.com/mit-dci/rustreexo/blob/master/CONTRIBUTING.md', external: true },
    ]
  };

  return (
    <footer className="relative bg-slate-900 border-t border-slate-700">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-bitcoin-400 to-bitcoin-600 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-50">Rustreexo</h3>
                <p className="text-xs text-gray-400">WASM Playground</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Implementation of the Utreexo accumulator specification.
              Built with Rust, compiled to WebAssembly.
            </p>
            <div className="flex items-center space-x-3">
              <Code className="w-4 h-4 text-bitcoin-500" />
              <Zap className="w-4 h-4 text-bitcoin-500" />
              <Heart className="w-4 h-4 text-bitcoin-500" />
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-gray-50 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-bitcoin-400 transition-colors text-sm flex items-center"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Technical */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-gray-50 font-semibold mb-4">Technical</h4>
            <ul className="space-y-2">
              {links.technical.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-bitcoin-400 transition-colors text-sm flex items-center"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-gray-50 font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              {links.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-bitcoin-400 transition-colors text-sm flex items-center"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            <p>
              Implementation follows the{' '}
              <a 
                href="https://github.com/utreexo/biptreexo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-bitcoin-400 hover:text-bitcoin-300 underline underline-offset-2 transition-colors"
              >
                draft BIP specification
              </a>.{' '}
              <span className="text-bitcoin-500">Open source</span>{' '}
              under BSD-3-Clause license.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/mit-dci/rustreexo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <div className="text-xs text-gray-500">
              v0.4.0 • {new Date().getFullYear()}
            </div>
          </div>
        </motion.div>

        {/* Bitcoin quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <blockquote className="text-sm italic text-gray-500 max-w-2xl mx-auto">
            "The root problem with conventional currency is all the trust that's required to make it work."
            <footer className="mt-2 text-bitcoin-400">— Satoshi Nakamoto</footer>
          </blockquote>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;