export const FIELD_CATEGORIES = [
  '普通号',
  '功能号',
  '追踪号',
  '渠道号',
  '子渠道号',
  '子功能号',
  '统计号1',
  '统计号2',
  '统计号3',
  '返回码',
  '字符串1',
  '字符串2',
  '字符串3',
  '字符串4',
  '字符串5',
  '字符串6',
  '字符串7',
  '字符串8',
  '字符串9',
  '字符串10',
  '字符串11',
  '字符串12',
  '字符串13',
  '字符串14',
  '字符串15',
  '整型1',
  '整型2',
  '整型3',
  '整型4',
  '整型5',
  '整型6',
  '整型7',
  '整型8',
  '整型9',
  '整型10',
  '浮点数1',
  '浮点数2',
  '浮点数3',
  '浮点数4',
  '浮点数5',
  '包长度',
] as const;

export type FieldCategory = (typeof FIELD_CATEGORIES)[number];
export type Charset = 'UTF-8' | 'GBK' | 'GB2312' | 'ISO-8859-1' | 'ASCII';
export type DesensitizeType = '不脱敏' | '掩码脱敏' | '姓名脱敏' | '卡号脱敏' | '手机号脱敏';

export interface ParameterRule {
  id: string;
  ruleMode: 'delimiter' | 'offset'; // delimiter: 起始符/终止符; offset: 偏移量/长度
  // Delimiter mode fields
  startPrefixType: '起始符' | '偏移量';
  startValue: string;
  connector: string;
  endSuffixType: '终止符' | '长度';
  endValue: string;
  
  // Offset mode fields
  offset: string;
  fieldName: string;
  length: string;
  
  // Common fields
  fieldCategory: FieldCategory;
  regex: string;
  charset: Charset;
  displayName?: string;
  desensitize?: DesensitizeType;
  multiDimAnalysis?: boolean;
  enabled: boolean;
}

export interface TcpStringModel {
  id: number;
  name: string;
  requestParamsSummary: string;
  responseParamsSummary: string;
  requestRules: ParameterRule[];
  responseRules: ParameterRule[];
  saveFullRequest: boolean;
  saveFullResponse: boolean;
  createTime: string;
}

export interface AppRecord {
  id: string;
  appId: string;
  appName: string;
  destIp: string;
  destPort: string;
  packetLength: string;
  enabled: boolean;
}
