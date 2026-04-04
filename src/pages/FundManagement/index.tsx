import React, { useState } from 'react';
import { Wallet, Plus, Search, DollarSign, TrendingUp, TrendingDown, ArrowRightLeft, AlertTriangle, Eye, Download, CreditCard, Building } from 'lucide-react';

interface FundRecord {
  id: string; no: string; type: 'inflow' | 'outflow' | 'transfer';
  account: string; counterpart: string; amount: number; currency: string;
  category: string; purpose: string; approver: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  date: string; valueDate: string; balance: number;
}

interface BankAccount {
  id: string; bankName: string; accountNo: string; accountName: string;
  currency: string; balance: number; type: '基本户' | '一般户' | '专用户';
  creditLine: number; usedCredit: number;
}

const bankAccounts: BankAccount[] = [
  { id: 'b1', bankName: '中国工商银行', accountNo: '6222 **** **** 1234', accountName: '意念科技（深圳）有限公司', currency: 'CNY', balance: 3_820_000, type: '基本户', creditLine: 5_000_000, usedCredit: 0 },
  { id: 'b2', bankName: '招商银行', accountNo: '6225 **** **** 5678', accountName: '意念科技（深圳）有限公司', currency: 'CNY', balance: 680_000, type: '一般户', creditLine: 2_000_000, usedCredit: 500_000 },
  { id: 'b3', bankName: 'HSBC（香港汇丰）', accountNo: '028 ****** 838', accountName: 'Yinian Technology (HK) Ltd', currency: 'USD', balance: 48_500, type: '基本户', creditLine: 200_000, usedCredit: 0 },
];

const initRecords: FundRecord[] = [
  { id: '1', no: 'FD2026040001', type: 'inflow', account: '工行基本户', counterpart: '北京科技创新有限公司', amount: 113_000, currency: 'CNY', category: '货款收入', purpose: 'INV-2026-0001 货款', approver: '王总', status: 'completed', date: '2026-04-01', valueDate: '2026-04-01', balance: 3_820_000 },
  { id: '2', no: 'FD2026040002', type: 'outflow', account: '工行基本户', counterpart: '华联科技供应商', amount: 56_800, currency: 'CNY', category: '货款支付', purpose: '3月采购货款', approver: '李总监', status: 'completed', date: '2026-04-02', valueDate: '2026-04-02', balance: 3_763_200 },
  { id: '3', no: 'FD2026040003', type: 'outflow', account: '工行基本户', counterpart: '员工', amount: 380_000, currency: 'CNY', category: '工资发放', purpose: '4月份工资', approver: '王总', status: 'pending', date: '2026-04-05', valueDate: '2026-04-05', balance: 3_383_200 },
  { id: '4', no: 'FD2026040004', type: 'transfer', account: '工行基本户 → 招行一般户', counterpart: '内部转账', amount: 200_000, currency: 'CNY', category: '内部调拨', purpose: '补充一般户备用金', approver: '财务总监', status: 'approved', date: '2026-04-03', valueDate: '2026-04-03', balance: 3_183_200 },
  { id: '5', no: 'FD2026040005', type: 'inflow', account: '招行一般户', counterpart: 'ABC Trading Ltd.', amount: 45_000, currency: 'USD', category: '外币收入', purpose: '出口货款 SO2026005', approver: '王总', status: 'completed', date: '2026-03-28', valueDate: '2026-03-30', balance: 48_500 },
  { id: '6', no: 'FD2026040006', type: 'outflow', account: '工行基本户', counterpart: '物业公司', amount: 85_000, currency: 'CNY', category: '租金支出', purpose: '4月仓库租金', approver: '李总监', status: 'rejected', date: '2026-04-02', valueDate: '-', balance: 0 },
];

const typeMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  inflow:   { label: '收入', color: 'text-emerald-600 bg-emerald-50', icon: TrendingUp },
  outflow:  { label: '支出', color: 'text-red-500 bg-red-50', icon: TrendingDown },
  transfer: { label: '转账', color: 'text-blue-600 bg-blue-50', icon: ArrowRightLeft },
};
const statusMap: Record<string, { label: string; color: string }> = {
  pending:   { label: '待审批', color: 'bg-yellow-50 text-yellow-700' },
  approved:  { label: '已批准', color: 'bg-blue-50 text-blue-600' },
  completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-600' },
  rejected:  { label: '已拒绝', color: 'bg-red-50 text-red-500' },
};

export default function FundManagementPage() {
  const [records] = useState<FundRecord[]>(initRecords);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = records.filter(r =>
    (filterType === 'all' || r.type === filterType) &&
    (r.no.includes(search) || r.purpose.includes(search) || r.counterpart.includes(search))
  );

  const totalInflow = records.filter(r => r.type === 'inflow' && r.status === 'completed').reduce((s, r) => s + r.amount, 0);
  const totalOutflow = records.filter(r => r.type === 'outflow' && r.status === 'completed').reduce((s, r) => s + r.amount, 0);
  const totalBalance = bankAccounts.filter(b => b.currency === 'CNY').reduce((s, b) => s + b.balance, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">资金管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">银行账户、资金流水与收支分析</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm"><Download size={14} />导出流水</button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm"><Plus size={16} />新建申请</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '账户总余额', value: `¥${(totalBalance / 10000).toFixed(0)}万`, icon: Wallet, color: 'text-blue-500 bg-blue-50' },
          { label: '本期收入', value: `¥${(totalInflow / 10000).toFixed(0)}万`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
          { label: '本期支出', value: `¥${(totalOutflow / 10000).toFixed(0)}万`, icon: TrendingDown, color: 'text-red-500 bg-red-50' },
          { label: '净现金流', value: `¥${((totalInflow - totalOutflow) / 10000).toFixed(0)}万`, icon: DollarSign, color: 'text-purple-500 bg-purple-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 银行账户 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {bankAccounts.map(b => (
          <div key={b.id} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building size={16} className="opacity-75" />
                <span className="text-sm opacity-90">{b.bankName}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-medium">{b.type}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{b.currency} {b.balance.toLocaleString()}</div>
            <div className="text-xs opacity-70 font-mono">{b.accountNo}</div>
            {b.usedCredit > 0 && (
              <div className="mt-3 text-xs">
                <div className="flex justify-between mb-1 opacity-70"><span>信用额度</span><span>¥{b.usedCredit.toLocaleString()} / ¥{b.creditLine.toLocaleString()}</span></div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white/70 rounded-full" style={{ width: `${(b.usedCredit / b.creditLine) * 100}%` }} /></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 资金流水 */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索编号/用途/往来方…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部类型</option>
          {Object.entries(typeMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['流水号', '类型', '账户', '往来方', '金额', '币种', '分类', '用途', '日期', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => {
                const tp = typeMap[r.type];
                const st = statusMap[r.status];
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{r.no}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${tp.color}`}><tp.icon size={10} />{tp.label}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-28 truncate">{r.account}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-32 truncate">{r.counterpart}</td>
                    <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${r.type === 'inflow' ? 'text-emerald-600' : r.type === 'outflow' ? 'text-red-500' : 'text-blue-600'}`}>
                      {r.type === 'inflow' ? '+' : r.type === 'outflow' ? '-' : ''}¥{r.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{r.currency}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{r.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-36 truncate">{r.purpose}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{r.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3"><button className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Eye size={13} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
