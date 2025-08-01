# Rustreexo Playground 🌳

An interactive web application for exploring and understanding Utreexo accumulators - a cryptographic data structure that enables compact representation of Bitcoin's UTXO set with logarithmic-sized inclusion proofs.

## 🚀 Live Demo

**[Try it live: rustreexo-playground.starkwarebitcoin.dev](https://rustreexo-playground.starkwarebitcoin.dev/)**

## 📖 What is Utreexo?

Utreexo is a dynamic hash-based accumulator designed for Bitcoin's UTXO (Unspent Transaction Output) set. Instead of storing the entire UTXO set, nodes can maintain a compact accumulator that:

- **Reduces Storage**: From gigabytes to just a few hash values (logarithmic storage)
- **Enables Verification**: Provides cryptographic proofs that elements exist in the set
- **Supports Updates**: Allows adding and removing elements while maintaining integrity
- **Scales Efficiently**: Proof sizes grow logarithmically with the number of elements

### Key Concepts

- **Merkle Forest**: A collection of perfect binary trees representing the UTXO set
- **Multiple Roots**: The number of roots depends on the total elements (e.g., 5 elements = 2 roots)
- **Inclusion Proofs**: Cryptographic evidence that specific UTXOs exist in the accumulator
- **Stump vs Pollard**: Two implementations - lightweight verification vs full accumulator

## ✨ Features

### Interactive Demo
- **Dual Accumulator Types**: Compare Stump (verification-only) and Pollard (full accumulator)
- **Real-time Operations**: Add elements, generate proofs, and verify inclusions
- **Forest Visualization**: See how the Merkle forest structure changes with different element counts
- **Hash Management**: Track added elements and generate proofs only for existing hashes

### Educational Content
- **Concept Explanations**: Learn about Merkle forests, accumulator states, and proof structures
- **Visual Tree Display**: Interactive binary tree visualization showing element positioning
- **Forest Structure**: Understand why multiple roots are normal and expected behavior

### Technical Implementation
- **WebAssembly Integration**: Powered by Rust-based WASM modules for authentic performance
- **Memory Management**: Proper WASM object lifecycle management with cleanup
- **Error Handling**: Robust error handling with user-friendly messages
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **WASM Package**: [@rustreexo/rustreexo-wasm-web](https://www.npmjs.com/package/@rustreexo/rustreexo-wasm-web)

## 🏃‍♂️ Running Locally

### Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** (v1.22 or higher) or **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdelStark/rustreexo-webapp.git
   cd rustreexo-webapp
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint code
yarn lint

# Note: Currently has some linting warnings that don't affect functionality
```

### Build Requirements

The project uses WebAssembly modules that require:
- Modern browser with WASM support
- ES modules support
- Proper CORS headers (handled by Vite dev server)

## 📚 Learn More

### Research & Documentation
- **[Utreexo Paper](https://eprint.iacr.org/2019/611.pdf)**: Original research paper by Thaddeus Dryja
- **[MIT DCI Utreexo](https://github.com/mit-dci/rustreexo/tree/main)**: Rust reference implementation
- **[rustreexo-wasm](https://github.com/AbdelStark/rustreexo-wasm)**: WebAssembly bindings for web applications

## 🎯 Project Structure

```
src/
├── components/           # React components
│   ├── AccumulatorDemo.tsx    # Main interactive demo
│   ├── EducationSection.tsx   # Educational content
│   ├── TreeVisualization.tsx  # Binary tree visualization
│   └── ...
├── utils/               # Utility functions
├── assets/              # Static assets
└── main.tsx            # Application entry point
```

## 🔧 Development

### Forest Structure Logic

The application includes helper functions to calculate and display the Merkle forest structure:

```typescript
// Calculate tree sizes from leaf count
const getForestStructure = (leafCount: number) => {
  // Returns tree count, individual sizes, and explanation
  // Based on binary representation of leaf count
}
```

### WASM Integration

The app uses the official Rustreexo WASM package:

```typescript
import init, { WasmStump, WasmPollard } from '@rustreexo/rustreexo-wasm-web';

// Initialize WASM module
await init();

// Create accumulators
const stump = new WasmStump();
const pollard = new WasmPollard();
```

### Memory Management

Proper cleanup of WASM objects:

```typescript
// Always call .free() when done
stump.free();
pollard.free();
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. **Code Style**: Follow the existing TypeScript/React patterns
2. **Testing**: Test all WASM integrations thoroughly
3. **Documentation**: Update README for new features
4. **Performance**: Be mindful of WASM memory management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/AbdelStark/rustreexo-webapp/issues) page
2. Create a new issue with detailed information
3. Join discussions in the Bitcoin development community

---

**Built with ❤️ for the Bitcoin community**

*This is an educational project to help developers understand Utreexo accumulators. It is not intended for production Bitcoin applications without further security review.*