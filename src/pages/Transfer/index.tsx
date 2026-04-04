import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Search, Package, Warehouse, CheckCircle, Clock, AlertTriangle, Eye, Truck, BarChart } from 'lucide-react';

interface TransferOrder {
  id: string; orderNo: string; product: string; sku: string;
  fromWarehouse: string; toWarehouse: string; qty: number; unit: string;
  reason: string; applicant: string; approver: string;
  status: 'draft' | 'pending' | 'approved' | 'picking' | 'in_transit' | 'received' | 'cancelled';
  priority: 'urgent' | 'normal' | 'low';
  createdAt: string; expectedAt: string; completedAt: string;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType; step: number }> = {
  draft:      { label: '草稿', color: 'bg-gray-100 text-gray-500', icon: Clock, step: 0 },
  pending:    { label: '待审批', color: 'bg-yellow-50 text-yellow-700', icon: Clock, step: 1 },
  approved:   { label: '已审批', color: 'bg-blue-50 text-blue-600', icon: CheckCircle, step: 2 },
  picking:    { label: '备货中', color: 'bg-indigo-50 text-indigo-600', icon: Package, step: 3 },
  in_transit: { label: '运输中', color: 'bg-purple-50 text-purple-600', icon: Truck, step: 4 },
  received:   { label: '已收货', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle, step: 5 },
  cancelled:  { label: '已取消', color: 'bg-red-50 text-red-500', icon: AlertTriangle, step: -1 },
};

const priorityMap: Record<string, { label: string; color: string }> = {
  urgent: { label: '紧急', color: 'bg-red-50 text-red-600' },
  normal: { label: '普通', color: 'bg-blue-50 text-blue-600' },
  low:    { label: '低', color: 'bg-gray-100 text-gray-500' },
};

const STEPS = ['草稿', '待审批', '已审批', '备货中', '运输中', '已收货'];

const initData: TransferOrder[] = [
  { id: '1', orderNo: 'TR2026040001', product: '蓝牙耳机 Pro Max', sku: 'SKU-BT-001', fromWarehouse: '深圳龙华仓', toWarehouse: '北京顺义仓', qty: 500, unit: '个', reason: '北京仓库存不足，补仓', applicant: '张运营', approver: '王总监', status: 'in_transit', priority: 'urgent', createdAt: '2026-04-01', expectedAt: '2026-04-06', completedAt: '-' },
  { id: '2', orderNo: 'TR2026040002', product: '无线充电器 20W', sku: 'SKU-CH-004', fromWarehouse: '广州番禺仓', toWarehouse: '上海浦东仓', qty: 200, unit: '个', reason: '均衡库存', applicant: '李运营', approver: '陈总监', status: 'approved', priority: 'normal', createdAt: '2026-04-02', expectedAt: '2026-04-07', completedAt: '-' },
  { id: '3', orderNo: 'TR2026040003', product: '机械键盘 红轴', sku: 'SKU-KE-005', fromWarehouse: '成都天府仓', toWarehouse: '西安高新仓', qty: 80, unit: '个', reason: '西安促销备货', applicant: '赵运营', approver: '王总监', status: 'picking', priority: 'normal', createdAt: '2026-04-03', expectedAt: '2026-04-05', completedAt: '-' },
  { id: '4', orderNo: 'TR2026040004', product: '液晶显示器 27寸', sku: 'SKU-MN-010', fromWarehouse: '深圳龙华仓', toWarehouse: '广州番禺仓', qty: 30, unit: '台', reason: '广州仓备货', applicant: '孙运营', approver: '-', status: 'pending', priority: 'low', createdAt: '2026-04-04', expectedAt: '2026-04-10', completedAt: '-' },
  { id: '5', orderNo: 'TR2026040005', product: '智能手表 V3', sku: 'SKU-SW-002', fromWarehouse: '上海浦东仓', toWarehouse: '杭州滨江仓', qty: 150, unit: '个', reason: '杭州库存补充', applicant: '钱运营', approver: '陈总监', status: 'received', priority: 'normal', createdAt: '2026-03-28', expectedAt: '2026-04-02', completedAt: '2026-04-02' },
];

export default function TransferPage() {
  const [data] = useState<TransferOrder[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (filterPriority === 'all' || d.priority === filterPriority) &&
    (d.orderNo.includes(search) || d.product.includes(search) || d.fromWarehouse.includes(search) || d.toWarehouse.includes(search))
  );

  const inTransitCount = data.filter(d => d.status === 'in_transit' || d.status === 'picking').length;
  const pendingCount = data.filter(d => d.status === 'pending').length;
  const completedCount = data.filter(d => d.status === 'received').length;
  const totalQty = data.reduce((s, d) => s + d.qty, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">调拨管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">跨仓库库存调拨申请、审批与在途跟踪</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm"><Plus size={16} />新建调拨单</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '调拨总量', value: totalQty, icon: ArrowRightLeft, color: 'text-blue-500 bg-blue-50' },
          { label: '待审批', value: pendingCount, icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
          { label: '运输中', value: inTransitCount, icon: Truck, color: 'text-indigo-500 bg-indigo-50' },
          { label: '已完成', value: completedCount, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索单号/商品/仓库…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部优先级</option>
          {Object.entries(priorityMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(d => {
          const st = statusMap[d.status];
          const pr = priorityMap[d.priority];
          const step = st.step;
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-blue-600">{d.orderNo}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${pr.color}`}>{pr.label}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span>
                </div>
                <div className="text-xs text-gray-400">{d.createdAt} · 申请人：{d.applicant}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><div className="text-xs text-gray-400">商品</div><div className="font-medium text-gray-800 truncate">{d.product}</div></div>
                <div><div className="text-xs text-gray-400">调拨数量</div><div className="font-bold text-blue-700">{d.qty.toLocaleString()} {d.unit}</div></div>
                <div>
                  <div className="text-xs text-gray-400">从 → 到</div>
                  <div className="text-gray-700 text-xs flex items-center gap-1">
                    <Warehouse size={10} className="text-gray-400" />
                    {d.fromWarehouse}
                    <ArrowRightLeft size={10} className="text-blue-400" />
                    <Warehouse size={10} className="text-gray-400" />
                    {d.toWarehouse}
                  </div>
                </div>
                <div><div className="text-xs text-gray-400">预计到达</div><div className="text-gray-600">{d.expectedAt}</div></div>
              </div>

              {/* 进度条 */}
              {step >= 0 && (
                <div className="flex items-center gap-1 overflow-x-auto">
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                      <div className={`flex-shrink-0 flex flex-col items-center gap-0.5`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {i < step ? '✓' : i + 1}
                        </div>
                        <span className={`text-[9px] whitespace-nowrap ${i === step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{s}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 min-w-4 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>原因：{d.reason}</span>
                <button className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium"><Eye size={11} />查看详情</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
