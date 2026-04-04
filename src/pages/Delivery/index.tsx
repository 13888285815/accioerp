import React, { useState } from 'react';
import { Truck, Plus, Search, MapPin, Clock, CheckCircle, AlertTriangle, User, Package, Eye, Navigation } from 'lucide-react';

interface DeliveryOrder {
  id: string; orderNo: string; customer: string; address: string; city: string;
  courier: string; phone: string; items: string; qty: number;
  status: 'pending' | 'assigned' | 'pickup' | 'delivering' | 'delivered' | 'failed';
  scheduledAt: string; deliveredAt: string; distance: number; fee: number;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:    { label: '待分配', color: 'bg-gray-100 text-gray-600', icon: Clock },
  assigned:   { label: '已分配', color: 'bg-blue-50 text-blue-600', icon: User },
  pickup:     { label: '已取货', color: 'bg-indigo-50 text-indigo-600', icon: Package },
  delivering: { label: '配送中', color: 'bg-yellow-50 text-yellow-700', icon: Navigation },
  delivered:  { label: '已送达', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  failed:     { label: '配送失败', color: 'bg-red-50 text-red-600', icon: AlertTriangle },
};

const initData: DeliveryOrder[] = [
  { id: '1', orderNo: 'DL2026040001', customer: '张小明', address: '朝阳区建国路88号3单元502', city: '北京', courier: '王师傅(粤A12345)', phone: '138****8888', items: '智能手机 + 配件', qty: 3, status: 'delivering', scheduledAt: '2026-04-04 10:00-12:00', deliveredAt: '-', distance: 8.5, fee: 12 },
  { id: '2', orderNo: 'DL2026040002', customer: '李丽娜', address: '浦东新区张江高科技园区XX路1号', city: '上海', courier: '陈师傅(沪B54321)', phone: '139****6666', items: '家用电器套装', qty: 1, status: 'delivered', scheduledAt: '2026-04-04 09:00-11:00', deliveredAt: '2026-04-04 10:32', distance: 12.3, fee: 18 },
  { id: '3', orderNo: 'DL2026040003', customer: '赵伟', address: '天河区天河路385号太古汇', city: '广州', courier: '-', phone: '137****5555', items: '服装礼盒 5件套', qty: 5, status: 'pending', scheduledAt: '2026-04-05 14:00-16:00', deliveredAt: '-', distance: 6.2, fee: 10 },
  { id: '4', orderNo: 'DL2026040004', customer: '孙晓红', address: '南山区科技园南区高新南七道', city: '深圳', courier: '刘师傅(粤B99999)', phone: '186****7777', items: '电子产品', qty: 2, status: 'failed', scheduledAt: '2026-04-04 15:00-17:00', deliveredAt: '-', distance: 9.1, fee: 14, },
  { id: '5', orderNo: 'DL2026040005', customer: '周建国', address: '武侯区天府大道北段1700号', city: '成都', courier: '张师傅(川A77777)', phone: '189****2222', items: '生鲜食品', qty: 8, status: 'pickup', scheduledAt: '2026-04-04 11:00-13:00', deliveredAt: '-', distance: 5.8, fee: 9 },
];

export default function DeliveryPage() {
  const [data] = useState<DeliveryOrder[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.orderNo.includes(search) || d.customer.includes(search) || d.courier.includes(search))
  );

  const deliveringCount = data.filter(d => d.status === 'delivering' || d.status === 'pickup').length;
  const deliveredCount = data.filter(d => d.status === 'delivered').length;
  const failedCount = data.filter(d => d.status === 'failed').length;
  const totalFee = data.reduce((s, d) => s + d.fee, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">配送管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">最后一公里配送订单跟踪与调度</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建配送单
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '配送中', value: deliveringCount, icon: Navigation, color: 'text-blue-500 bg-blue-50' },
          { label: '今日送达', value: deliveredCount, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '配送失败', value: failedCount, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
          { label: '配送费合计', value: `¥${totalFee}`, icon: Truck, color: 'text-purple-500 bg-purple-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索单号/客户/快递员…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(d => {
          const s = statusMap[d.status];
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-blue-600">{d.orderNo}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${s.color}`}><s.icon size={10} />{s.label}</span>
                    <span className="text-xs text-gray-400">距离 {d.distance}km · 费用 ¥{d.fee}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <User size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{d.customer}</span>
                    <span className="text-gray-400 text-xs">{d.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">[{d.city}] {d.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span><Package size={10} className="inline mr-0.5" />{d.items} ×{d.qty}</span>
                    <span><Truck size={10} className="inline mr-0.5" />配送员：{d.courier}</span>
                    <span><Clock size={10} className="inline mr-0.5" />约定：{d.scheduledAt}</span>
                    {d.deliveredAt !== '-' && <span><CheckCircle size={10} className="inline mr-0.5 text-emerald-500" />送达：{d.deliveredAt}</span>}
                  </div>
                </div>
                <button className="flex-shrink-0 p-2 hover:bg-blue-50 text-blue-500 rounded-xl"><Eye size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
