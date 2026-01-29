import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'HiveMind - AI Agents with Collective Learning',
  description: 'Open-source AI agent network on Solana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
