import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Shield, TreePine, Hash, Database, CheckCircle } from 'lucide-react';

const EducationSection: React.FC = () => {
  const concepts = [
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Merkle Forest",
      description: "A forest of perfect binary trees, each with 2ⁿ elements. Multiple roots represent different trees in the forest.",
      details: "The number of trees is determined by the binary representation of total elements: each 1-bit corresponds to a tree. Example: 5 elements = trees of size 4+1 = 2 roots."
    },
    {
      icon: <Hash className="w-6 h-6" />,
      title: "Forest Roots",
      description: "Each root hash represents one perfect binary tree in the forest. Multiple roots are normal and expected.",
      details: "The number of roots depends on the total elements: 1→1 root, 2→1 root, 3→2 roots, 4→1 root, 5→2 roots, etc."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Inclusion Proofs",
      description: "Contains target positions and required hashes to verify membership in the accumulator",
      details: "Proofs include target positions (uint64) and proof hashes needed to compute the roots, ordered by node positions."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Three Operations",
      description: "Addition, Verification, and Deletion operations maintain the accumulator state",
      details: "Addition appends leaves, Verification checks inclusion proofs, and Deletion removes elements using valid proofs."
    }
  ];

  const benefits = [
    {
      title: "Compact Representation",
      description: "O(log₂(N)) storage requirement instead of linear UTXO set storage",
      icon: <Database className="w-5 h-5 text-bitcoin-500" />
    },
    {
      title: "Logarithmic Proof Size",
      description: "Inclusion proofs scale logarithmically with the number of elements",
      icon: <Zap className="w-5 h-5 text-bitcoin-500" />
    },
    {
      title: "Efficient Verification",
      description: "Fast proof verification using SHA512/256 hash operations",
      icon: <CheckCircle className="w-5 h-5 text-bitcoin-500" />
    },
    {
      title: "Dynamic Updates",
      description: "Supports addition and deletion operations on the accumulator",
      icon: <Shield className="w-5 h-5 text-bitcoin-500" />
    }
  ];

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-bitcoin-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-50">
              Understanding Utreexo
            </h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A cryptographic data structure that allows compact representation of the UTXO set,
            enabling efficient membership proofs without storing the entire set.
          </p>
        </motion.div>

        {/* Core Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:border-bitcoin-500/30 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-bitcoin-500/10 rounded-lg flex items-center justify-center text-bitcoin-500 group-hover:bg-bitcoin-500/20 transition-colors">
                  {concept.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-50 mb-2">
                    {concept.title}
                  </h3>
                  <p className="text-gray-400 mb-3">
                    {concept.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {concept.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-50 text-center mb-12">
            Technical Properties
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-bitcoin-500/30 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-50 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Implementation Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="card">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-bitcoin-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-50">Stump</h3>
            </div>
            <p className="text-gray-400 mb-4">
              A lightweight implementation that maintains only the accumulator roots and leaf count.
              Can verify inclusion proofs but cannot generate them.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Stores only root hashes and numleaves
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Supports Addition and Verification operations
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Requires external proofs for Deletion
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <TreePine className="w-6 h-6 text-bitcoin-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-50">Pollard</h3>
            </div>
            <p className="text-gray-400 mb-4">
              A full implementation that maintains cached nodes from the Merkle forest,
              enabling proof generation for any cached elements.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Maintains subset of tree nodes
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Can generate inclusion proofs
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Supports all three operations
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;