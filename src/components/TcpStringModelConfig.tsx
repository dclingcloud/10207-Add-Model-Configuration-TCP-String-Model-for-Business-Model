import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { ParameterRule, TcpStringModel } from '../types';
import { ParameterRowEditor } from './ParameterRowEditor';
import { createDefaultEmptyRule, generateSummaryFromRules } from '../mock/data';

interface TcpStringModelConfigProps {
  onSaveNewModel: (newModel: TcpStringModel) => void;
  showToast: (msg: string) => void;
}

export const TcpStringModelConfig: React.FC<TcpStringModelConfigProps> = ({
  onSaveNewModel,
  showToast,
}) => {
  const [modelName, setModelName] = useState('');
  const [requestRules, setRequestRules] = useState<ParameterRule[]>([
    createDefaultEmptyRule(),
  ]);
  const [responseRules, setResponseRules] = useState<ParameterRule[]>([
    createDefaultEmptyRule(),
  ]);
  const [saveFullRequest, setSaveFullRequest] = useState(true);
  const [saveFullResponse, setSaveFullResponse] = useState(true);

  const handleAddRequestRule = () => {
    setRequestRules((prev) => [...prev, createDefaultEmptyRule()]);
    showToast('已添加一条请求体参数规则');
  };

  const handleAddResponseRule = () => {
    setResponseRules((prev) => [...prev, createDefaultEmptyRule()]);
    showToast('已添加一条返回体参数规则');
  };

  const handleSaveAdd = () => {
    if (!modelName.trim()) {
      showToast('请输入模型名称');
      return;
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newId = Math.floor(Math.random() * 50) + 30;

    const newModel: TcpStringModel = {
      id: newId,
      name: modelName.trim(),
      requestParamsSummary: generateSummaryFromRules(requestRules),
      responseParamsSummary: generateSummaryFromRules(responseRules),
      requestRules,
      responseRules,
      saveFullRequest,
      saveFullResponse,
      createTime: timeStr,
    };

    onSaveNewModel(newModel);
    showToast(`成功新增TCP字符串模型 [${newModel.name}]，已自动切换至管理列表`);
  };

  return (
    <div className="flex-1 bg-white p-6 overflow-y-auto select-none">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. 模型名称 (Figure 4) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <label className="w-24 text-xs font-semibold text-slate-700">模型名称</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="请输入模型名称..."
              className="w-80 h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-200" />

        {/* 2. 请求体参数 (Figure 4) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">请求体参数</label>
            <span className="text-[11px] text-slate-400">
              设置TCP请求报文字符串提取规则
            </span>
          </div>

          <div className="space-y-2">
            {requestRules.map((rule, idx) => (
              <ParameterRowEditor
                key={rule.id}
                rule={rule}
                index={idx}
                showExtendedOptions={false} // Figure 4 shows concise initial layout
                onChange={(updated) => {
                  const updatedList = [...requestRules];
                  updatedList[idx] = updated;
                  setRequestRules(updatedList);
                }}
                onDelete={() => {
                  if (requestRules.length <= 1) {
                    showToast('至少保留一行请求体规则');
                    return;
                  }
                  setRequestRules(requestRules.filter((_, i) => i !== idx));
                }}
              />
            ))}
          </div>

          {/* + 添加 button (Figure 4) */}
          <div className="pt-1">
            <button
              onClick={handleAddRequestRule}
              className="flex items-center gap-1 px-4 py-1.5 bg-white hover:bg-blue-50 border border-dashed border-slate-300 hover:border-blue-500 text-xs text-blue-600 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200" />

        {/* 3. 返回体参数 (Figure 4) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">返回体参数</label>
            <span className="text-[11px] text-slate-400">
              设置TCP返回报文字符串提取规则
            </span>
          </div>

          <div className="space-y-2">
            {responseRules.map((rule, idx) => (
              <ParameterRowEditor
                key={rule.id}
                rule={rule}
                index={idx}
                showExtendedOptions={false}
                onChange={(updated) => {
                  const updatedList = [...responseRules];
                  updatedList[idx] = updated;
                  setResponseRules(updatedList);
                }}
                onDelete={() => {
                  if (responseRules.length <= 1) {
                    showToast('至少保留一行返回体规则');
                    return;
                  }
                  setResponseRules(responseRules.filter((_, i) => i !== idx));
                }}
              />
            ))}
          </div>

          {/* + 添加 button (Figure 4) */}
          <div className="pt-1">
            <button
              onClick={handleAddResponseRule}
              className="flex items-center gap-1 px-4 py-1.5 bg-white hover:bg-blue-50 border border-dashed border-slate-300 hover:border-blue-500 text-xs text-blue-600 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200" />

        {/* 4. 参数保存 (Figure 4) */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-5 text-xs text-slate-700">
            <span className="font-semibold text-slate-700">参数保存</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={saveFullRequest}
                onChange={(e) => setSaveFullRequest(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 accent-blue-600"
              />
              <span>保存完整请求体</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={saveFullResponse}
                onChange={(e) => setSaveFullResponse(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 accent-blue-600"
              />
              <span>保存完整返回体</span>
            </label>
          </div>

          {/* [保存添加] blue button (Figure 4) */}
          <button
            onClick={handleSaveAdd}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>保存添加</span>
          </button>
        </div>
      </div>
    </div>
  );
};
