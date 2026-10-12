import React from 'react';
import {
  FileText,
  Network,
  Database,
  Server,
  Users,
  GitBranch,
  Bell,
  LayoutGrid,
  SlidersHorizontal,
  Share2,
  Cpu,
} from 'lucide-react';

interface PrimaryRailProps {
  activeRailId?: string;
  onSelectRail?: (id: string) => void;
}

export const PrimaryRail: React.FC<PrimaryRailProps> = ({
  activeRailId = 'config',
  onSelectRail,
}) => {
  const railItems = [
    { id: 'docs', label: '配置文档', icon: FileText },
    { id: 'network', label: '网络拓扑', icon: Network },
    { id: 'database', label: '数据源管理', icon: Database },
    { id: 'server', label: '节点服务', icon: Server },
    { id: 'users', label: '用户与组织', icon: Users },
    { id: 'branch', label: '路由拓扑', icon: GitBranch },
    { id: 'bell', label: '告警中心', icon: Bell },
    { id: 'grid', label: '应用矩阵', icon: LayoutGrid },
    { id: 'config', label: '功能配置', icon: SlidersHorizontal }, // Active in Figure 1
    { id: 'share', label: '流量分发', icon: Share2 },
    { id: 'probe', label: '探针设备', icon: Cpu },
  ];

  return (
    <nav className="w-12 bg-[#101828] text-slate-400 flex flex-col items-center py-2 shrink-0 border-r border-slate-800 select-none z-20">
      <div className="flex flex-col items-center gap-1.5 w-full">
        {railItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeRailId;
          return (
            <button
              key={item.id}
              onClick={() => onSelectRail?.(item.id)}
              title={item.label}
              className={`w-9 h-9 rounded flex items-center justify-center transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[1.8]" />
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
