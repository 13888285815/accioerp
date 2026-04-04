import React, { useState } from 'react';
import { Truck, Plus, Search, Package, DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp, Eye, BarChart } from 'lucide-react';

interface LogisticsRecord {
  id: string; no: string; carrier: string; mode: 'road' | 'rail' | 'air' | 'sea' | 'express';
  origin: string; destination: string; cargo: string; weight: number; volume: number;
  status: 'booked' | 'picked' | 'transit' | 'arrived' | 'exception';
  cost: number; createdAt: string; etaAt: string;
}

const modeMap: Record<string, { label: string; color: string; emoji: string }> = {
  road:    { label: '公路', color: 'bg-blue-50 text-blue-700', emoji: '🚛' },
  rail:    { label: '铁路', color: 'bg-purple-50 text-purple-700', emoji: '🚂' },
  air:     { label: '航空', color: 'bg-sky-50 text-sky-700', emoji: '✈️' },
  sea:     { label: '海运', color: 'bg-teal-50 text-teal-700', emoji: '🚢' },
  express: { label: '快递', color: 'bg-orange-50 text-orange-700', emoji: '📦' },
};

const statusMap: Record<string, { label: string; color: string }> = {
  booked:    { label: '已预订', color: 'bg-gray-100 text-gray-600' },
  picked:    { label: '已揽收', color: 'bg-blue-50 text-blue-600' },
  transit:   { label: '运输中', color: 'bg-indigo-50 text-indigo-600' },
  arrived:   { label: '已到达', color: 'bg-emerald-50 text-emerald-600' },
  exception: { label: '异常', color: 'bg-red-50 text-red-600' },
};

const initData: LogisticsRecord[] = [
  { id: '1', no: 'LG2026040001', carrier: '顺丰快运', mode: 'express', origin: '深圳龙华仓', destination: '北京顺义仓', cargo: '电子产品', weight: 580, volume: 2.4, status: 'transit', cost: 1240, createdAt: '2026-04-01', etaAt: '2026-04-04' },
  { id: '2', no: 'LG2026040002', carrier: '中铁特货', mode: 'rail', origin: '广州集装箱站', destination: '成都货运站', cargo: '家用电器', weight: 12000, volume: 48, status: 'transit', cost: 8800, createdAt: '2026-03-30', etaAt: '2026-04-05' },
  { id: '3', no: 'LG2026040003', carrier: '国航货运', mode: 'air', origin: '浦东机场', destination: '洛杉矶机场', cargo: '精密仪器', weight: 320, volume: 1.8, status: 'arrived', cost: 18600, createdAt: '2026-03-28', etaAt: '2026-03-29' },
  { id: '4', no: 'LG2026040004', carrier: '中远海运', mode: 'sea', origin: '上海洋山港', destination: '鹿特丹港', cargo: '纺织品', weight: 18000, volume: 20, status: 'transit', cost: 24500, createdAt: '2026-03-15', etaAt: '2026-04-28' },
  { id: '5', no: 'LG2026040005', carrier: '德邦物流', mode: 'road', origin: '杭州仓', destination: '武汉DC', cargo: '日用品', weight: 3200, volume: 18, status: 'booked', cost: 4200, createdAt: '2026-04-03', etaAt: '2026-04-06' },
  { id: '6', no: 'LG2026040006', carrier: '韵达快运', mode: 'express', origin: '义乌仓', destination: '郑州仓', cargo: '小商品', weight: 860, volume: 6.5, status: 'exception', cost: 980, createdAt: '2026-04-02', etaAt: '2026-04-04' },
];

export default function LogisticsPage() {
  const [data] = useState<LogisticsRecord[]>(initData);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterMode === 'all' || d.mode === filterMode) &&
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.no.includes(search) || d.carrier.includes(search) || d.cargo.includes(search))
  );

  const totalCost = data.reduce((s, d) => s + d.cost, 0);
  const totalWeight = data.reduce((s, d) => s + d.weight, 0);
  const inTransit = data.filter(d => d.status === 'transit').length;
  const exceptions = data.filter(d => d.status === 'exception').length;

  const modeSummary = Object.keys(modeMap).map(m => ({
    ...modeMap[m], mode: m,
    count: data.filter(d => d.mode === m).length,
    cost: data.filter(d => d.mode === m).reduce((s, d) => s + d.cost, 0),
  })).filter(m => m.count > 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">物流管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">多式联运、物流商管理与费用分析</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建物流单
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '物流单量', value: data.length, icon: Truck, color: 'text-blue-500 bg-blue-50' },
          { label: '运输中', value: inTransit, icon: TrendingUp, color: 'text-indigo-500 bg-indigo-50' },
          { label: '物流费用', value: `¥${(totalCost / 10000).toFixed(1)}万`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
          { label: '异常单据', value: exceptions, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 运输方式分布 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {modeSummary.map(m => (
          <div key={m.mode} className={`rounded-2xl p-4 border border-gray-100 shadow-sm bg-white`}>
            <div className="text-2xl mb-1">{m.emoji}</div>
            <div className="text-sm font-bold text-gray-800">{m.label}</div>
            <div className="text-xs text-gray-500">{m.count} 单 · ¥{(m.cost / 10000).toFixed(1)}万</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索单号/承运商/货物…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterMode} onChange={e => setFilterMode(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部方式</option>
          {Object.entries(modeMap).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
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
              <tr>
                {['物流单号', '承运商', '方式', '起点', '终点', '货物', '重量(kg)', '体积(m³)', '费用', '预到日', '状态'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const mode = modeMap[d.mode];
                const st = statusMap[d.status];
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{d.no}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{d.carrier}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${mode.color}`}>{mode.emoji} {mode.label}</span></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.origin}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.destination}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-32 truncate">{d.cargo}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">{d.weight.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">{d.volume}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">¥{d.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{d.etaAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">共 {filtered.length} 条记录 · 总重量 {(totalWeight / 1000).toFixed(1)} 吨</div>
      </div>
    </div>
  );
}
