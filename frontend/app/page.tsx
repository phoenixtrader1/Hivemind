'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';  // ← ADD THIS

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
            {/* CHANGE THIS BUTTON ↓ */}
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
