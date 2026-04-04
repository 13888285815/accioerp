import React, { useState } from 'react';
import { Truck, Plus, Search, Calendar, DollarSign, User, MapPin, AlertTriangle, CheckCircle, Clock, Eye, Pencil } from 'lucide-react';

interface Vehicle { id: string; plateNo: string; type: string; driver: string; phone: string; capacity: number; status: 'idle' | 'dispatched' | 'maintenance'; }
interface TransportPlan { id: string; planNo: string; vehicleId: string; plateNo: string; driver: string; route: string; cargo: string; weight: number; status: 'planned' | 'dispatched' | 'completed' | 'cancelled'; scheduledAt: string; cost: number; }

const initVehicles: Vehicle[] = [
  { id: 'v1', plateNo: '粤A 12345', type: '4.2米厢货', driver: '王师傅', phone: '138****1111', capacity: 1500, status: 'dispatched' },
  { id: 'v2', plateNo: '粤B 54321', type: '9.6米高栏', driver: '李师傅', phone: '139****2222', capacity: 8000, status: 'idle' },
  { id: 'v3', plateNo: '粤C 99999', type: '13米半挂', driver: '张师傅', phone: '136****3333', capacity: 25000, status: 'maintenance' },
  { id: 'v4', plateNo: '粤D 77777', type: '7.6米厢货', driver: '赵师傅', phone: '137****4444', capacity: 5000, status: 'idle' },
];

const initPlans: TransportPlan[] = [
  { id: '1', planNo: 'TP2026040001', vehicleId: 'v1', plateNo: '粤A 12345', driver: '王师傅', route: '深圳龙华 → 广州增城', cargo: '电子产品', weight: 1200, status: 'dispatched', scheduledAt: '2026-04-04 06:00', cost: 1800 },
  { id: '2', planNo: 'TP2026040002', vehicleId: 'v2', plateNo: '粤B 54321', driver: '李师傅', route: '广州黄埔 → 深圳盐田港', cargo: '家居用品', weight: 7200, status: 'planned', scheduledAt: '2026-04-05 08:00', cost: 3200 },
  { id: '3', planNo: 'TP2026040003', vehicleId: 'v4', plateNo: '粤D 77777', driver: '赵师傅', route: '东莞虎门 → 佛山南海', cargo: '服装面料', weight: 3800, status: 'completed', scheduledAt: '2026-04-03 07:00', cost: 2400 },
  { id: '4', planNo: 'TP2026040004', vehicleId: 'v3', plateNo: '粤C 99999', driver: '张师傅', route: '深圳龙岗 → 上海浦东', cargo: '重型机械', weight: 22000, status: 'cancelled', scheduledAt: '2026-04-02 05:00', cost: 0 },
];

const vStatusMap: Record<string, { label: string; color: string }> = {
  idle:        { label: '空闲', color: 'bg-emerald-50 text-emerald-600' },
  dispatched:  { label: '派车中', color: 'bg-blue-50 text-blue-600' },
  maintenance: { label: '维护中', color: 'bg-yellow-50 text-yellow-700' },
};
const pStatusMap: Record<string, { label: string; color: string }> = {
  planned:   { label: '计划中', color: 'bg-gray-100 text-gray-600' },
  dispatched:{ label: '已派车', color: 'bg-blue-50 text-blue-600' },
  completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-600' },
  cancelled: { label: '已取消', color: 'bg-red-50 text-red-500' },
};

export default function TransportPage() {
  const [vehicles] = useState<Vehicle[]>(initVehicles);
  const [plans, setPlans] = useState<TransportPlan[]>(initPlans);
  const [search, setSearch] = useState('');

  const filtered = plans.filter(p => p.planNo.includes(search) || p.cargo.includes(search) || p.driver.includes(search));
  const totalCost = plans.filter(p => p.status === 'completed').reduce((s, p) => s + p.cost, 0);
  const idleVehicles = vehicles.filter(v => v.status === 'idle').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">运输管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">车辆调度、运输计划与费用管理</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建运输计划
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '车辆总数', value: vehicles.length, icon: Truck, color: 'text-blue-500 bg-blue-50' },
          { label: '空闲车辆', value: idleVehicles, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '本月运费', value: `¥${totalCost.toLocaleString()}`, icon: DollarSign, color: 'text-purple-500 bg-purple-50' },
          { label: '维护中', value: vehicles.filter(v => v.status === 'maintenance').length, icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 车辆状态 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">车队状态</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vehicles.map(v => {
            const st = vStatusMap[v.status];
            return (
              <div key={v.id} className="border border-gray-100 rounded-xl p-3 space-y-1.5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-sm">{v.plateNo}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${st.color}`}>{st.label}</span>
                </div>
                <div className="text-xs text-gray-500">{v.type} · {(v.capacity / 1000).toFixed(1)}吨</div>
                <div className="text-xs text-gray-400"><User size={9} className="inline mr-0.5" />{v.driver} {v.phone}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 运输计划 */}
      <div className="flex gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索计划号/货物/司机…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['计划号', '车牌', '司机', '路线', '货物', '重量', '计划时间', '运费', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const st = pStatusMap[p.status];
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{p.planNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.plateNo}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.driver}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-40 truncate">{p.route}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-32 truncate">{p.cargo}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.weight.toLocaleString()}kg</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{p.scheduledAt}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{p.cost > 0 ? `¥${p.cost.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><button className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Eye size={13} /></button></td>
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
