import React, { useState } from 'react';
import { Shield, Plus, Search, DollarSign, CheckCircle, Clock, AlertTriangle, Download, FileText, BarChart, Calendar } from 'lucide-react';

interface TaxRecord {
  id: string; period: string; taxType: string; taxableAmount: number;
  taxRate: number; taxAmount: number; paidAmount: number;
  status: 'draft' | 'declared' | 'paid' | 'overdue' | 'exempted';
  dueDate: string; paidDate: string; refNo: string; remark: string;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft:     { label: '草稿', color: 'bg-gray-100 text-gray-600', icon: FileText },
  declared:  { label: '已申报', color: 'bg-blue-50 text-blue-600', icon: Clock },
  paid:      { label: '已缴纳', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  overdue:   { label: '逾期', color: 'bg-red-50 text-red-600', icon: AlertTriangle },
  exempted:  { label: '已减免', color: 'bg-purple-50 text-purple-600', icon: Shield },
};

const initData: TaxRecord[] = [
  { id: '1', period: '2026-03', taxType: '增值税', taxableAmount: 2860000, taxRate: 13, taxAmount: 371800, paidAmount: 371800, status: 'paid', dueDate: '2026-04-15', paidDate: '2026-04-10', refNo: 'TAX-VAT-2026-03', remark: '' },
  { id: '2', period: '2026-03', taxType: '企业所得税（季报）', taxableAmount: 580000, taxRate: 25, taxAmount: 145000, paidAmount: 145000, status: 'paid', dueDate: '2026-04-15', paidDate: '2026-04-12', refNo: 'TAX-CIT-2026-Q1', remark: '季度预缴' },
  { id: '3', period: '2026-04', taxType: '增值税', taxableAmount: 3120000, taxRate: 13, taxAmount: 405600, paidAmount: 0, status: 'declared', dueDate: '2026-05-15', paidDate: '-', refNo: 'TAX-VAT-2026-04', remark: '' },
  { id: '4', period: '2026-03', taxType: '个人所得税', taxableAmount: 920000, taxRate: 0, taxAmount: 38400, paidAmount: 38400, status: 'paid', dueDate: '2026-04-15', paidDate: '2026-04-08', refNo: 'TAX-IIT-2026-03', remark: '代扣代缴' },
  { id: '5', period: '2026-03', taxType: '印花税', taxableAmount: 1200000, taxRate: 0.03, taxAmount: 360, paidAmount: 0, status: 'overdue', dueDate: '2026-04-01', paidDate: '-', refNo: 'TAX-SD-2026-03', remark: '合同印花税' },
  { id: '6', period: '2026-04', taxType: '城建税及附加', taxableAmount: 405600, taxRate: 12, taxAmount: 48672, paidAmount: 0, status: 'draft', dueDate: '2026-05-15', paidDate: '-', refNo: '-', remark: '随增值税附征' },
  { id: '7', period: '2025-Q4', taxType: '土地增值税', taxableAmount: 0, taxRate: 0, taxAmount: 0, paidAmount: 0, status: 'exempted', dueDate: '2026-01-31', paidDate: '-', refNo: 'TAX-LVT-2025-Q4', remark: '符合免征条件' },
];

const TAX_TYPES = ['增值税', '企业所得税（季报）', '个人所得税', '印花税', '城建税及附加', '土地增值税'];

export default function TaxPage() {
  const [data] = useState<TaxRecord[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (filterType === 'all' || d.taxType === filterType) &&
    (d.period.includes(search) || d.taxType.includes(search) || d.refNo.includes(search))
  );

  const totalTax = data.filter(d => d.status !== 'exempted').reduce((s, d) => s + d.taxAmount, 0);
  const paidTax = data.filter(d => d.status === 'paid').reduce((s, d) => s + d.paidAmount, 0);
  const overdueCount = data.filter(d => d.status === 'overdue').length;
  const unpaidTax = totalTax - paidTax;

  // 税种汇总
  const taxSummary = TAX_TYPES.map(t => ({
    type: t,
    total: data.filter(d => d.taxType === t).reduce((s, d) => s + d.taxAmount, 0),
    paid: data.filter(d => d.taxType === t && d.status === 'paid').reduce((s, d) => s + d.paidAmount, 0),
  })).filter(t => t.total > 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">税务管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">税务申报、缴纳与合规跟踪</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
            <Download size={14} /> 导出申报
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
            <Plus size={16} /> 新建税单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '税款总计', value: `¥${(totalTax / 10000).toFixed(1)}万`, icon: DollarSign, color: 'text-blue-500 bg-blue-50' },
          { label: '已缴纳', value: `¥${(paidTax / 10000).toFixed(1)}万`, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '待缴纳', value: `¥${(unpaidTax / 10000).toFixed(1)}万`, icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
          { label: '逾期未缴', value: overdueCount, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 税种概览 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">税种汇总</h3>
        <div className="space-y-3">
          {taxSummary.map(t => {
            const paidPct = Math.round((t.paid / t.total) * 100);
            return (
              <div key={t.type}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{t.type}</span>
                  <span className="text-gray-400 text-xs">¥{t.paid.toLocaleString()} / ¥{t.total.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${paidPct === 100 ? 'bg-emerald-500' : paidPct > 0 ? 'bg-blue-500' : 'bg-gray-300'}`} style={{ width: `${paidPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索期间/税种/申报号…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部税种</option>
          {TAX_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['申报期间', '税种', '计税金额', '税率', '应纳税额', '已缴税额', '申报号', '截止日期', '缴纳日期', '备注', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const st = statusMap[d.status];
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-bold text-gray-700 whitespace-nowrap">{d.period}</td>
                    <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{d.taxType}</td>
                    <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">{d.taxableAmount > 0 ? `¥${d.taxableAmount.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{d.taxRate > 0 ? `${d.taxRate}%` : '-'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">¥{d.taxAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium whitespace-nowrap">{d.paidAmount > 0 ? `¥${d.paidAmount.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{d.refNo}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className={d.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-gray-400'}>{d.dueDate}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{d.paidDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-28 truncate">{d.remark || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap flex gap-1">
                      <button className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-lg"><Download size={13} /></button>
                      {(d.status === 'declared' || d.status === 'overdue') && (
                        <button className="p-1.5 hover:bg-emerald-50 text-emerald-500 rounded-lg" title="缴纳税款"><DollarSign size={13} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">共 {filtered.length} 条税务记录</div>
      </div>
    </div>
  );
}
