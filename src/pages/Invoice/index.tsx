import React, { useState } from 'react';
import { FileText, Plus, Search, CheckCircle, Clock, XCircle, Download, Send, DollarSign, Printer, Eye } from 'lucide-react';

interface Invoice {
  id: string; invoiceNo: string; type: '增值税专用发票' | '增值税普通发票' | '电子发票' | '形式发票';
  buyer: string; buyerTaxNo: string; seller: string;
  amount: number; taxRate: number; taxAmount: number; totalAmount: number;
  status: 'draft' | 'issued' | 'sent' | 'verified' | 'void';
  issueDate: string; dueDate: string; relatedOrder: string;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft:    { label: '草稿', color: 'bg-gray-100 text-gray-600', icon: FileText },
  issued:   { label: '已开具', color: 'bg-blue-50 text-blue-600', icon: CheckCircle },
  sent:     { label: '已发送', color: 'bg-indigo-50 text-indigo-600', icon: Send },
  verified: { label: '已验证', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  void:     { label: '已作废', color: 'bg-red-50 text-red-500', icon: XCircle },
};
const typeColors: Record<string, string> = {
  '增值税专用发票': 'bg-purple-50 text-purple-700',
  '增值税普通发票': 'bg-blue-50 text-blue-700',
  '电子发票':      'bg-teal-50 text-teal-700',
  '形式发票':      'bg-orange-50 text-orange-700',
};

const initData: Invoice[] = [
  { id: '1', invoiceNo: 'INV-2026-0001', type: '增值税专用发票', buyer: '北京科技创新有限公司', buyerTaxNo: '91110000123456789X', seller: '意念科技（深圳）有限公司', amount: 100000, taxRate: 13, taxAmount: 13000, totalAmount: 113000, status: 'verified', issueDate: '2026-04-01', dueDate: '2026-04-30', relatedOrder: 'SO2026001' },
  { id: '2', invoiceNo: 'INV-2026-0002', type: '增值税普通发票', buyer: '上海贸易集团有限公司', buyerTaxNo: '91310000987654321A', seller: '意念科技（深圳）有限公司', amount: 56000, taxRate: 9, taxAmount: 5040, totalAmount: 61040, status: 'sent', issueDate: '2026-04-02', dueDate: '2026-05-02', relatedOrder: 'SO2026002' },
  { id: '3', invoiceNo: 'INV-2026-0003', type: '电子发票', buyer: '广州电商零售有限公司', buyerTaxNo: '91440000555666777B', seller: '意念科技（深圳）有限公司', amount: 28000, taxRate: 6, taxAmount: 1680, totalAmount: 29680, status: 'issued', issueDate: '2026-04-03', dueDate: '2026-05-03', relatedOrder: 'SO2026003' },
  { id: '4', invoiceNo: 'INV-2026-0004', type: '增值税专用发票', buyer: '成都制造业集团公司', buyerTaxNo: '91510000333444555C', seller: '意念科技（深圳）有限公司', amount: 200000, taxRate: 13, taxAmount: 26000, totalAmount: 226000, status: 'draft', issueDate: '2026-04-03', dueDate: '2026-05-03', relatedOrder: 'SO2026004' },
  { id: '5', invoiceNo: 'INV-2026-0005', type: '形式发票', buyer: 'ABC Trading Ltd.', buyerTaxNo: 'N/A', seller: '意念科技（深圳）有限公司', amount: 45000, taxRate: 0, taxAmount: 0, totalAmount: 45000, status: 'sent', issueDate: '2026-03-28', dueDate: '2026-04-28', relatedOrder: 'SO2026005' },
  { id: '6', invoiceNo: 'INV-2026-0006', type: '增值税普通发票', buyer: '武汉商贸有限公司', buyerTaxNo: '91420000111222333D', seller: '意念科技（深圳）有限公司', amount: 12000, taxRate: 9, taxAmount: 1080, totalAmount: 13080, status: 'void', issueDate: '2026-03-25', dueDate: '2026-04-25', relatedOrder: 'SO2026006' },
];

export default function InvoicePage() {
  const [data] = useState<Invoice[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (filterType === 'all' || d.type === filterType) &&
    (d.invoiceNo.includes(search) || d.buyer.includes(search) || d.relatedOrder.includes(search))
  );

  const totalTaxAmount = data.filter(d => d.status !== 'void').reduce((s, d) => s + d.taxAmount, 0);
  const totalAmount = data.filter(d => d.status !== 'void').reduce((s, d) => s + d.totalAmount, 0);
  const pendingCount = data.filter(d => d.status === 'draft' || d.status === 'issued').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">发票管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">增值税发票开具、发送与验证管理</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 开具发票
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '发票总数', value: data.length, icon: FileText, color: 'text-blue-500 bg-blue-50' },
          { label: '待处理', value: pendingCount, icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
          { label: '含税总额', value: `¥${(totalAmount / 10000).toFixed(1)}万`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
          { label: '税额合计', value: `¥${(totalTaxAmount / 10000).toFixed(1)}万`, icon: DollarSign, color: 'text-purple-500 bg-purple-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索发票号/购方/关联订单…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部类型</option>
          {Object.keys(typeColors).map(t => <option key={t} value={t}>{t}</option>)}
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
              <tr>{['发票号', '类型', '购方', '税号', '不含税金额', '税率', '税额', '含税合计', '关联订单', '开票日期', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const st = statusMap[d.status];
                return (
                  <tr key={d.id} className={`hover:bg-gray-50 transition-colors ${d.status === 'void' ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{d.invoiceNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[d.type]}`}>{d.type}</span></td>
                    <td className="px-4 py-3 text-gray-800 max-w-36 truncate">{d.buyer}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{d.buyerTaxNo}</td>
                    <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">¥{d.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{d.taxRate}%</td>
                    <td className="px-4 py-3 text-right text-orange-600 whitespace-nowrap">¥{d.taxAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">¥{d.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{d.relatedOrder}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{d.issueDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap flex gap-1">
                      <button className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-lg"><Download size={13} /></button>
                      {d.status === 'issued' && <button className="p-1.5 hover:bg-green-50 text-green-500 rounded-lg"><Send size={13} /></button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">共 {filtered.length} 条发票记录</div>
      </div>
    </div>
  );
}
