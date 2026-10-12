import React from 'react';
import { Trash2, Tag } from 'lucide-react';
import { ParameterRule, FieldCategory, Charset, DesensitizeType } from '../types';
import { FieldCategorySelect } from './FieldCategorySelect';
import { CustomSelect } from './CustomSelect';

interface ParameterRowEditorProps {
  rule: ParameterRule;
  index: number;
  showExtendedOptions?: boolean;
  onChange: (updatedRule: ParameterRule) => void;
  onDelete: () => void;
}

export const ParameterRowEditor: React.FC<ParameterRowEditorProps> = ({
  rule,
  showExtendedOptions = true,
  onChange,
  onDelete,
}) => {
  const isOffsetMode = rule.ruleMode === 'offset';

  const updateField = <K extends keyof ParameterRule>(key: K, value: ParameterRule[K]) => {
    onChange({
      ...rule,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1.5 px-2 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200/80 rounded transition-colors text-xs text-slate-700">
      {/* Mode switch (Offset vs Delimiter) */}
      {isOffsetMode ? (
        /* OFFSET MODE ROW */
        <>
          {/* Offset prefix */}
          <CustomSelect
            value={rule.startPrefixType}
            options={['偏移量', '起始符']}
            onChange={(val) => {
              if (val === '起始符') {
                onChange({
                  ...rule,
                  ruleMode: 'delimiter',
                  startPrefixType: '起始符',
                  endSuffixType: '终止符',
                });
              } else {
                updateField('startPrefixType', val as '起始符' | '偏移量');
              }
            }}
            minWidth="min-w-[70px]"
            dropdownWidth="w-24"
          />

          <input
            type="text"
            value={rule.offset}
            onChange={(e) => updateField('offset', e.target.value)}
            placeholder="4"
            className="w-14 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
          />

          {/* 字段名 */}
          <span className="text-slate-500 text-[11px] px-0.5">字段名</span>
          <input
            type="text"
            value={rule.fieldName}
            onChange={(e) => updateField('fieldName', e.target.value)}
            placeholder="字段名"
            className="w-20 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />

          {/* Length suffix */}
          <CustomSelect
            value={rule.endSuffixType}
            options={['长度', '终止符']}
            onChange={(val) => updateField('endSuffixType', val as '终止符' | '长度')}
            minWidth="min-w-[66px]"
            dropdownWidth="w-24"
          />

          <input
            type="text"
            value={rule.length}
            onChange={(e) => updateField('length', e.target.value)}
            placeholder="4"
            className="w-14 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
          />
        </>
      ) : (
        /* DELIMITER MODE ROW */
        <>
          {/* Start Prefix */}
          <CustomSelect
            value={rule.startPrefixType}
            options={['起始符', '偏移量']}
            onChange={(val) => {
              if (val === '偏移量') {
                onChange({
                  ...rule,
                  ruleMode: 'offset',
                  startPrefixType: '偏移量',
                  endSuffixType: '长度',
                  offset: rule.startValue || '0',
                  length: '4',
                });
              } else {
                updateField('startPrefixType', val as '起始符' | '偏移量');
              }
            }}
            minWidth="min-w-[70px]"
            dropdownWidth="w-24"
          />

          <input
            type="text"
            value={rule.startValue}
            onChange={(e) => updateField('startValue', e.target.value)}
            placeholder="如 <channelcode>"
            className="w-28 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
          />

          {/* 连接符 */}
          <span className="text-slate-500 text-[11px] px-0.5">连接符</span>
          <input
            type="text"
            value={rule.connector}
            onChange={(e) => updateField('connector', e.target.value)}
            placeholder=""
            className="w-16 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
          />

          {/* End Suffix */}
          <CustomSelect
            value={rule.endSuffixType}
            options={['终止符', '长度']}
            onChange={(val) => updateField('endSuffixType', val as '终止符' | '长度')}
            minWidth="min-w-[66px]"
            dropdownWidth="w-24"
          />

          <input
            type="text"
            value={rule.endValue}
            onChange={(e) => updateField('endValue', e.target.value)}
            placeholder="如 </channelcode>"
            className="w-28 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
          />
        </>
      )}

      {/* Field Category - 包含全部41个参数分类与图例样式下拉 */}
      <FieldCategorySelect
        value={rule.fieldCategory}
        onChange={(val) => updateField('fieldCategory', val)}
      />

      {/* 正则匹配 */}
      <span className="text-slate-500 text-[11px] px-0.5">正则匹配</span>
      <input
        type="text"
        value={rule.regex}
        onChange={(e) => updateField('regex', e.target.value)}
        placeholder="正则表达式"
        className="w-20 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
      />

      {/* Charset - 包含用户截图的 UTF-8 与 GBK 下拉整理 */}
      <CustomSelect
        value={rule.charset}
        options={['UTF-8', 'GBK']}
        onChange={(val) => updateField('charset', val as Charset)}
        minWidth="min-w-[72px]"
        dropdownWidth="w-24"
      />

      {/* Extended options (页面展示名称, 脱敏, 多维分析) - Figure 3 & Figure 4 */}
      {showExtendedOptions && (
        <>
          <span className="text-slate-500 text-[11px] px-0.5">页面展示名称</span>
          <input
            type="text"
            value={rule.displayName || ''}
            onChange={(e) => updateField('displayName', e.target.value)}
            placeholder="展示别名"
            className="w-20 h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />

          <span title="字段标签" className="inline-flex items-center">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
          </span>

          {/* 脱敏规则下拉 */}
          <CustomSelect
            value={rule.desensitize || '不脱敏'}
            options={['不脱敏', '掩码脱敏', '姓名脱敏', '卡号脱敏', '手机号脱敏']}
            onChange={(val) => updateField('desensitize', val as DesensitizeType)}
            minWidth="min-w-[76px]"
            dropdownWidth="w-28"
          />

          {/* 多维分析 switch */}
          <div className="flex items-center gap-1 ml-1 bg-white px-2 py-0.5 border border-slate-200 rounded">
            <span className="text-[11px] text-slate-600">多维分析</span>
            <button
              type="button"
              onClick={() => updateField('multiDimAnalysis', !rule.multiDimAnalysis)}
              className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                rule.multiDimAnalysis ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              title={rule.multiDimAnalysis ? '多维分析已开启' : '多维分析已关闭'}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-xs transform transition-transform ${
                  rule.multiDimAnalysis ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-[10px] font-medium ${rule.multiDimAnalysis ? 'text-blue-600' : 'text-slate-400'}`}>
              {rule.multiDimAnalysis ? '开启' : '关闭'}
            </span>
          </div>
        </>
      )}

      {/* 启用 Checkbox */}
      <label className="flex items-center gap-1 cursor-pointer select-none ml-1 px-1 py-0.5 text-slate-700">
        <input
          type="checkbox"
          checked={rule.enabled}
          onChange={(e) => updateField('enabled', e.target.checked)}
          className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
        />
        <span className="text-xs">启用</span>
      </label>

      {/* Delete trash button */}
      <button
        type="button"
        onClick={onDelete}
        title="删除此规则行"
        className="w-7 h-7 ml-auto flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
