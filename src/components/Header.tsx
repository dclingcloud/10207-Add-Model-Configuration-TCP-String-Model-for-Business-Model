import React, { useState } from 'react';
import { Search, Maximize2, Minimize2, ChevronDown, Check, User, Shield, HelpCircle, Layers } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showAppViewDemo: boolean;
  onToggleAppViewDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showAppViewDemo,
  onToggleAppViewDemo,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-12 bg-[#0d1424] text-white flex items-center justify-between px-3 shrink-0 border-b border-slate-800 select-none z-30">
      {/* Brand logo & collapse */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            N
          </div>
          <span className="font-bold text-base tracking-wider text-white">NGPM</span>
        </div>
        <button
          title="折叠主菜单"
          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="text-sm font-semibold">&gt;</span>
        </button>
      </div>

      {/* Right Tools & User Info */}
      <div className="flex items-center gap-3">
        {/* Toggle to inspect Figure 5 & 6 Application Reference */}
        <button
          onClick={onToggleAppViewDemo}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-all border ${
            showAppViewDemo
              ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="切换查看图5/图6样式参考页面"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showAppViewDemo ? '返回模型管理系统' : '查看图5、图6组件样式参考'}</span>
        </button>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="搜索配置"
            className="w-44 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-900 text-xs text-slate-200 placeholder-slate-400 px-2.5 py-1.5 pr-7 rounded border border-slate-700 focus:border-blue-500 focus:outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? '退出全屏' : '全屏展示'}
          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded hover:bg-slate-800 text-xs text-slate-200 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-medium shadow-xs">
              行
            </div>
            <span className="font-normal text-slate-200">admin</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white text-slate-700 rounded-md shadow-lg border border-slate-200 py-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-medium text-slate-900">系统超级管理员</p>
                <p className="text-[11px] text-slate-400 truncate">admin@ngpm.enterprise</p>
              </div>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>个人中心</span>
              </button>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>权限凭证</span>
              </button>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>帮助手册</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
