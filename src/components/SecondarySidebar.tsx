import React, { useState } from 'react';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';

export type SubMenuKey =
  | 'tcp_string' // TCP字符串模型 (Default selected)
  | 'tcp_fixed'  // TCP定长模型 (Newly added)
  | 'http'       // HTTP模型
  | 'dubbo'
  | 'app_string'
  | 'unionpay'
  | 'unionpay_atm'
  | 'second_gen_pay'
  | 'desensitize'
  | 'baseline'
  | 'node_stats';

interface SecondarySidebarProps {
  selectedKey: SubMenuKey;
  onSelectKey: (key: SubMenuKey) => void;
  tcpStringCount?: number;
}

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  selectedKey,
  onSelectKey,
  tcpStringCount = 2,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openManage, setOpenManage] = useState(true);
  const [openModelConfig, setOpenModelConfig] = useState(true);

  if (collapsed) {
    return (
      <aside className="w-9 bg-white border-r border-slate-200 flex flex-col items-center py-2.5 shrink-0 transition-all">
        <button
          onClick={() => setCollapsed(false)}
          title="展开功能配置"
          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <span className="text-[11px] text-slate-400 mt-4 [writing-mode:vertical-lr] tracking-widest font-medium">
          功能配置
        </span>
      </aside>
    );
  }

  return (
    <aside className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Title Header */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-slate-100 shrink-0">
        <span className="text-xs font-semibold text-slate-800 tracking-tight">功能配置</span>
        <button
          onClick={() => setCollapsed(true)}
          title="收起侧边栏"
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-2 text-xs">
        {/* Section 1: 管理 */}
        <div className="mb-2">
          <button
            onClick={() => setOpenManage(!openManage)}
            className="w-full px-3 py-1.5 flex items-center justify-between text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            <span>管理</span>
            {openManage ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {openManage && (
            <div className="mt-0.5 space-y-0.5">
              <button
                onClick={() => onSelectKey('desensitize')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'desensitize'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>脱敏配置</span>
              </button>
              <button
                onClick={() => onSelectKey('baseline')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'baseline'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>智能基线</span>
              </button>
              <button
                onClick={() => onSelectKey('node_stats')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'node_stats'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>节点统计</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: 模型配置 */}
        <div>
          <button
            onClick={() => setOpenModelConfig(!openModelConfig)}
            className="w-full px-3 py-1.5 flex items-center justify-between text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            <span>模型配置</span>
            {openModelConfig ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {openModelConfig && (
            <div className="mt-0.5 space-y-0.5">
              {/* Newly added and DEFAULT SELECTED: TCP字符串模型 */}
              <button
                onClick={() => onSelectKey('tcp_string')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'tcp_string'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>TCP字符串模型</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedKey === 'tcp_string'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tcpStringCount}
                </span>
              </button>

              {/* Newly added: TCP定长模型 */}
              <button
                onClick={() => onSelectKey('tcp_fixed')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'tcp_fixed'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>TCP定长模型</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedKey === 'tcp_fixed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  3
                </span>
              </button>

              {/* HTTP模型 (Figure 1 item) */}
              <button
                onClick={() => onSelectKey('http')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'http'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>HTTP模型</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 font-mono">
                  7
                </span>
              </button>

              <button
                onClick={() => onSelectKey('dubbo')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'dubbo'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>DUBBO</span>
              </button>

              <button
                onClick={() => onSelectKey('app_string')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'app_string'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>App String Pattern</span>
              </button>

              <button
                onClick={() => onSelectKey('unionpay')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'unionpay'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>银联</span>
              </button>

              <button
                onClick={() => onSelectKey('unionpay_atm')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'unionpay_atm'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>UnionPay ATM</span>
              </button>

              <button
                onClick={() => onSelectKey('second_gen_pay')}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                  selectedKey === 'second_gen_pay'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>二代支付</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
