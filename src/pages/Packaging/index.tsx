import React, { useState } from 'react';
import { Box, Plus, Search, Package, CheckCircle, Clock, AlertTriangle, Printer, BarChart, Eye } from 'lucide-react';

interface PackOrder {
  id: string; orderNo: string; refOrder: string; product: string; qty: number;
  packType: string; boxSpec: string; packMaterial: string;
  status: 'pending' | 'packing' | 'done' | 'exception';
  operator: string; startedAt: string; completedAt: string;
  labelPrinted: boolean; fragile: boolean; specialReq: string;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: '待包装', color: 'bg-gray-100 text-gray-600', icon: Clock },
  packing:   { label: '包装中', color: 'bg-blue-50 text-blue-600', icon: Box },
  done:      { label: '已完成', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  exception: { label: '异常', color: 'bg-red-50 text-red-600', icon: AlertTriangle },
};

const initData: PackOrder[] = [
  { id: '1', orderNo: 'PK20260001', refOrder: 'SO20260001', product: '蓝牙耳机 Pro', qty: 50, packType: '标准盒装', boxSpec: '20x15x8cm', packMaterial: '飞机盒+气泡膜', status: 'done', operator: '刘美丽', startedAt: '08:30', completedAt: '09:15', labelPrinted: true, fragile: false, specialReq: '' },
  { id: '2', orderNo: 'PK20260002', refOrder: 'SO20260002', product: '陶瓷茶具套装', qty: 20, packType: '礼品盒装', boxSpec: '40x30x20cm', packMaterial: '木质礼盒+珍珠棉', status: 'packing', operator: '王大壮', startedAt: '09:20', completedAt: '-', labelPrinted: true, fragile: true, specialReq: '易碎品，四角加固' },
  { id: '3', orderNo: 'PK20260003', refOrder: 'SO20260003', product: '运动鞋 Air系列', qty: 30, packType: '标准盒装', boxSpec: '35x25x15cm', packMaterial: '鞋盒+外纸箱', status: 'pending', operator: '-', startedAt: '-', completedAt: '-', labelPrinted: false, fragile: false, specialReq: '' },
  { id: '4', orderNo: 'PK20260004', refOrder: 'SO20260004', product: '液晶显示器 27寸', qty: 5, packType: '原厂包装', boxSpec: '70x50x45cm', packMaterial: '原装+泡沫+收缩膜', status: 'exception', operator: '张小红', startedAt: '08:00', completedAt: '-', labelPrinted: true, fragile: true, specialReq: '超大件，需两人操作' },
  { id: '5', orderNo: 'PK20260005', refOrder: 'SO20260005', product: '棉质T恤 5件套', qty: 100, packType: '简易袋装', boxSpec: 'OPP袋', packMaterial: '透明OPP袋', status: 'done', operator: '陈小明', startedAt: '07:45', completedAt: '08:30', labelPrinted: true, fragile: false, specialReq: '' },
];

export default function PackagingPage() {
  const [data] = useState<PackOrder[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.orderNo.includes(search) || d.product.includes(search) || d.operator.includes(search))
  );

  const totalQty = data.reduce((s, d) => s + d.qty, 0);
  const doneCount = data.filter(d => d.status === 'done').length;
  const packingCount = data.filter(d => d.status === 'packing').length;
  const exceptionCount = data.filter(d => d.status === 'exception').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">包装管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">包装工单、物料规格与标签打印管理</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建包装单
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日包装总量', value: totalQty, icon: Box, color: 'text-blue-500 bg-blue-50' },
          { label: '包装中', value: packingCount, icon: Package, color: 'text-indigo-500 bg-indigo-50' },
          { label: '已完成', value: doneCount, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '异常', value: exceptionCount, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索单号/商品/操作员…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
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
              <tr>{['包装单号', '关联订单', '商品', '数量', '包装类型', '箱规', '操作员', '时间', '标签', '特殊要求', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const st = statusMap[d.status];
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{d.orderNo}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{d.refOrder}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-36 truncate">
                      {d.fragile && <span className="mr-1 text-red-500" title="易碎">⚠️</span>}
                      {d.product}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-right">{d.qty}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.packType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{d.boxSpec}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{d.operator !== '-' ? d.operator : <span className="text-gray-300">未分配</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{d.startedAt !== '-' ? `${d.startedAt}${d.completedAt !== '-' ? ` → ${d.completedAt}` : ''}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {d.labelPrinted
                        ? <span className="text-xs text-emerald-600 flex items-center gap-0.5"><Printer size={11} />已打印</span>
                        : <button className="text-xs text-blue-600 flex items-center gap-0.5 hover:underline"><Printer size={11} />打印</button>}
                    </td>
                    <td className="px-4 py-3 text-xs text-orange-600 max-w-32 truncate">{d.specialReq || <span className="text-gray-300">-</span>}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">共 {filtered.length} 条记录</div>
      </div>
    </div>
  );
}
