import React, { useState, useEffect } from 'react';
import { Navigation, Satellite, Truck, MapPin, Activity, AlertTriangle, CheckCircle, Signal, Clock, RotateCcw, ChevronRight, Battery, Wifi } from 'lucide-react';

interface VehicleGPS {
  id: string; plateNo: string; driver: string; phone: string;
  lat: number; lng: number; speed: number; heading: number;
  status: 'moving' | 'stopped' | 'idle' | 'offline' | 'alarm';
  battery: number; signal: number; mileageToday: number;
  currentAddress: string; destination: string; eta: string;
  lastUpdated: string; alarmType: string;
}

const initVehicles: VehicleGPS[] = [
  { id: 'v1', plateNo: '粤A 12345', driver: '王师傅', phone: '138****1111', lat: 22.543, lng: 113.927, speed: 68, heading: 45, status: 'moving', battery: 92, signal: 4, mileageToday: 128.5, currentAddress: '深圳南山区滨海大道', destination: '宝安区新安街道客户', eta: '约18分钟', lastUpdated: '刚刚', alarmType: '' },
  { id: 'v2', plateNo: '粤B 54321', driver: '李师傅', phone: '139****2222', lat: 23.12, lng: 113.82, speed: 0, heading: 90, status: 'stopped', battery: 78, signal: 3, mileageToday: 201.3, currentAddress: '广州增城区广园快速路服务区', destination: '东莞石龙镇', eta: '约45分钟', lastUpdated: '2分钟前', alarmType: '' },
  { id: 'v3', plateNo: '粤C 99999', driver: '张师傅', phone: '136****3333', lat: 22.88, lng: 113.71, speed: 0, heading: 180, status: 'alarm', battery: 35, signal: 2, mileageToday: 85.2, currentAddress: '东莞厚街镇工业路', destination: '深圳龙华仓', eta: '故障停车', lastUpdated: '5分钟前', alarmType: '🔴 急刹车报警' },
  { id: 'v4', plateNo: '粤D 77777', driver: '赵师傅', phone: '137****4444', lat: 23.11, lng: 114.42, speed: 82, heading: 270, status: 'moving', battery: 88, signal: 5, mileageToday: 164.8, currentAddress: '惠州惠城区演达大道', destination: '深圳龙岗仓', eta: '约52分钟', lastUpdated: '刚刚', alarmType: '' },
  { id: 'v5', plateNo: '粤E 11111', driver: '陈师傅', phone: '189****5555', lat: 22.65, lng: 113.89, speed: 0, heading: 0, status: 'idle', battery: 100, signal: 5, mileageToday: 0, currentAddress: '深圳宝安区物流园停车场', destination: '-', eta: '-', lastUpdated: '10分钟前', alarmType: '' },
  { id: 'v6', plateNo: '粤F 22222', driver: '周师傅', phone: '186****6666', lat: 22.99, lng: 113.34, speed: 0, heading: 0, status: 'offline', battery: 0, signal: 0, mileageToday: 312.6, currentAddress: '上次位置：广州番禺区', destination: '-', eta: '-', lastUpdated: '2小时前', alarmType: '' },
];

const statusMap: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  moving:  { label: '行驶中', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500 animate-pulse', icon: Activity },
  stopped: { label: '停车', color: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-400', icon: Clock },
  idle:    { label: '空闲', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400', icon: CheckCircle },
  offline: { label: '离线', color: 'bg-red-50 text-red-400', dot: 'bg-red-300', icon: Wifi },
  alarm:   { label: '告警', color: 'bg-red-50 text-red-600', dot: 'bg-red-500 animate-pulse', icon: AlertTriangle },
};

function SignalBars({ level }: { level: number }) {
  return (
    <div className="flex items-end gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-1 rounded-sm ${i <= level ? 'bg-emerald-500' : 'bg-gray-200'}`} style={{ height: `${i * 3 + 2}px` }} />
      ))}
    </div>
  );
}

function BatteryIcon({ level }: { level: number }) {
  const color = level > 50 ? 'bg-emerald-500' : level > 20 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-1">
      <div className="relative w-6 h-3 border border-gray-400 rounded-sm">
        <div className={`absolute left-0 top-0 h-full rounded-sm ${color}`} style={{ width: `${level}%` }} />
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-gray-400 rounded-r" />
      </div>
      <span className={`text-[10px] ${level < 20 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{level}%</span>
    </div>
  );
}

export default function SatNavPage() {
  const [vehicles, setVehicles] = useState<VehicleGPS[]>(initVehicles);
  const [selected, setSelected] = useState<VehicleGPS | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);

  // Simulate GPS updates
  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status !== 'moving') return v;
        const noise = () => (Math.random() - 0.5) * 0.002;
        return { ...v, lat: v.lat + noise(), lng: v.lng + noise(), speed: Math.max(20, Math.min(100, v.speed + (Math.random() - 0.5) * 10)), lastUpdated: '刚刚', mileageToday: +(v.mileageToday + 0.05).toFixed(1) };
      }));
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filtered = vehicles.filter(v =>
    (filterStatus === 'all' || v.status === filterStatus) &&
    (v.plateNo.includes(search) || v.driver.includes(search))
  );

  const movingCount = vehicles.filter(v => v.status === 'moving').length;
  const alarmCount = vehicles.filter(v => v.status === 'alarm').length;
  const offlineCount = vehicles.filter(v => v.status === 'offline').length;
  const totalMileage = vehicles.reduce((s, v) => s + v.mileageToday, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">卫星导航</h1>
          <p className="text-sm text-gray-500 mt-0.5">GPS 车辆实时定位、轨迹跟踪与告警管理</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
            <Satellite size={13} className="animate-pulse" />
            GPS 信号正常
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '行驶中', value: movingCount, icon: Activity, color: 'text-emerald-500 bg-emerald-50' },
          { label: '告警', value: alarmCount, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
          { label: '离线', value: offlineCount, icon: Wifi, color: 'text-gray-500 bg-gray-50' },
          { label: '今日总里程', value: `${totalMileage.toFixed(1)}km`, icon: Navigation, color: 'text-blue-500 bg-blue-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 告警横幅 */}
      {alarmCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-red-700 text-sm">紧急告警</div>
            {vehicles.filter(v => v.status === 'alarm').map(v => (
              <div key={v.id} className="text-xs text-red-600">{v.plateNo} ({v.driver}) — {v.alarmType} — {v.currentAddress}</div>
            ))}
          </div>
          <button className="text-xs text-red-600 underline">处理</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Navigation size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索车牌/司机…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[{ k: 'all', l: '全部' }, { k: 'moving', l: '行驶' }, { k: 'alarm', l: '告警' }, { k: 'stopped', l: '停车' }, { k: 'offline', l: '离线' }].map(f => (
            <button key={f.k} onClick={() => setFilterStatus(f.k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === f.k ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* 车辆列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(v => {
          const st = statusMap[v.status];
          const isSelected = selected?.id === v.id;
          return (
            <div
              key={v.id}
              onClick={() => setSelected(isSelected ? null : v)}
              className={`bg-white rounded-2xl shadow-sm border transition-all cursor-pointer ${isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100 hover:shadow-md'} ${v.status === 'alarm' ? 'bg-red-50/20' : ''} p-5 space-y-3`}
            >
              {/* 车头信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`relative w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center`}>
                    <Truck size={20} className="text-blue-600" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${st.dot}`} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 font-mono">{v.plateNo}</div>
                    <div className="text-xs text-gray-400">{v.driver} · {v.phone}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span>
              </div>

              {/* 位置信息 */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600"><MapPin size={11} className="text-gray-400 flex-shrink-0" />{v.currentAddress}</div>
                {v.destination !== '-' && <div className="flex items-center gap-1.5 text-gray-400"><ChevronRight size={11} className="text-blue-400 flex-shrink-0" />→ {v.destination} ({v.eta})</div>}
              </div>

              {/* 实时数据 */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 rounded-xl py-2">
                  <div className="text-sm font-bold text-gray-800">{v.speed}</div>
                  <div className="text-[10px] text-gray-400">km/h</div>
                </div>
                <div className="bg-gray-50 rounded-xl py-2">
                  <div className="text-sm font-bold text-blue-700">{v.mileageToday}</div>
                  <div className="text-[10px] text-gray-400">今日km</div>
                </div>
                <div className="bg-gray-50 rounded-xl py-2 flex flex-col items-center justify-center gap-0.5">
                  <SignalBars level={v.signal} />
                  <div className="text-[10px] text-gray-400">信号</div>
                </div>
                <div className="bg-gray-50 rounded-xl py-2 flex flex-col items-center justify-center gap-0.5">
                  <BatteryIcon level={v.battery} />
                  <div className="text-[10px] text-gray-400">电量</div>
                </div>
              </div>

              {/* 告警信息 */}
              {v.alarmType && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-xl font-medium">
                  <AlertTriangle size={12} />{v.alarmType}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>坐标 {v.lat.toFixed(4)}°N, {v.lng.toFixed(4)}°E</span>
                <span>更新：{v.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
