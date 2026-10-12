import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface BusinessFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessFieldsModal: React.FC<BusinessFieldsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const fields = [
    { name: '普通号', type: '通用参数', desc: '基础报文标识字段，用于通用特征提取与常规统计匹配。', example: 'version, msgType' },
    { name: '功能号 / 子功能号', type: '交易分类', desc: '主交易功能码及子功能分支代码，用于请求行为定性分析。', example: 'funcCode, subFunc' },
    { name: '渠道号 / 子渠道号', type: '路由特征', desc: '发起请求的前置渠道代码或客户端应用分支标识。', example: '<channelcode>0102</channelcode>' },
    { name: '追踪号', type: '全链路追踪', desc: '单笔交易或报文在全局分布式系统中的唯一追踪流水号。', example: '<channelserno>SN92019401</channelserno>' },
    { name: '统计号1 ~ 统计号3', type: '核心度量', desc: '映射为金额、笔数、积分等关键数值度量维度。', example: '<amount>1500.00</amount>' },
    { name: '返回码', type: '状态结果', desc: '服务端处理返回结果码，如成功000000、失败错误代码等。', example: '<dealcode>0000</dealcode>' },
    { name: '字符串1 ~ 字符串15', type: '文本扩展', desc: '15组通用字符串扩展槽位，存储商户名、账号、备注等。', example: 'userName, remark' },
    { name: '整型1 ~ 整型10', type: '整数扩展', desc: '10组整型扩展槽位，存储重试次数、批次序号、终端类型等。', example: 'retryCount: 3' },
    { name: '浮点数1 ~ 浮点数5', type: '浮点扩展', desc: '5组浮点数扩展槽位，存储费率、折扣比率、汇率等高精数据。', example: 'discountRate: 0.85' },
    { name: '包长度', type: '定长/偏移', desc: '报文头部指定的TCP报文体实际字节长度或偏移位置。', example: '偏移量:4; 长度:4' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="h-11 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800">业务字段定义字典</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <p className="text-xs text-slate-500 mb-3">
            在TCP字符串模型及定长模型中，提取出来的字段可映射到以下标准业务字段，用于拓扑大盘、慢交易下钻与多维分析。
          </p>

          <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-2 px-3 w-24">字段分类</th>
                  <th className="py-2 px-3 w-24">属性类型</th>
                  <th className="py-2 px-3">业务说明</th>
                  <th className="py-2 px-3 w-44">典型提取示例</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => (
                  <tr key={f.name} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-semibold text-blue-700">{f.name}</td>
                    <td className="py-2 px-3 text-slate-600">{f.type}</td>
                    <td className="py-2 px-3 text-slate-700">{f.desc}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{f.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-11 px-5 border-t border-slate-200 flex items-center justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
