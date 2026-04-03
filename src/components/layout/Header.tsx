import React from 'react';
import { Menu } from 'lucide-react';
import { subscriptionStore } from '../../store/subscription';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="菜单"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      <h1 className="flex-1 text-lg font-semibold text-gray-800 truncate">{title}</h1>

      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200 text-xs shrink-0">
        <span className="text-purple-600 font-medium">⚡</span>
        <span className="text-purple-700 font-semibold">
          {subscriptionStore.getTokensAvailable() === Infinity
            ? '∞'
            : subscriptionStore.getTokensAvailable().toLocaleString()
          }
        </span>
        <span className="text-purple-500">tokens</span>
      </div>
    </header>
  );
};
