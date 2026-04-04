import React, { useState } from 'react';
import { FileText, Plus, Search, CheckCircle, Clock, XCircle, Eye, Pencil, Download, DollarSign, BarChart } from 'lucide-react';

interface Voucher {
  id: string; voucherNo: string; type: '收款' | '付款' | '转账' | '记账';
  summary: string; totalAmount: number; currency: string;
  debitAccount: string; creditAccount: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'posted';
  maker: string; approver: string; date: string; period: string;
  entries: { account: string; debit: number; credit: number }[];
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft:    { label: '草稿', color: 'bg-gray-100 text-gray-600', icon: FileText },
  pending:  { label: '待审批', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
  approved: { label: '已批准', color: 'bg-blue-50 text-blue-600', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'bg-red-50 text-red-600', icon: XCircle },
  posted:   { label: '已入账', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
};

const typeColors: Record<string, string> = {
  '收款': 'bg-emerald-50 text-emerald-700',
  '付款': 'bg-red-50 text-red-700',
  '转账': 'bg-blue-50 text-blue-700',
  '记账': 'bg-purple-50 text-purple-700',
};

const initData: Voucher[] = [
  { id: '1', voucherNo: 'V2026040001', type: '收款', summary: '客户张伟 货款收入 3月订单', totalAmount: 128600, currency: 'CNY', debitAccount: '1002 银行存款', creditAccount: '1122 应收账款', status: 'posted', maker: '李会计', approver: '王总监', date: '2026-04-01', period: '2026-04', entries: [{ account: '银行存款', debit: 128600, credit: 0 }, { account: '应收账款', debit: 0, credit: 128600 }] },
  { id: '2', voucherNo: 'V2026040002', type: '付款', summary: '供应商华联科技 货款支付', totalAmount: 56800, currency: 'CNY', debitAccount: '2202 应付账款', creditAccount: '1002 银行存款', status: 'approved', maker: '李会计', approver: '王总监', date: '2026-04-02', period: '2026-04', entries: [{ account: '应付账款', debit: 56800, credit: 0 }, { account: '银行存款', debit: 0, credit: 56800 }] },
  { id: '3', voucherNo: 'V2026040003', type: '记账', summary: '4月份员工工资计提', totalAmount: 380000, currency: 'CNY', debitAccount: '6601 销售费用', creditAccount: '2211 应付职工薪酬', status: 'pending', maker: '张会计', approver: '-', date: '2026-04-03', period: '2026-04', entries: [{ account: '销售费用', debit: 380000, credit: 0 }, { account: '应付职工薪酬', debit: 0, credit: 380000 }] },
  { id: '4', voucherNo: 'V2026040004', type: '转账', summary: '资金内部划拨-备用金补充', totalAmount: 50000, currency: 'CNY', debitAccount: '1001 库存现金', creditAccount: '1002 银行存款', status: 'draft', maker: '王出纳', approver: '-', date: '2026-04-03', period: '2026-04', entries: [{ account: '库存现金', debit: 50000, credit: 0 }, { account: '银行存款', debit: 0, credit: 50000 }] },
  { id: '5', voucherNo: 'V2026040005', type: '付款', summary: '租金支付 4月份', totalAmount: 85000, currency: 'CNY', debitAccount: '6601 管理费用', creditAccount: '1002 银行存款', status: 'rejected', maker: '李会计', approver: '王总监', date: '2026-04-02', period: '2026-04', entries: [{ account: '管理费用', debit: 85000, credit: 0 }, { account: '银行存款', debit: 0, credit: 85000 }] },
];

export default function VoucherPage() {
  const [data] = useState<Voucher[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (filterType === 'all' || d.type === filterType) &&
    (d.voucherNo.includes(search) || d.summary.includes(search) || d.maker.includes(search))
  );

  const totalPosted = data.filter(d => d.status === 'posted').reduce((s, d) => s + d.totalAmount, 0);
  const pendingCount = data.filter(d => d.status === 'pending').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">凭证管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">财务凭证录入、审批与入账管理</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建凭证
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本期凭证数', value: data.length, icon: FileText, color: 'text-blue-500 bg-blue-50' },
          { label: '待审批', value: pendingCount, icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
          { label: '已入账金额', value: `¥${(totalPosted / 10000).toFixed(0)}万`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
          { label: '当前期间', value: '2026-04', icon: BarChart, color: 'text-purple-500 bg-purple-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索凭证号/摘要/制单人…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部类型</option>
          {['收款', '付款', '转账', '记账'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(d => {
          const st = statusMap[d.status];
          const expanded = expandedId === d.id;
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button className="w-full flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left" onClick={() => setExpandedId(expanded ? null : d.id)}>
                <span className="font-mono text-sm font-bold text-blue-600 flex-shrink-0">{d.voucherNo}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[d.type]}`}>{d.type}</span>
                <span className="flex-1 text-sm text-gray-700 truncate">{d.summary}</span>
                <span className="font-bold text-gray-900 whitespace-nowrap">¥{d.totalAmount.toLocaleString()}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">{d.date} · {d.maker}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span>
              </button>
              {expanded && (
                <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="text-left py-1 font-medium">科目</th>
                        <th className="text-right py-1 font-medium w-32">借方</th>
                        <th className="text-right py-1 font-medium w-32">贷方</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {d.entries.map((e, i) => (
                        <tr key={i} className="text-gray-700">
                          <td className="py-1.5 font-mono">{e.account}</td>
                          <td className="py-1.5 text-right text-emerald-700">{e.debit > 0 ? `¥${e.debit.toLocaleString()}` : '-'}</td>
                          <td className="py-1.5 text-right text-red-600">{e.credit > 0 ? `¥${e.credit.toLocaleString()}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-2 mt-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium"><Eye size={11} />详情</button>
                    {d.status === 'pending' && <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-medium"><CheckCircle size={11} />审批</button>}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium"><Download size={11} />导出</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
