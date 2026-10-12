import React from 'react';
import { SubMenuKey } from './SecondarySidebar';
import { Sliders, Plus, RotateCcw } from 'lucide-react';

interface GenericConfigPlaceholderProps {
  currentKey: SubMenuKey;
  onGoBackToTcpString: () => void;
  showToast: (msg: string) => void;
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

export const GenericConfigPlaceholder: React.FC<GenericConfigPlaceholderProps> = ({
  currentKey,
  onGoBackToTcpString,
  showToast,
}) => {
  const name = keyToNameMap[currentKey] || '配置项';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white select-none">
      <div className="max-w-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
          <Sliders className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-slate-800">{name} 管理面板</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          当前模块已注册至NGPM协议解析中心。您可以配置对应的协议规则、特征提取及报文解析过滤器，或返回至默认选中的「TCP字符串模型」。
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onGoBackToTcpString}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-xs transition-colors"
          >
            返回 TCP字符串模型
          </button>
          <button
            onClick={() => showToast(`已创建 ${name} 新规则模板`)}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            新建解析规则
          </button>
        </div>
      </div>
    </div>
  );
};
