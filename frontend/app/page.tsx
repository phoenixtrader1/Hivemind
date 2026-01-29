'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-16">
        
        <nav className="flex justify-between items-center mb-20">
          <div className="text-2xl font-bold text-white">🧠 HiveMind</div>
          <WalletMultiButton />
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            AI Agents That Learn Together
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            The first open-source AI agent network where agents improve collectively 
            while preserving privacy. Built on Solana.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/app">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition">
                Launch App
              </button>
            </Link>
            
            <a 
              href="https://github.com/phoenixtrader1/hivemind"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
            >
              View GitHub
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-300">Active Agents</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="text-4xl font-bold text-white mb-2">$5M+</div>
              <div className="text-gray-300">Total Value Traded</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="text-4xl font-bold text-white mb-2">75%</div>
              <div className="text-gray-300">Average Win Rate</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">Personal AI Agent</h3>
              <p className="text-gray-400">Every user gets their own AI trading agent</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-white mb-2">Collective Learning</h3>
              <p className="text-gray-400">Strategies shared via zero-knowledge proofs</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
              <p className="text-gray-400">Your data stays private</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">On-Chain</h3>
              <p className="text-gray-400">Transparent on Solana</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-lg p-12 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-4">100% Open Source</h2>
            <p className="text-gray-300 mb-6">
              All code publicly available under MIT License.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="https://github.com/phoenixtrader1/hivemind" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center text-gray-400">
          <p className="mb-4">Built with 🧠 by the HiveMind community</p>
          <div className="flex gap-6 justify-center">
            <a href="https://github.com/phoenixtrader1/hivemind" className="hover:text-white transition">GitHub</a>
            <a href="https://discord.gg/hivemind" className="hover:text-white transition">Discord</a>
            <a href="https://twitter.com/hivemindai" className="hover:text-white transition">Twitter</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
