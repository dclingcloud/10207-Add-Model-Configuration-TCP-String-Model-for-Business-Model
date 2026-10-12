import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  HelpCircle,
  FileSpreadsheet,
  RotateCcw,
  Check,
  Search,
} from 'lucide-react';
import { TcpStringModel, ParameterRule } from '../types';
import { ParameterRowEditor } from './ParameterRowEditor';
import { createDefaultEmptyRule, generateSummaryFromRules } from '../mock/data';

interface TcpStringModelManagementProps {
  models: TcpStringModel[];
  onUpdateModel: (model: TcpStringModel) => void;
  onDeleteModel: (id: number) => void;
  onResetData: () => void;
  onClearData: () => void;
  onGoToConfigTab: () => void;
  onOpenBusinessFieldsModal: () => void;
  showToast: (msg: string) => void;
}

export const TcpStringModelManagement: React.FC<TcpStringModelManagementProps> = ({
  models,
  onUpdateModel,
  onDeleteModel,
  onResetData,
  onClearData,
  onGoToConfigTab,
  onOpenBusinessFieldsModal,
  showToast,
}) => {
  // Expanded row ID (defaults to 5 to demonstrate Figure 3 directly on load!)
  const [expandedId, setExpandedId] = useState<number | null>(5);
  // In-flight edits for each model when expanded
  const [editingModels, setEditingModels] = useState<Record<number, TcpStringModel>>({});
  // Search query
  const [keyword, setKeyword] = useState('');
  // Pagination
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  // Ensure editingModel has state initialized
  const getEditingState = (model: TcpStringModel): TcpStringModel => {
    return editingModels[model.id] || model;
  };

  const handleToggleExpand = (model: TcpStringModel) => {
    if (expandedId === model.id) {
      setExpandedId(null);
    } else {
      setExpandedId(model.id);
      if (!editingModels[model.id]) {
        setEditingModels((prev) => ({
          ...prev,
          [model.id]: JSON.parse(JSON.stringify(model)),
        }));
      }
    }
  };

  const handleUpdateEditingField = <K extends keyof TcpStringModel>(
    modelId: number,
    key: K,
    val: TcpStringModel[K]
  ) => {
    setEditingModels((prev) => {
      const current = prev[modelId] || models.find((m) => m.id === modelId)!;
      return {
        ...prev,
        [modelId]: {
          ...current,
          [key]: val,
        },
      };
    });
  };

  const handleAddRequestRule = (modelId: number) => {
    const current = editingModels[modelId] || models.find((m) => m.id === modelId)!;
    const newRule = createDefaultEmptyRule();
    handleUpdateEditingField(modelId, 'requestRules', [...current.requestRules, newRule]);
    showToast('已新增一条请求体参数规则');
  };

  const handleAddResponseRule = (modelId: number) => {
    const current = editingModels[modelId] || models.find((m) => m.id === modelId)!;
    const newRule = createDefaultEmptyRule();
    handleUpdateEditingField(modelId, 'responseRules', [...current.responseRules, newRule]);
    showToast('已新增一条返回体参数规则');
  };

  const handleSaveModification = (modelId: number) => {
    const editState = editingModels[modelId];
    if (!editState) return;
    if (!editState.name.trim()) {
      showToast('模型名称不能为空');
      return;
    }

    const updatedModel: TcpStringModel = {
      ...editState,
      requestParamsSummary: generateSummaryFromRules(editState.requestRules),
      responseParamsSummary: generateSummaryFromRules(editState.responseRules),
    };

    onUpdateModel(updatedModel);
    showToast(`模型 [${updatedModel.name}] 参数修改已成功保存`);
  };

  // Filter models
  const filteredModels = models.filter((m) => {
    if (!keyword) return true;
    return (
      m.name.toLowerCase().includes(keyword.toLowerCase()) ||
      String(m.id).includes(keyword) ||
      m.requestParamsSummary.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col flex-1 bg-white select-none">
      {/* Top Action Bar (Figure 1 & Figure 5 style) */}
      <div className="py-2.5 px-4 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToConfigTab}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded shadow-xs transition-colors"
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
          {/* Quick search */}
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索模型ID/名称..."
              className="w-40 h-7 pl-2 pr-6 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <Search className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* 业务字段 button */}
          <button
            onClick={onOpenBusinessFieldsModal}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 flex items-center gap-1 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>业务字段</span>
          </button>

          {/* Help tooltip */}
          <button
            onClick={() => showToast('TCP字符串模型：通过起始符/终止符或偏移量规则对TCP报文进行字段提取与多维分析')}
            title="查看帮助文档"
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Empty / Reset state toggle for testing */}
          {models.length === 0 ? (
            <button
              onClick={onResetData}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 px-1.5 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>恢复默认测试数据</span>
            </button>
          ) : (
            <button
              onClick={onClearData}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-1 transition-colors"
              title="用于测试空状态展示效果"
            >
              清空测试空状态
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="px-4 py-3 flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Table Title Banner (Figure 2) */}
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-bold text-slate-800 tracking-tight">TCP字符串模型列表</span>
          <span className="text-xs text-slate-500">
            共 <span className="font-mono font-semibold text-slate-800">{filteredModels.length}</span> 条模型记录
          </span>
        </div>

        {/* The Table Container with Figure 5 clean styling */}
        <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-medium">
                <th className="py-2.5 px-3 w-10 text-center"></th>
                <th className="py-2.5 px-3 w-20">模型ID</th>
                <th className="py-2.5 px-3 w-48">名称</th>
                <th className="py-2.5 px-3">请求体参数</th>
                <th className="py-2.5 px-3">返回体参数</th>
                <th className="py-2.5 px-3 w-40">创建时间</th>
                <th className="py-2.5 px-3 w-20 text-center">编辑</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    暂无TCP字符串模型记录，可点击上方「添加模型」新建或「恢复默认测试数据」
                  </td>
                </tr>
              ) : (
                filteredModels.map((model) => {
                  const isExpanded = expandedId === model.id;
                  const currentEdit = getEditingState(model);

                  return (
                    <React.Fragment key={model.id}>
                      {/* Main List Row */}
                      <tr
                        onClick={() => handleToggleExpand(model)}
                        className={`border-b border-slate-100 transition-colors cursor-pointer group ${
                          isExpanded
                            ? 'bg-blue-50/40 hover:bg-blue-50/60 font-medium'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Expand indicator icon */}
                        <td className="py-2.5 px-3 text-center text-slate-400 group-hover:text-blue-600">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 mx-auto text-blue-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mx-auto" />
                          )}
                        </td>

                        {/* 模型ID */}
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                          {model.id}
                        </td>

                        {/* 名称 */}
                        <td className="py-2.5 px-3 font-medium text-slate-900 group-hover:text-blue-700">
                          {model.name}
                        </td>

                        {/* 请求体参数概要 */}
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] max-w-xs truncate" title={model.requestParamsSummary}>
                          {model.requestParamsSummary}
                        </td>

                        {/* 返回体参数概要 */}
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] max-w-xs truncate" title={model.responseParamsSummary}>
                          {model.responseParamsSummary}
                        </td>

                        {/* 创建时间 */}
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {model.createTime}
                        </td>

                        {/* 操作 / 删除 */}
                        <td
                          className="py-2.5 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              if (confirm(`确定要删除模型 [${model.name}] 吗？`)) {
                                onDeleteModel(model.id);
                                showToast(`已删除模型 [${model.name}]`);
                              }
                            }}
                            title="删除模型"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Section (Figure 3: 点击列表列展示对应的参数部分) */}
                      {isExpanded && (
                        <tr className="bg-[#1e293b]/5 border-b border-blue-200">
                          <td colSpan={7} className="p-0">
                            <div className="bg-[#1e293b]/[0.02] border-l-4 border-blue-600 p-4 space-y-4">
                              {/* 1. 模型名称 */}
                              <div className="flex items-center gap-3">
                                <span className="w-20 text-xs font-semibold text-slate-700">模型名称</span>
                                <input
                                  type="text"
                                  value={currentEdit.name}
                                  onChange={(e) =>
                                    handleUpdateEditingField(model.id, 'name', e.target.value)
                                  }
                                  placeholder="请输入模型名称"
                                  className="w-64 h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                              </div>

                              <div className="border-t border-slate-200" />

                              {/* 2. 请求体参数 */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-slate-700">请求体参数</span>
                                  <span className="text-[11px] text-slate-400">
                                    共 {currentEdit.requestRules.length} 条解析规则
                                  </span>
                                </div>

                                <div className="space-y-1.5">
                                  {currentEdit.requestRules.map((rule, idx) => (
                                    <ParameterRowEditor
                                      key={rule.id}
                                      rule={rule}
                                      index={idx}
                                      showExtendedOptions={true}
                                      onChange={(updated) => {
                                        const updatedList = [...currentEdit.requestRules];
                                        updatedList[idx] = updated;
                                        handleUpdateEditingField(model.id, 'requestRules', updatedList);
                                      }}
                                      onDelete={() => {
                                        const updatedList = currentEdit.requestRules.filter(
                                          (_, i) => i !== idx
                                        );
                                        handleUpdateEditingField(model.id, 'requestRules', updatedList);
                                        showToast('已移除该规则');
                                      }}
                                    />
                                  ))}
                                </div>

                                {/* + 添加 button */}
                                <div className="pt-1">
                                  <button
                                    onClick={() => handleAddRequestRule(model.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-blue-500 text-xs text-blue-600 rounded transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>添加</span>
                                  </button>
                                </div>
                              </div>

                              <div className="border-t border-slate-200" />

                              {/* 3. 返回体参数 */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-slate-700">返回体参数</span>
                                  <span className="text-[11px] text-slate-400">
                                    共 {currentEdit.responseRules.length} 条解析规则
                                  </span>
                                </div>

                                <div className="space-y-1.5">
                                  {currentEdit.responseRules.map((rule, idx) => (
                                    <ParameterRowEditor
                                      key={rule.id}
                                      rule={rule}
                                      index={idx}
                                      showExtendedOptions={true}
                                      onChange={(updated) => {
                                        const updatedList = [...currentEdit.responseRules];
                                        updatedList[idx] = updated;
                                        handleUpdateEditingField(model.id, 'responseRules', updatedList);
                                      }}
                                      onDelete={() => {
                                        const updatedList = currentEdit.responseRules.filter(
                                          (_, i) => i !== idx
                                        );
                                        handleUpdateEditingField(model.id, 'responseRules', updatedList);
                                        showToast('已移除该规则');
                                      }}
                                    />
                                  ))}
                                </div>

                                {/* + 添加 button */}
                                <div className="pt-1">
                                  <button
                                    onClick={() => handleAddResponseRule(model.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-blue-500 text-xs text-blue-600 rounded transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>添加</span>
                                  </button>
                                </div>
                              </div>

                              <div className="border-t border-slate-200" />

                              {/* 4. 参数保存 checkboxes & 保存修改 button */}
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-4 text-xs text-slate-700">
                                  <span className="font-medium text-slate-600">参数保存</span>
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={currentEdit.saveFullRequest}
                                      onChange={(e) =>
                                        handleUpdateEditingField(
                                          model.id,
                                          'saveFullRequest',
                                          e.target.checked
                                        )
                                      }
                                      className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 accent-blue-600"
                                    />
                                    <span>保存完整请求体</span>
                                  </label>

                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={currentEdit.saveFullResponse}
                                      onChange={(e) =>
                                        handleUpdateEditingField(
                                          model.id,
                                          'saveFullResponse',
                                          e.target.checked
                                        )
                                      }
                                      className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 accent-blue-600"
                                    />
                                    <span>保存完整返回体</span>
                                  </label>
                                </div>

                                <button
                                  onClick={() => handleSaveModification(model.id)}
                                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded shadow-xs transition-colors flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>保存修改</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar (Figure 2 & Figure 5 style) */}
        <div className="py-3 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div>
            共 <span className="font-semibold font-mono text-slate-800">{filteredModels.length}</span> 条
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-6 px-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none"
            >
              <option value="15">15 条/页</option>
              <option value="30">30 条/页</option>
              <option value="50">50 条/页</option>
              <option value="100">100 条/页</option>
            </select>

            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              &lt;
            </button>

            <button className="w-6 h-6 rounded bg-blue-600 text-white font-medium flex items-center justify-center text-xs">
              {currentPage}
            </button>

            <button
              disabled={true}
              className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              &gt;
            </button>

            <div className="flex items-center gap-1 pl-1">
              <span>跳至</span>
              <input
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-8 h-6 text-center border border-slate-300 rounded text-xs text-slate-800 font-mono"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
