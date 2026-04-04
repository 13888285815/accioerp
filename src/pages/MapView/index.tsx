import React, { useState } from 'react';
import { Map, MapPin, Truck, Package, Warehouse, Navigation, ZoomIn, ZoomOut, Layers, Search, RefreshCw, Circle } from 'lucide-react';

interface MapMarker {
  id: string; type: 'warehouse' | 'vehicle' | 'customer' | 'hub';
  name: string; address: string; lat: number; lng: number;
  info: string; status: 'active' | 'idle' | 'alert';
}

const markerStyle: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  warehouse: { icon: Warehouse, color: 'text-blue-600', bg: 'bg-blue-100 border-blue-400', label: '仓库' },
  vehicle:   { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100 border-indigo-400', label: '车辆' },
  customer:  { icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-100 border-emerald-400', label: '客户' },
  hub:       { icon: Circle, color: 'text-purple-600', bg: 'bg-purple-100 border-purple-400', label: '转运中心' },
};

// Simulated markers with percentage-based positions for a canvas-style map
const markers: MapMarker[] = [
  { id: 'w1', type: 'warehouse', name: '深圳龙华仓', address: '深圳市龙华区龙华大道XX号', lat: 22.69, lng: 114.03, info: '库存 12,580件 / 容量 95%', status: 'active' },
  { id: 'w2', type: 'warehouse', name: '广州番禺仓', address: '广州市番禺区南村镇XX路', lat: 22.98, lng: 113.36, info: '库存 8,240件 / 容量 72%', status: 'active' },
  { id: 'w3', type: 'warehouse', name: '东莞厚街仓', address: '东莞市厚街镇工业大道XX号', lat: 22.88, lng: 113.71, info: '库存 5,600件 / 容量 58%', status: 'active' },
  { id: 'h1', type: 'hub', name: '深圳中转中心', address: '深圳市宝安区龙岗大道', lat: 22.65, lng: 113.89, info: '日吞吐 3,200票', status: 'active' },
  { id: 'v1', type: 'vehicle', name: '粤A 12345', address: '深圳南山区', lat: 22.54, lng: 113.93, info: '配送中 · 23单 · 距终点12km', status: 'active' },
  { id: 'v2', type: 'vehicle', name: '粤B 54321', address: '广州增城区', lat: 23.12, lng: 113.82, info: '配送中 · 15单 · 距终点8km', status: 'active' },
  { id: 'v3', type: 'vehicle', name: '粤C 99999', address: '东莞南城', lat: 22.98, lng: 113.75, info: '已停靠 · 等待装货', status: 'idle' },
  { id: 'v4', type: 'vehicle', name: '粤D 77777', address: '惠州惠城区', lat: 23.11, lng: 114.42, info: '故障报警 · 已联系维修', status: 'alert' },
  { id: 'c1', type: 'customer', name: '华南商贸中心', address: '广州天河区天河路385号', lat: 23.15, lng: 113.34, info: '今日2单待配', status: 'active' },
  { id: 'c2', type: 'customer', name: '深圳太古汇', address: '深圳福田区益田路5001号', lat: 22.54, lng: 114.06, info: '今日1单待配', status: 'active' },
];

// Convert lat/lng to approximate pixel position on our 800x500 canvas
// Pearl River Delta area: lat 22.4-23.4, lng 113.0-115.0
function toPixel(lat: number, lng: number) {
  const minLat = 22.3, maxLat = 23.5;
  const minLng = 112.8, maxLng = 114.8;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { x, y };
}

const statusDot: Record<string, string> = {
  active: 'bg-emerald-400',
  idle: 'bg-gray-400',
  alert: 'bg-red-500 animate-pulse',
};

export default function MapViewPage() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [zoom, setZoom] = useState(1);

  const visibleMarkers = markers.filter(m =>
    (filterType === 'all' || m.type === filterType) &&
    (m.name.includes(search) || m.address.includes(search))
  );

  const alertCount = markers.filter(m => m.status === 'alert').length;
  const vehicleCount = markers.filter(m => m.type === 'vehicle').length;
  const activeVehicles = markers.filter(m => m.type === 'vehicle' && m.status === 'active').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">地图管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">仓库、车辆、客户地理位置可视化</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm"><RefreshCw size={14} />刷新位置</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '标注点总数', value: markers.length, icon: MapPin, color: 'text-blue-500 bg-blue-50' },
          { label: '在途车辆', value: activeVehicles, icon: Truck, color: 'text-indigo-500 bg-indigo-50' },
          { label: '车队总数', value: vehicleCount, icon: Navigation, color: 'text-emerald-500 bg-emerald-50' },
          { label: '异常告警', value: alertCount, icon: Circle, color: 'text-red-500 bg-red-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索地点/车辆…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[{ k: 'all', l: '全部' }, { k: 'warehouse', l: '仓库' }, { k: 'vehicle', l: '车辆' }, { k: 'customer', l: '客户' }, { k: 'hub', l: '转运' }].map(f => (
            <button key={f.k} onClick={() => setFilterType(f.k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === f.k ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* 地图画布 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 工具栏 */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <Map size={15} className="text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">珠三角地区 — 实时标注地图</span>
          <div className="ml-auto flex gap-1">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-1.5 hover:bg-white rounded-lg text-gray-500"><ZoomIn size={14} /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))} className="p-1.5 hover:bg-white rounded-lg text-gray-500"><ZoomOut size={14} /></button>
            <button onClick={() => setZoom(1)} className="px-2 py-1 text-xs text-gray-500 hover:bg-white rounded-lg">{Math.round(zoom * 100)}%</button>
          </div>
        </div>

        {/* 模拟地图 */}
        <div className="relative overflow-hidden" style={{ height: '480px', background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 30%, #dcfce7 60%, #f0fdf4 100%)' }}>
          {/* 网格 */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* 城市标签 */}
          {[
            { name: '深圳', x: 52, y: 72 },
            { name: '广州', x: 18, y: 28 },
            { name: '东莞', x: 38, y: 42 },
            { name: '惠州', x: 72, y: 35 },
            { name: '珠海', x: 12, y: 72 },
            { name: '佛山', x: 20, y: 48 },
          ].map(c => (
            <div key={c.name} className="absolute text-xs text-blue-900/30 font-bold select-none pointer-events-none" style={{ left: `${c.x}%`, top: `${c.y}%` }}>{c.name}</div>
          ))}

          {/* 标注点 */}
          {visibleMarkers.map(m => {
            const pos = toPixel(m.lat, m.lng);
            const style = markerStyle[m.type];
            const isSelected = selectedMarker?.id === m.id;
            return (
              <div
                key={m.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: isSelected ? 30 : 10 }}
                onClick={() => setSelectedMarker(isSelected ? null : m)}
              >
                <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-all hover:scale-110 ${style.bg} ${isSelected ? 'scale-125 ring-2 ring-blue-400 ring-offset-1' : ''}`}>
                  <style.icon size={14} className={style.color} />
                  <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${statusDot[m.status]}`} />
                </div>
                <div className={`absolute bottom-9 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg px-2 py-1 text-xs whitespace-nowrap pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="font-bold text-gray-800">{m.name}</div>
                  <div className="text-gray-500 text-[10px]">{m.info}</div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 shadow-sm" />
                </div>
              </div>
            );
          })}

          {/* 选中详情 */}
          {selectedMarker && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-40">
              <div className="flex items-center gap-2 mb-2">
                {(() => { const s = markerStyle[selectedMarker.type]; return <s.icon size={16} className={s.color} />; })()}
                <span className="font-bold text-gray-900">{selectedMarker.name}</span>
                <div className={`ml-auto w-2 h-2 rounded-full ${statusDot[selectedMarker.status]}`} />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1"><MapPin size={10} className="text-gray-400" />{selectedMarker.address}</div>
                <div className="font-medium text-gray-700">{selectedMarker.info}</div>
                <div className="text-gray-400">坐标：{selectedMarker.lat.toFixed(4)}°N, {selectedMarker.lng.toFixed(4)}°E</div>
              </div>
              <button onClick={() => setSelectedMarker(null)} className="mt-2 text-xs text-gray-400 hover:text-gray-600">关闭 ×</button>
            </div>
          )}
        </div>

        {/* 图例 */}
        <div className="flex flex-wrap gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          {Object.entries(markerStyle).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${v.bg}`}><v.icon size={8} className={v.color} /></div>
              {v.label}
            </div>
          ))}
          <div className="ml-auto flex gap-3">
            {[{ dot: 'bg-emerald-400', label: '正常' }, { dot: 'bg-gray-400', label: '空闲' }, { dot: 'bg-red-500', label: '告警' }].map(s => (
              <div key={s.label} className="flex items-center gap-1 text-xs text-gray-400"><div className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
