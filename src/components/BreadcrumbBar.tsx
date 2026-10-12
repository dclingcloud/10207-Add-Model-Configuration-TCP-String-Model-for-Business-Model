import React, { useState } from 'react';
import { SlidersHorizontal, Clock, Search, RotateCcw, Calendar, Check } from 'lucide-react';
import { SubMenuKey } from './SecondarySidebar';

interface BreadcrumbBarProps {
  currentKey: SubMenuKey;
  onRefresh?: () => void;
}

const keyToNameMap: Record<SubMenuKey, string> = {
  tcp_string: 'TCP字符串模型',
  tcp_fixed: 'TCP定长模型',
  http: 'HTTP模型',
  dubbo: 'DUBBO',
  app_string: 'App String Pattern',
  unionpay: '银联',
  unionpay_atm: 'UnionPay ATM',
  second_gen_pay: '二代支付',
  desensitize: '脱敏配置',
  baseline: '智能基线',
  node_stats: '节点统计',
};

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  currentKey,
  onRefresh,
}) => {
  const [timeRange, setTimeRange] = useState('2026-05-13 17:34 ~ 2026-05-13 18:34');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const presets = [
    { label: '最近15分钟', range: '2026-05-13 18:19 ~ 2026-05-13 18:34' },
    { label: '最近1小时 (默认)', range: '2026-05-13 17:34 ~ 2026-05-13 18:34' },
    { label: '今天', range: '2026-05-13 00:00 ~ 2026-05-13 23:59' },
    { label: '最近24小时', range: '2026-05-12 18:34 ~ 2026-05-13 18:34' },
    { label: '最近7天', range: '2026-05-06 18:34 ~ 2026-05-13 18:34' },
  ];

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const isManagement = ['desensitize', 'baseline', 'node_stats'].includes(currentKey);

  return (
    <div className="h-10 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
        <span className="hover:text-slate-700 cursor-pointer">配置</span>
        <span>&gt;</span>
        <span className="hover:text-slate-700 cursor-pointer">
          {isManagement ? '管理' : '模型配置'}
        </span>
        <span>&gt;</span>
        <span className="font-semibold text-slate-900">{keyToNameMap[currentKey]}</span>
      </div>

      {/* Right time range picker & buttons */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="h-7 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">{timeRange}</span>
            <span className="text-[10px] text-slate-400">▾</span>
          </button>

          {showTimePicker && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg p-2 text-xs z-40 animate-in fade-in duration-100">
              <div className="text-[11px] font-medium text-slate-400 px-2 py-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>快速时间选择</span>
              </div>
              <div className="space-y-1 mt-1">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setTimeRange(p.range);
                      setShowTimePicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                      timeRange === p.range
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p.label}</span>
                    {timeRange === p.range && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">自定义时间范围</span>
                <button
                  onClick={() => setShowTimePicker(false)}
                  className="px-2 py-0.5 text-[11px] bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          title="执行查询"
          className="h-7 w-7 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded flex items-center justify-center transition-colors shadow-xs"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>

        {/* Refresh button */}
        <button
          onClick={handleRefreshClick}
          title="刷新列表"
          className="h-7 w-7 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-600 rounded flex items-center justify-center transition-colors"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 transition-transform duration-500 ${
              isRefreshing ? 'animate-spin text-blue-600' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};
