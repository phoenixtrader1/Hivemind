'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12">
          <Link href="/">
            <div className="text-2xl font-bold text-white cursor-pointer hover:text-purple-300 transition">
              🧠 HiveMind
            </div>
          </Link>
          <WalletMultiButton />
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">AI Agent Dashboard</h1>
          <p className="text-xl text-gray-300">Manage your AI agents and view collective learning insights</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Your AI Agent Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🤖</div>
              <div>
                <h3 className="text-2xl font-bold text-white">Your AI Agent</h3>
                <p className="text-green-400 text-sm">● Active</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">Personal AI trading agent learning from the network</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Win Rate:</span>
                <span className="text-white font-semibold">75%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Trades:</span>
                <span className="text-white font-semibold">1,234</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
              Configure Agent
            </button>
          </div>

          {/* Collective Learning Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🧠</div>
              <div>
                <h3 className="text-2xl font-bold text-white">Network</h3>
                <p className="text-blue-400 text-sm">● Learning</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">Collective intelligence from 10,000+ agents</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Agents:</span>
                <span className="text-white font-semibold">10,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shared Strategies:</span>
                <span className="text-white font-semibold">5,432</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              View Insights
            </button>
          </div>

          {/* Performance Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-green-500/50 transition">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">📊</div>
              <div>
                <h3 className="text-2xl font-bold text-white">Performance</h3>
                <p className="text-green-400 text-sm">↗ Trending Up</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">Your portfolio and trading analytics</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Value:</span>
                <span className="text-white font-semibold">$12,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">24h Change:</span>
                <span className="text-green-400 font-semibold">+$245 (2.0%)</span>
              </div>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
              View Analytics
            </button>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <p className="text-white font-semibold">Successful Trade</p>
                  <p className="text-gray-400 text-sm">SOL/USDC - +2.5%</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">2 hours ago</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🧠</div>
                <div>
                  <p className="text-white font-semibold">Learned New Strategy</p>
                  <p className="text-gray-400 text-sm">From network consensus</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">5 hours ago</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🔒</div>
                <div>
                  <p className="text-white font-semibold">Privacy Update</p>
                  <p className="text-gray-400 text-sm">Zero-knowledge proof verified</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">1 day ago</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🚀 Full Features Coming Soon</h2>
          <p className="text-gray-300 mb-4">
            Backend API with PostgreSQL is currently being deployed. 
            Full AI agent management, real-time trading, and collective learning features will be available once integration is complete.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <a 
              href="https://github.com/phoenixtrader1/hivemind" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              View Source Code
            </a>
            <Link href="/">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition border border-white/20">
                Back to Home
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
