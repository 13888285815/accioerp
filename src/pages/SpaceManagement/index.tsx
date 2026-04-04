import React, { useState } from 'react';
import { Grid, Plus, Package, TrendingUp, AlertTriangle, CheckCircle, Layers, BarChart } from 'lucide-react';

type ZoneStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

interface Zone { id: string; code: string; name: string; row: number; col: number; floor: number; capacity: number; used: number; status: ZoneStatus; type: string; temp: string; }

const statusColor: Record<ZoneStatus, string> = {
  available:   'bg-emerald-400',
  occupied:    'bg-blue-500',
  reserved:    'bg-yellow-400',
  maintenance: 'bg-red-400',
};
const statusLabel: Record<ZoneStatus, string> = {
  available:   '空闲',
  occupied:    '已占用',
  reserved:    '已预留',
  maintenance: '维护中',
};

function generateZones(): Zone[] {
  const zones: Zone[] = [];
  const statuses: ZoneStatus[] = ['available', 'occupied', 'occupied', 'occupied', 'reserved', 'maintenance'];
  const types = ['常温区', '冷藏区', '冷冻区', '危险品区'];
  const temps = ['常温', '0-4°C', '-18°C', '常温'];
  let id = 1;
  for (let floor = 1; floor <= 3; floor++) {
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 6; col++) {
        const typeIdx = floor === 2 ? 1 : floor === 3 ? 2 : (row === 4 ? 3 : 0);
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const capacity = 100;
        const used = status === 'available' ? 0 : status === 'maintenance' ? 0 : Math.floor(Math.random() * 80) + 20;
        zones.push({
          id: String(id++),
          code: `${['A', 'B', 'C'][floor - 1]}${row.toString().padStart(2, '0')}-${col.toString().padStart(2, '0')}`,
          name: `${floor}层${row}排${col}列`,
          row, col, floor, capacity, used, status,
          type: types[typeIdx], temp: temps[typeIdx],
        });
      }
    }
  }
  return zones;
}

const allZones = generateZones();

export default function SpaceManagementPage() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const zones = allZones.filter(z => z.floor === selectedFloor);
  const totalCapacity = allZones.reduce((s, z) => s + z.capacity, 0);
  const totalUsed = allZones.reduce((s, z) => s + z.used, 0);
  const utilizationRate = Math.round((totalUsed / totalCapacity) * 100);
  const availableCount = allZones.filter(z => z.status === 'available').length;

  const rows = Array.from(new Set(zones.map(z => z.row))).sort();
  const cols = Array.from(new Set(zones.map(z => z.col))).sort();

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">空间管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">仓库货位空间可视化与利用率分析</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 添加货位
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '货位总数', value: allZones.length, icon: Grid, color: 'text-blue-500 bg-blue-50' },
          { label: '空闲货位', value: availableCount, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '利用率', value: `${utilizationRate}%`, icon: BarChart, color: 'text-purple-500 bg-purple-50' },
          { label: '维护中', value: allZones.filter(z => z.status === 'maintenance').length, icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 利用率总体 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">整体利用率</h3>
          <span className="text-2xl font-bold text-blue-600">{utilizationRate}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all" style={{ width: `${utilizationRate}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>已用 {totalUsed.toLocaleString()} / 总容量 {totalCapacity.toLocaleString()}</span>
          <span>剩余 {(totalCapacity - totalUsed).toLocaleString()}</span>
        </div>
      </div>

      {/* 楼层选择 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-sm">货位平面图</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map(f => (
              <button key={f} onClick={() => setSelectedFloor(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedFloor === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}层
              </button>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(statusLabel).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className={`w-3 h-3 rounded ${statusColor[k as ZoneStatus]}`} />
              {v}
            </div>
          ))}
        </div>

        {/* 货位网格 */}
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1.5 min-w-max">
            {rows.map(row => (
              <div key={row} className="flex gap-1.5 items-center">
                <span className="text-xs text-gray-400 w-6 text-right">{row}</span>
                {cols.map(col => {
                  const zone = zones.find(z => z.row === row && z.col === col);
                  if (!zone) return <div key={col} className="w-10 h-10" />;
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedZone(zone === selectedZone ? null : zone)}
                      title={`${zone.code} — ${statusLabel[zone.status]} ${zone.used}%`}
                      className={`w-10 h-10 rounded-lg ${statusColor[zone.status]} transition-all hover:opacity-80 hover:scale-105 ${selectedZone?.id === zone.id ? 'ring-2 ring-offset-1 ring-blue-800 scale-105' : ''}`}
                    >
                      <span className="text-[8px] text-white font-bold">{zone.code.split('-')[0]}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="flex gap-1.5 items-center pl-7">
              {cols.map(c => <span key={c} className="w-10 text-center text-xs text-gray-400">{c}</span>)}
            </div>
          </div>
        </div>

        {/* 选中货位详情 */}
        {selectedZone && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded ${statusColor[selectedZone.status]}`} />
              <span className="font-bold text-blue-800">{selectedZone.code}</span>
              <span className="text-sm text-blue-600">{selectedZone.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><span className="text-blue-500 text-xs">类型</span><div className="text-blue-900 font-medium">{selectedZone.type}</div></div>
              <div><span className="text-blue-500 text-xs">温度</span><div className="text-blue-900 font-medium">{selectedZone.temp}</div></div>
              <div><span className="text-blue-500 text-xs">利用率</span><div className="text-blue-900 font-medium">{selectedZone.used}%</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
