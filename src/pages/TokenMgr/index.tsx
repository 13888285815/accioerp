import React, { useState } from 'react';
import { Zap, Plus, TrendingUp, AlertTriangle, Clock, RefreshCw, BarChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TokenRecord {
  id: string; action: string; module: string; tokens: number; type: 'consume' | 'recharge';
  user: string; time: string; balance: number;
}

const initRecords: TokenRecord[] = [
  { id: '1', action: 'AI分析库存预警', module: '库存管理', tokens: -120, type: 'consume', user: 'admin', time: '2026-04-03 14:32', balance: 8880 },
  { id: '2', action: '充值 10,000 Token', module: '充值', tokens: 10000, type: 'recharge', user: 'admin', time: '2026-04-03 10:00', balance: 9000 },
  { id: '3', action: 'AI生成采购建议', module: '采购管理', tokens: -280, type: 'consume', user: '李经理', time: '2026-04-02 16:45', balance: 8720 },
  { id: '4', action: 'AI财务报表摘要', module: '财务管理', tokens: -350, type: 'consume', user: 'admin', time: '2026-04-02 14:20', balance: 9000 },
  { id: '5', action: 'AI客户分析报告', module: 'CRM管理', tokens: -420, type: 'consume', user: '王销售', time: '2026-04-01 09:30', balance: 9350 },
  { id: '6', action: '充值 5,000 Token', module: '充值', tokens: 5000, type: 'recharge', user: 'admin', time: '2026-03-31 15:00', balance: 9770 },
  { id: '7', action: 'AI生成销售预测', module: '图表分析', tokens: -180, type: 'consume', user: 'admin', time: '2026-03-30 11:20', balance: 4770 },
];

const DAILY_USAGE = [80, 150, 320, 200, 420, 280, 120];
const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function TokenMgrPage() {
  const [records] = useState<TokenRecord[]>(initRecords);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(5000);

  const balance = 8880;
  const totalConsumed = records.filter(r => r.type === 'consume').reduce((s, r) => s + Math.abs(r.tokens), 0);
  const totalRecharged = records.filter(r => r.type === 'recharge').reduce((s, r) => s + r.tokens, 0);
  const avgDaily = Math.round(totalConsumed / 7);
  const maxBar = Math.max(...DAILY_USAGE);

  const PACKAGES = [
    { tokens: 1000, price: 9.9, label: '体验包' },
    { tokens: 5000, price: 39, label: '基础包' },
    { tokens: 10000, price: 69, label: '标准包', hot: true },
    { tokens: 50000, price: 299, label: '专业包' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Token 管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI 功能用量统计与充值管理</p>
        </div>
        <button onClick={() => setShowRecharge(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 充值 Token
        </button>
      </div>

      {/* 余额卡片 */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1 opacity-80 text-sm"><Zap size={14} />当前 Token 余额</div>
        <div className="text-5xl font-bold mb-1">{balance.toLocaleString()}</div>
        <div className="text-blue-200 text-sm">约可使用 AI 功能 <span className="font-semibold text-white">{Math.round(balance / avgDaily)}</span> 天</div>
        <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/70 rounded-full" style={{ width: `${Math.min(100, (balance / 10000) * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs mt-1 text-blue-200">
          <span>0</span><span>10,000</span>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本周消耗', value: totalConsumed.toLocaleString(), icon: TrendingUp, color: 'text-red-500 bg-red-50', suffix: 'Token' },
          { label: '本周充值', value: totalRecharged.toLocaleString(), icon: Zap, color: 'text-emerald-500 bg-emerald-50', suffix: 'Token' },
          { label: '日均消耗', value: avgDaily.toLocaleString(), icon: BarChart, color: 'text-blue-500 bg-blue-50', suffix: 'Token' },
          { label: '低余额预警', value: balance < 1000 ? '余额不足' : '正常', icon: AlertTriangle, color: balance < 1000 ? 'text-orange-500 bg-orange-50' : 'text-emerald-500 bg-emerald-50', suffix: '' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-lg font-bold text-gray-900">{c.value}<span className="text-xs text-gray-400 ml-1">{c.suffix}</span></div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 每日用量图 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4"><BarChart size={16} className="text-blue-500" /><h3 className="font-semibold text-gray-800">近7日用量</h3></div>
          <div className="flex items-end gap-2 h-28">
            {DAILY_USAGE.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-blue-500/80 transition-all" style={{ height: `${(v / maxBar) * 100}%` }} title={`${v} Token`} />
                <span className="text-[10px] text-gray-400">{DAYS[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400 text-right">峰值：{Math.max(...DAILY_USAGE)} Token/天</div>
        </div>

        {/* 消耗记录 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Clock size={15} className="text-purple-500" /><h3 className="font-semibold text-gray-800">消耗记录</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {records.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-800 truncate">{r.action}</div>
                  <div className="text-xs text-gray-400">{r.user} · {r.time}</div>
                </div>
                <div className={`text-sm font-bold flex-shrink-0 flex items-center gap-0.5 ${r.type === 'recharge' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {r.type === 'recharge' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {r.type === 'recharge' ? '+' : ''}{r.tokens.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 充值弹窗 */}
      {showRecharge && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">充值 Token</h2>
            <div className="grid grid-cols-2 gap-3">
              {PACKAGES.map(pkg => (
                <button key={pkg.tokens} onClick={() => setRechargeAmount(pkg.tokens)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${rechargeAmount === pkg.tokens ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  {pkg.hot && <span className="absolute -top-2 right-2 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">热门</span>}
                  <div className="text-lg font-bold text-gray-900">{pkg.tokens.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{pkg.label}</div>
                  <div className="text-sm font-semibold text-blue-600 mt-1">¥{pkg.price}</div>
                </button>
              ))}
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
              <span className="font-semibold">即将充值：</span>{rechargeAmount.toLocaleString()} Token
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRecharge(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={() => setShowRecharge(false)} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">立即支付</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
