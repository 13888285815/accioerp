import React, { useState } from 'react';
import { Package2, Plus, Search, DollarSign, AlertTriangle, CheckCircle, Clock, BarChart, Eye, QrCode, Pencil } from 'lucide-react';

type AssetStatus = 'in_use' | 'idle' | 'maintenance' | 'scrapped' | 'transferred';

interface Asset {
  id: string; assetNo: string; name: string; category: string;
  brand: string; model: string; sn: string;
  purchaseDate: string; purchasePrice: number; currentValue: number;
  depreciationYears: number; location: string; custodian: string;
  status: AssetStatus; warrantyExpiry: string; lastInspection: string;
}

const statusMap: Record<AssetStatus, { label: string; color: string; icon: React.ElementType }> = {
  in_use:      { label: '使用中', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  idle:        { label: '闲置', color: 'bg-gray-100 text-gray-600', icon: Clock },
  maintenance: { label: '维护中', color: 'bg-yellow-50 text-yellow-700', icon: AlertTriangle },
  scrapped:    { label: '已报废', color: 'bg-red-50 text-red-500', icon: AlertTriangle },
  transferred: { label: '已调拨', color: 'bg-blue-50 text-blue-600', icon: CheckCircle },
};

const CATEGORIES = ['IT设备', '仓储设备', '运输设备', '办公设备', '生产设备', '安防设备'];

const initData: Asset[] = [
  { id: '1', assetNo: 'AST-IT-0001', name: '服务器 Dell R740', category: 'IT设备', brand: 'Dell', model: 'PowerEdge R740', sn: 'SN2024011234', purchaseDate: '2024-01-10', purchasePrice: 85000, currentValue: 68000, depreciationYears: 5, location: '机房A-03', custodian: '运维部', status: 'in_use', warrantyExpiry: '2027-01-10', lastInspection: '2026-01-10' },
  { id: '2', assetNo: 'AST-WH-0001', name: '电动叉车 5T', category: '仓储设备', brand: '合力', model: 'CPCD50', sn: 'FD2023005678', purchaseDate: '2023-06-15', purchasePrice: 120000, currentValue: 84000, depreciationYears: 10, location: 'B仓库', custodian: '仓储部', status: 'in_use', warrantyExpiry: '2026-06-15', lastInspection: '2026-03-01' },
  { id: '3', assetNo: 'AST-IT-0002', name: '网络交换机 48口', category: 'IT设备', brand: 'Cisco', model: 'C9300-48P', sn: 'SN2022078901', purchaseDate: '2022-09-20', purchasePrice: 32000, currentValue: 19200, depreciationYears: 5, location: '机房B-01', custodian: '运维部', status: 'in_use', warrantyExpiry: '2025-09-20', lastInspection: '2026-02-15' },
  { id: '4', assetNo: 'AST-TR-0001', name: '厢式货车 9.6米', category: '运输设备', brand: '江淮', model: 'HFC5181XXYP3K1', sn: 'LJ2025003344', purchaseDate: '2025-03-01', purchasePrice: 280000, currentValue: 252000, depreciationYears: 10, location: '停车场B区', custodian: '运输部', status: 'in_use', warrantyExpiry: '2028-03-01', lastInspection: '2026-04-01' },
  { id: '5', assetNo: 'AST-OF-0001', name: '投影仪 激光', category: '办公设备', brand: 'Epson', model: 'EB-L400U', sn: 'EP2021009876', purchaseDate: '2021-11-08', purchasePrice: 18000, currentValue: 7200, depreciationYears: 5, location: '会议室3F', custodian: '行政部', status: 'idle', warrantyExpiry: '2024-11-08', lastInspection: '2025-11-08' },
  { id: '6', assetNo: 'AST-WH-0002', name: '堆垛机 AS/RS', category: '仓储设备', brand: '科捷物流', model: 'ASRS-D800', sn: 'KJ2024007788', purchaseDate: '2024-04-20', purchasePrice: 580000, currentValue: 522000, depreciationYears: 15, location: 'A区立体仓', custodian: '仓储部', status: 'maintenance', warrantyExpiry: '2027-04-20', lastInspection: '2026-04-04' },
];

export default function AssetsPage() {
  const [data] = useState<Asset[]>(initData);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterCategory === 'all' || d.category === filterCategory) &&
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.assetNo.includes(search) || d.name.includes(search) || d.custodian.includes(search))
  );

  const totalPurchase = data.reduce((s, d) => s + d.purchasePrice, 0);
  const totalCurrent = data.reduce((s, d) => s + d.currentValue, 0);
  const depreciationTotal = totalPurchase - totalCurrent;
  const inUseCount = data.filter(d => d.status === 'in_use').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">资产管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">固定资产台账、折旧计算与盘点管理</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm">
          <Plus size={16} />登记资产
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '资产总数', value: data.length, icon: Package2, color: 'text-blue-500 bg-blue-50' },
          { label: '使用中', value: inUseCount, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '账面净值', value: `¥${(totalCurrent / 10000).toFixed(0)}万`, icon: DollarSign, color: 'text-purple-500 bg-purple-50' },
          { label: '累计折旧', value: `¥${(depreciationTotal / 10000).toFixed(0)}万`, icon: BarChart, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 折旧健康度 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">资产价值保留率</h3>
          <span className="text-2xl font-bold text-emerald-600">{Math.round((totalCurrent / totalPurchase) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${Math.round((totalCurrent / totalPurchase) * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>净值 ¥{(totalCurrent / 10000).toFixed(0)}万</span>
          <span>原值 ¥{(totalPurchase / 10000).toFixed(0)}万</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索资产编号/名称/保管人…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部分类</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['资产编号', '名称', '分类', '品牌/型号', 'SN', '购置日期', '原值', '净值', '折旧率', '位置', '保管人', '状态', '操作'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => {
                const st = statusMap[d.status];
                const deprPct = Math.round(((d.purchasePrice - d.currentValue) / d.purchasePrice) * 100);
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{d.assetNo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-32 truncate">{d.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{d.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{d.brand} {d.model}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">{d.sn}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{d.purchaseDate}</td>
                    <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">¥{(d.purchasePrice / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">¥{(d.currentValue / 10000).toFixed(1)}万</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${deprPct > 50 ? 'text-red-500' : deprPct > 30 ? 'text-yellow-600' : 'text-emerald-600'}`}>{deprPct}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{d.location}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{d.custodian}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap flex gap-1">
                      <button className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-gray-50 text-gray-500 rounded-lg"><QrCode size={13} /></button>
                    </td>
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
