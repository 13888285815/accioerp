import React, { useState } from 'react';
import { ScanLine, Plus, Package, CheckCircle, Clock, AlertTriangle, Zap, BarChart, Search, RefreshCw } from 'lucide-react';

interface SortTask {
  id: string; taskNo: string; waveNo: string; sku: string; product: string;
  qty: number; sortedQty: number; chute: string; picker: string;
  status: 'pending' | 'sorting' | 'done' | 'exception'; priority: 'high' | 'normal' | 'low';
  startedAt: string;
}

const initData: SortTask[] = [
  { id: '1', taskNo: 'ST20260001', waveNo: 'W001', sku: 'SKU-BT-001', product: '蓝牙耳机 Pro', qty: 50, sortedQty: 50, chute: 'C-01', picker: '张三', status: 'done', priority: 'high', startedAt: '09:15' },
  { id: '2', taskNo: 'ST20260002', waveNo: 'W001', sku: 'SKU-SW-002', product: '智能手表 V3', qty: 30, sortedQty: 18, chute: 'C-02', picker: '李四', status: 'sorting', priority: 'high', startedAt: '09:20' },
  { id: '3', taskNo: 'ST20260003', waveNo: 'W002', sku: 'SKU-PH-003', product: '手机壳 透明款', qty: 200, sortedQty: 0, chute: 'C-03', picker: '王五', status: 'pending', priority: 'normal', startedAt: '-' },
  { id: '4', taskNo: 'ST20260004', waveNo: 'W002', sku: 'SKU-CH-004', product: '无线充电器 20W', qty: 80, sortedQty: 15, chute: 'C-04', picker: '赵六', status: 'exception', priority: 'high', startedAt: '09:10' },
  { id: '5', taskNo: 'ST20260005', waveNo: 'W003', sku: 'SKU-KE-005', product: '键盘 机械红轴', qty: 40, sortedQty: 40, chute: 'C-05', picker: '钱七', status: 'done', priority: 'low', startedAt: '08:55' },
  { id: '6', taskNo: 'ST20260006', waveNo: 'W003', sku: 'SKU-MO-006', product: '无线鼠标 静音款', qty: 60, sortedQty: 32, chute: 'C-06', picker: '孙八', status: 'sorting', priority: 'normal', startedAt: '09:25' },
];

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: '待分拣', color: 'bg-gray-100 text-gray-600', icon: Clock },
  sorting:   { label: '分拣中', color: 'bg-blue-50 text-blue-600', icon: ScanLine },
  done:      { label: '已完成', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  exception: { label: '异常', color: 'bg-red-50 text-red-600', icon: AlertTriangle },
};
const priorityMap: Record<string, { label: string; color: string }> = {
  high:   { label: '紧急', color: 'bg-red-50 text-red-600' },
  normal: { label: '普通', color: 'bg-blue-50 text-blue-600' },
  low:    { label: '低优先', color: 'bg-gray-100 text-gray-500' },
};

const CHUTES = Array.from({ length: 8 }, (_, i) => `C-0${i + 1}`);

export default function SortingPage() {
  const [data] = useState<SortTask[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.taskNo.includes(search) || d.product.includes(search) || d.picker.includes(search))
  );

  const totalQty = data.reduce((s, d) => s + d.qty, 0);
  const sortedQty = data.reduce((s, d) => s + d.sortedQty, 0);
  const accuracy = data.filter(d => d.status === 'done').length > 0
    ? Math.round((data.filter(d => d.status === 'done').reduce((s, d) => s + d.sortedQty, 0) / data.filter(d => d.status === 'done').reduce((s, d) => s + d.qty, 0)) * 100)
    : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分拣管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">波次拣货、分拣道口与准确率分析</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
            <RefreshCw size={14} /> 刷新
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
            <Plus size={16} /> 新建波次
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '总分拣量', value: `${sortedQty}/${totalQty}`, icon: Package, color: 'text-blue-500 bg-blue-50' },
          { label: '分拣中', value: data.filter(d => d.status === 'sorting').length, icon: ScanLine, color: 'text-indigo-500 bg-indigo-50' },
          { label: '分拣准确率', value: `${accuracy}%`, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '异常任务', value: data.filter(d => d.status === 'exception').length, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 道口状态 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">分拣道口状态</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {CHUTES.map(chute => {
            const task = data.find(d => d.chute === chute && d.status === 'sorting');
            return (
              <div key={chute} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border-2 transition-colors
                ${task ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <span className="text-xs font-bold text-gray-700">{chute}</span>
                {task ? <span className="text-[9px] text-blue-600 mt-0.5 text-center leading-tight">{task.picker}</span> : <span className="text-[9px] text-gray-400">空闲</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索任务/商品/拣货员…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['任务号', '波次', 'SKU', '商品', '数量', '已分拣', '进度', '道口', '拣货员', '优先级', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const st = statusMap[d.status];
                const pr = priorityMap[d.priority];
                const pct = Math.round((d.sortedQty / d.qty) * 100);
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{d.taskNo}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.waveNo}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{d.sku}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-36 truncate">{d.product}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">{d.qty}</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium text-right">{d.sortedQty}</td>
                    <td className="px-4 py-3 whitespace-nowrap min-w-24">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{d.chute}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{d.picker}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${pr.color}`}>{pr.label}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span></td>
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
