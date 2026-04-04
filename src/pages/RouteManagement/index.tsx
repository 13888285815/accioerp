import React, { useState } from 'react';
import { Route, Plus, Search, MapPin, Clock, Truck, CheckCircle, AlertTriangle, BarChart, Eye, Edit2 } from 'lucide-react';

interface RouteStop { name: string; type: 'warehouse' | 'customer' | 'hub'; estimatedTime: string; }
interface DeliveryRoute {
  id: string; routeNo: string; name: string; type: 'fixed' | 'dynamic' | 'express';
  stops: RouteStop[]; totalDistance: number; estimatedDuration: number;
  vehicles: string[]; frequency: string; avgOrders: number;
  status: 'active' | 'suspended' | 'planning'; coverArea: string;
}

const typeMap: Record<string, { label: string; color: string; emoji: string }> = {
  fixed:   { label: '固定路线', color: 'bg-blue-50 text-blue-700', emoji: '🔵' },
  dynamic: { label: '动态规划', color: 'bg-purple-50 text-purple-700', emoji: '🔮' },
  express: { label: '快速直达', color: 'bg-orange-50 text-orange-700', emoji: '⚡' },
};

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active:    { label: '运营中', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  suspended: { label: '暂停', color: 'bg-gray-100 text-gray-500', icon: AlertTriangle },
  planning:  { label: '规划中', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
};

const stopTypeStyle: Record<string, string> = {
  warehouse: 'bg-blue-500',
  customer:  'bg-emerald-500',
  hub:       'bg-purple-500',
};

const initData: DeliveryRoute[] = [
  { id: '1', routeNo: 'RT-001', name: '深圳市区环线', type: 'fixed', stops: [{ name: '龙华仓', type: 'warehouse' }, { name: '福田配送中心', type: 'hub' }, { name: '南山客户群', type: 'customer' }, { name: '宝安客户群', type: 'customer' }, { name: '龙华仓', type: 'warehouse' }], totalDistance: 85, estimatedDuration: 240, vehicles: ['粤A12345', '粤A67890'], frequency: '每日2班', avgOrders: 38, status: 'active', coverArea: '深圳福田/南山/宝安' },
  { id: '2', routeNo: 'RT-002', name: '深广高速快线', type: 'express', stops: [{ name: '深圳龙华仓', type: 'warehouse' }, { name: '广州番禺DC', type: 'hub' }], totalDistance: 140, estimatedDuration: 120, vehicles: ['粤B54321'], frequency: '每日1班', avgOrders: 12, status: 'active', coverArea: '深圳→广州' },
  { id: '3', routeNo: 'RT-003', name: '东莞惠州环线', type: 'fixed', stops: [{ name: '深圳龙岗仓', type: 'warehouse' }, { name: '东莞长安', type: 'customer' }, { name: '惠州惠城', type: 'customer' }, { name: '深圳龙岗仓', type: 'warehouse' }], totalDistance: 168, estimatedDuration: 300, vehicles: ['粤C11111'], frequency: '每日1班', avgOrders: 22, status: 'active', coverArea: '东莞/惠州' },
  { id: '4', routeNo: 'RT-004', name: '动态智能配送', type: 'dynamic', stops: [], totalDistance: 0, estimatedDuration: 0, vehicles: [], frequency: '按需', avgOrders: 15, status: 'planning', coverArea: '深圳全域' },
  { id: '5', routeNo: 'RT-005', name: '珠海中山线', type: 'fixed', stops: [{ name: '广州番禺DC', type: 'hub' }, { name: '中山配送点', type: 'customer' }, { name: '珠海客户群', type: 'customer' }], totalDistance: 115, estimatedDuration: 180, vehicles: ['粤D77777'], frequency: '隔日1班', avgOrders: 18, status: 'suspended', coverArea: '中山/珠海' },
];

export default function RouteManagementPage() {
  const [data] = useState<DeliveryRoute[]>(initData);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterType === 'all' || d.type === filterType) &&
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.routeNo.includes(search) || d.name.includes(search) || d.coverArea.includes(search))
  );

  const activeRoutes = data.filter(d => d.status === 'active').length;
  const totalVehicles = new Set(data.flatMap(d => d.vehicles)).size;
  const totalDistance = data.filter(d => d.status === 'active').reduce((s, d) => s + d.totalDistance, 0);
  const totalOrders = data.filter(d => d.status === 'active').reduce((s, d) => s + d.avgOrders, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">路线管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">配送路线规划、站点配置与效率分析</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm"><Plus size={16} />新建路线</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '运营路线', value: activeRoutes, icon: Route, color: 'text-blue-500 bg-blue-50' },
          { label: '投入车辆', value: totalVehicles, icon: Truck, color: 'text-indigo-500 bg-indigo-50' },
          { label: '日均总里程', value: `${totalDistance}km`, icon: MapPin, color: 'text-emerald-500 bg-emerald-50' },
          { label: '日均订单', value: totalOrders, icon: BarChart, color: 'text-purple-500 bg-purple-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索路线号/名称/覆盖区域…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部类型</option>
          {Object.entries(typeMap).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(d => {
          const tp = typeMap[d.type];
          const st = statusMap[d.status];
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-blue-600">{d.routeNo}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${tp.color}`}>{tp.emoji} {tp.label}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${st.color}`}><st.icon size={9} />{st.label}</span>
                  </div>
                  <div className="font-bold text-gray-900">{d.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5"><MapPin size={10} className="inline mr-0.5" />{d.coverArea}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl"><Eye size={14} /></button>
                  <button className="p-2 hover:bg-gray-50 text-gray-500 rounded-xl"><Edit2 size={14} /></button>
                </div>
              </div>

              {/* 站点序列 */}
              {d.stops.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto">
                  {d.stops.map((stop, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${stopTypeStyle[stop.type]}`} />
                        <span className="text-[9px] text-gray-500 whitespace-nowrap max-w-16 truncate text-center">{stop.name}</span>
                      </div>
                      {i < d.stops.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 min-w-4" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {d.stops.length === 0 && <div className="text-xs text-gray-400 italic">站点规划中…</div>}

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: '总里程', value: d.totalDistance > 0 ? `${d.totalDistance}km` : '-' },
                  { label: '预计时长', value: d.estimatedDuration > 0 ? `${d.estimatedDuration}min` : '-' },
                  { label: '班次', value: d.frequency },
                  { label: '日均订单', value: d.avgOrders },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-xl py-2">
                    <div className="text-xs font-bold text-gray-700">{m.value}</div>
                    <div className="text-[10px] text-gray-400">{m.label}</div>
                  </div>
                ))}
              </div>

              {d.vehicles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {d.vehicles.map(v => (
                    <span key={v} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded font-mono">
                      <Truck size={9} />{v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex gap-4 text-xs text-gray-400">
        {[{ dot: 'bg-blue-500', label: '仓库' }, { dot: 'bg-emerald-500', label: '客户' }, { dot: 'bg-purple-500', label: '转运中心' }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />{l.label}</div>
        ))}
      </div>
    </div>
  );
}
