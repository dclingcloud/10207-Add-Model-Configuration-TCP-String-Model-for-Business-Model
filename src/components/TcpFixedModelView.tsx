import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, FileSpreadsheet, Search } from 'lucide-react';
import { initialTcpFixedModels } from '../mock/data';

interface TcpFixedModelViewProps {
  showToast: (msg: string) => void;
  onOpenBusinessFieldsModal: () => void;
}

export const TcpFixedModelView: React.FC<TcpFixedModelViewProps> = ({
  showToast,
  onOpenBusinessFieldsModal,
}) => {
  const [models, setModels] = useState(initialTcpFixedModels);
  const [activeTab, setActiveTab] = useState<'management' | 'config'>('management');
  const [keyword, setKeyword] = useState('');

  const filtered = models.filter((m) =>
    m.name.includes(keyword) || String(m.id).includes(keyword)
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Tabs Row */}
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

      {activeTab === 'management' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Subheader */}
          <div className="py-2.5 px-4 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('config')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>添加模型</span>
              </button>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <span className="text-slate-300">|</span>
                <span>共</span>
                <span className="font-semibold text-slate-800 font-mono">{models.length}</span>
                <span>个定长协议模型</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索定长模型..."
                  className="w-40 h-7 pl-2 pr-6 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>

              <button
                onClick={onOpenBusinessFieldsModal}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span>业务字段</span>
              </button>

              <button
                onClick={() => showToast('TCP定长模型：通过指定字节偏移量与固定长度解析定长报文')}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="px-4 py-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-800">TCP定长模型列表</span>
              <span className="text-xs text-slate-500">
                共 <span className="font-mono font-semibold">{filtered.length}</span> 条模型记录
              </span>
            </div>

            <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-medium">
                    <th className="py-2.5 px-3 w-20">模型ID</th>
                    <th className="py-2.5 px-3 w-48">名称</th>
                    <th className="py-2.5 px-3">请求体参数 (定长偏移)</th>
                    <th className="py-2.5 px-3">返回体参数 (定长偏移)</th>
                    <th className="py-2.5 px-3 w-40">创建时间</th>
                    <th className="py-2.5 px-3 w-20 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{item.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{item.requestParamsSummary}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{item.responseParamsSummary}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.createTime}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            setModels(models.filter((m) => m.id !== item.id));
                            showToast(`已删除模型 [${item.name}]`);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Fixed Model Config Form */
        <div className="p-6 max-w-4xl mx-auto flex-1 overflow-y-auto space-y-4">
          <h3 className="text-sm font-bold text-slate-800">新建 TCP 定长模型配置</h3>
          <p className="text-xs text-slate-500">通过字节偏移量、字段长度、字符编码解析定长TCP通信协议</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-20 text-xs font-semibold text-slate-700">模型名称</span>
              <input
                type="text"
                placeholder="请输入定长模型名称..."
                className="w-72 h-8 px-3 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-xs font-semibold text-slate-700">总包体长度</span>
              <input
                type="text"
                placeholder="如 256 字节"
                className="w-72 h-8 px-3 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('management');
              showToast('已新建TCP定长模型并切换至列表');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
          >
            保存添加
          </button>
        </div>
      )}
    </div>
  );
};
