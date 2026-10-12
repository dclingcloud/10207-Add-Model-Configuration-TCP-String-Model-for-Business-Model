import React, { useState } from 'react';
import { Plus, FileSpreadsheet, HelpCircle, Search, Edit2, Trash2 } from 'lucide-react';
import { initialHttpModels } from '../mock/data';

interface HttpModelViewProps {
  showToast: (msg: string) => void;
  onOpenBusinessFieldsModal: () => void;
}

export const HttpModelView: React.FC<HttpModelViewProps> = ({
  showToast,
  onOpenBusinessFieldsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'management' | 'config'>('management');
  const [models, setModels] = useState(initialHttpModels);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Tabs Row (Figure 1) */}
      <div className="h-11 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-1.5 text-xs font-semibold rounded border transition-all ${
              activeTab === 'management'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-slate-300 text-slate-600 hover:text-slate-900 bg-white'
            }`}
          >
            模型管理
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-1.5 text-xs font-semibold rounded border transition-all ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-slate-300 text-slate-600 hover:text-slate-900 bg-white'
            }`}
          >
            模型配置
          </button>
        </div>
      </div>

      {/* Sub action bar (Figure 1) */}
      <div className="py-2.5 px-4 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('添加HTTP模型')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>添加模型</span>
          </button>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span className="text-slate-300">|</span>
            <span>共</span>
            <span className="font-semibold text-slate-800 font-mono">{models.length}</span>
            <span>个协议模型</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBusinessFieldsModal}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>业务字段</span>
          </button>
          <button
            onClick={() => showToast('查看HTTP模型说明')}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400">清空测试空状态</span>
        </div>
      </div>

      {/* Table (Figure 1) */}
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-bold text-slate-800">HTTP模型列表</span>
          <span className="text-xs text-slate-500">
            共 <span className="font-mono font-semibold">{models.length}</span> 条模型记录
          </span>
        </div>

        <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-medium">
                <th className="py-2.5 px-3 w-16">模型ID</th>
                <th className="py-2.5 px-3 w-36">名称</th>
                <th className="py-2.5 px-3 w-28">方法</th>
                <th className="py-2.5 px-3 w-36">路径规则</th>
                <th className="py-2.5 px-3">请求体参数</th>
                <th className="py-2.5 px-3">返回体参数</th>
                <th className="py-2.5 px-3 w-36">创建时间</th>
                <th className="py-2.5 px-3 w-28 text-center">功能号</th>
                <th className="py-2.5 px-3 w-24 text-center">配置</th>
              </tr>
            </thead>
            <tbody>
              {models.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{item.id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{item.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{item.method}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{item.pathRule}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">{item.reqParam}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">{item.resParam}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.createTime}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => showToast(`查看功能号关联: ${item.name}`)}
                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium"
                    >
                      功能号关联 {item.funcCount > 0 ? item.funcCount : ''}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-center text-blue-600">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => showToast(`编辑模型 ${item.name}`)} className="hover:underline">编辑</button>
                      <span className="text-slate-300">|</span>
                      <button onClick={() => showToast(`删除模型 ${item.name}`)} className="hover:underline">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
