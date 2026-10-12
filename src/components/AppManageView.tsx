import React, { useState } from 'react';
import {
  Plus,
  ChevronDown,
  Filter,
  Download,
  RotateCcw,
  Edit2,
  Copy,
  Settings,
  Trash2,
  X,
  GripVertical,
} from 'lucide-react';
import { initialAppRecords } from '../mock/data';
import { AppRecord } from '../types';

interface AppManageViewProps {
  showToast: (msg: string) => void;
}

export const AppManageView: React.FC<AppManageViewProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<'custom_tcp' | 'custom_udp' | 'known_tcp' | 'known_udp' | 'ip' | 'l7'>('custom_tcp');
  const [apps, setApps] = useState<AppRecord[]>(initialAppRecords);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Figure 6 Form State
  const [formAppName, setFormAppName] = useState('');
  const [formProbeInterfaces, setFormProbeInterfaces] = useState<string[]>(['DataCenter-SH/Interface 1']);
  const [srcIp, setSrcIp] = useState('');
  const [srcPort, setSrcPort] = useState('');
  const [destIp, setDestIp] = useState('');
  const [destPort, setDestPort] = useState('');
  const [packetLength, setPacketLength] = useState('64字节');
  const [remarks, setRemarks] = useState('');

  const tabs = [
    { key: 'custom_tcp', label: '自定义TCP' },
    { key: 'custom_udp', label: '自定义UDP' },
    { key: 'known_tcp', label: '已知TCP' },
    { key: 'known_udp', label: '已知UDP' },
    { key: 'ip', label: 'IP协议' },
    { key: 'l7', label: 'L7' },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.length === apps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(apps.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSaveAppForm = () => {
    if (!formAppName.trim()) {
      showToast('请输入应用名称');
      return;
    }
    const newApp: AppRecord = {
      id: String(apps.length + 1),
      appId: String(Math.floor(Math.random() * 20000) + 30000),
      appName: formAppName.trim(),
      destIp: destIp || '172.17.3.2',
      destPort: destPort || '8080-8080',
      packetLength: packetLength,
      enabled: true,
    };
    setApps([newApp, ...apps]);
    setShowAddModal(false);
    showToast(`成功新增应用 [${newApp.appName}]`);
    setFormAppName('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Header Row with Tabs and Actions (Figure 5) */}
      <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
        {/* Left Tabs */}
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50/20'
                    : 'border-slate-300 text-slate-600 hover:text-slate-900 bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* + 新增应用 Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>新增应用</span>
          </button>

          {/* 批量操作 Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => showToast('已触发批量操作')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded transition-colors"
            >
              <span>批量操作</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Filter icon */}
          <button
            onClick={() => showToast('打开筛选面板')}
            className="w-7 h-7 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded flex items-center justify-center transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>

          {/* Export / Table setting icon */}
          <button
            onClick={() => showToast('导出应用列表')}
            className="w-7 h-7 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded flex items-center justify-center transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Table (Figure 5) */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-medium">
                <th className="py-2.5 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === apps.length && apps.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 text-blue-600 rounded accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 w-16">序号</th>
                <th className="py-2.5 px-3 w-24">应用ID</th>
                <th className="py-2.5 px-3">应用名称</th>
                <th className="py-2.5 px-3">目的IP</th>
                <th className="py-2.5 px-3">目的端口</th>
                <th className="py-2.5 px-3 w-28">截包长度</th>
                <th className="py-2.5 px-3 w-48 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app, index) => {
                const isChecked = selectedIds.includes(app.id);
                return (
                  <tr
                    key={app.id}
                    className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                      isChecked ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(app.id)}
                        className="w-3.5 h-3.5 text-blue-600 rounded accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-slate-500 font-mono flex items-center gap-1">
                      <GripVertical className="w-3 h-3 text-slate-300" />
                      <span>{index + 1}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {app.appId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {app.appName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {app.destIp}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {app.destPort}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {app.packetLength}
                    </td>
                    {/* Action button cluster (Figure 5) */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1.5 text-slate-400">
                        <button
                          onClick={() => showToast(`刷新应用 ${app.appName}`)}
                          className="hover:text-blue-600 p-0.5 rounded transition-colors"
                          title="同步"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast(`编辑应用 ${app.appName}`)}
                          className="hover:text-blue-600 p-0.5 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast(`复制应用 ${app.appName}`)}
                          className="hover:text-blue-600 p-0.5 rounded transition-colors"
                          title="复制"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast(`配置应用 ${app.appName}`)}
                          className="hover:text-blue-600 p-0.5 rounded transition-colors"
                          title="设置"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setApps(apps.filter((a) => a.id !== app.id));
                            showToast(`已删除应用 ${app.appName}`);
                          }}
                          className="hover:text-red-600 p-0.5 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Switch toggle (Figure 5) */}
                        <button
                          type="button"
                          onClick={() => {
                            setApps(
                              apps.map((a) =>
                                a.id === app.id ? { ...a, enabled: !a.enabled } : a
                              )
                            );
                          }}
                          className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ml-1 ${
                            app.enabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-3 h-3 rounded-full shadow-xs transform transition-transform ${
                              app.enabled ? 'translate-x-3' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Figure 5) */}
        <div className="py-3 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div>
            本页记录从 1 到 {apps.length}, 总数 <span className="font-mono font-semibold">{apps.length}</span> 条
          </div>

          <div className="flex items-center gap-2">
            <select className="h-6 px-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none">
              <option>100条/页</option>
              <option>50条/页</option>
              <option>20条/页</option>
            </select>

            <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50">
              &lt;
            </button>
            <button className="w-6 h-6 rounded bg-blue-600 text-white font-medium flex items-center justify-center text-xs">
              1
            </button>
            <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50">
              &gt;
            </button>

            <div className="flex items-center gap-1 pl-1">
              <span>前往</span>
              <input
                type="text"
                defaultValue="1"
                className="w-8 h-6 text-center border border-slate-300 rounded text-xs text-slate-800 font-mono"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Drawer for Figure 6 (新增应用定义表单) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="h-12 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">新增应用 (参考图6定义表单)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body (Exact Figure 6 structure) */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-700">
              {/* 1. 应用名称 */}
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-slate-700">应用名称</span>
                <input
                  type="text"
                  value={formAppName}
                  onChange={(e) => setFormAppName(e.target.value)}
                  placeholder="请输入应用名称"
                  className="flex-1 h-8 px-3 border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 2. 探针接口 */}
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-slate-700">探针接口</span>
                <div className="flex-1 min-h-8 border border-slate-300 rounded px-2 py-1 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {formProbeInterfaces.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[11px]"
                      >
                        <span>{item}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-blue-800"
                          onClick={() =>
                            setFormProbeInterfaces(
                              formProbeInterfaces.filter((_, i) => i !== idx)
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* 3. 应用定义 (Grouped cards in Figure 6) */}
              <div className="flex items-start gap-4">
                <span className="w-20 font-medium text-slate-700 pt-2">应用定义</span>
                <div className="flex-1 space-y-3">
                  {/* 源IP */}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-xs">源IP</span>
                      <button
                        type="button"
                        onClick={() => showToast('已添加源IP排除项')}
                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={srcIp}
                      onChange={(e) => setSrcIp(e.target.value)}
                      placeholder={'支持单个IP、离散IP、IP段以及IP/子网掩码,离散IP用","分隔,IP段用"-"连接'}
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 源端口 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-xs">源端口</span>
                      <button
                        type="button"
                        onClick={() => showToast('已添加源端口排除项')}
                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={srcPort}
                      onChange={(e) => setSrcPort(e.target.value)}
                      placeholder={'支持单个端口、端口段以及离散端口，多个端口用","分隔，端口段用"-"连接'}
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 目的IP */}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-xs">目的IP</span>
                      <button
                        type="button"
                        onClick={() => showToast('已添加目的IP排除项')}
                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={destIp}
                      onChange={(e) => setDestIp(e.target.value)}
                      placeholder={'支持单个IP、离散IP、IP段以及IP/子网掩码,离散IP用","分隔,IP段用"-"连接'}
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 目的端口 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-xs">目的端口</span>
                      <button
                        type="button"
                        onClick={() => showToast('已添加目的端口排除项')}
                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={destPort}
                      onChange={(e) => setDestPort(e.target.value)}
                      placeholder={'支持单个端口、端口段以及离散端口，多个端口用","分隔，端口段用"-"连接'}
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. 截包长度 */}
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-slate-700">截包长度</span>
                <select
                  value={packetLength}
                  onChange={(e) => setPacketLength(e.target.value)}
                  className="flex-1 h-8 px-3 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="64字节">64字节</option>
                  <option value="128字节">128字节</option>
                  <option value="全包">全包</option>
                </select>
              </div>

              {/* 5. 标识/备注 */}
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium text-slate-700">标识/备注</span>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="请输入标识/备注"
                  className="flex-1 h-8 px-3 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="h-12 px-6 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50 shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveAppForm}
                className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
              >
                保存应用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
