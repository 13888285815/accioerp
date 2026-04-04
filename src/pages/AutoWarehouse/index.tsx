import React, { useState } from 'react';
import { Layers, Plus, Package, Zap, AlertTriangle, CheckCircle, Settings, BarChart, Clock, Eye } from 'lucide-react';

interface Rack { id: string; code: string; rows: number; cols: number; floors: number; type: string; totalSlots: number; usedSlots: number; status: 'normal' | 'warning' | 'error' | 'maintenance'; }
interface ASTask { id: string; taskNo: string; type: 'inbound' | 'outbound' | 'transfer'; rackCode: string; slotCode: string; cargo: string; qty: number; status: 'pending' | 'running' | 'done' | 'error'; startedAt: string; duration: number; }

const initRacks: Rack[] = [
  { id: 'r1', code: 'AS-R01', rows: 10, cols: 4, floors: 8, type: '双伸位货架', totalSlots: 320, usedSlots: 278, status: 'normal' },
  { id: 'r2', code: 'AS-R02', rows: 10, cols: 4, floors: 8, type: '双伸位货架', totalSlots: 320, usedSlots: 301, status: 'warning' },
  { id: 'r3', code: 'AS-R03', rows: 8, cols: 3, floors: 10, type: '单伸位货架', totalSlots: 240, usedSlots: 156, status: 'normal' },
  { id: 'r4', code: 'AS-R04', rows: 8, cols: 3, floors: 10, type: '单伸位货架', totalSlots: 240, usedSlots: 240, status: 'error' },
  { id: 'r5', code: 'AS-R05', rows: 6, cols: 2, floors: 12, type: '窄巷道货架', totalSlots: 144, usedSlots: 0, status: 'maintenance' },
];

const initTasks: ASTask[] = [
  { id: 't1', taskNo: 'AST240001', type: 'inbound', rackCode: 'AS-R01', slotCode: 'R01-F05-C02-L03', cargo: '锂电池组 A型', qty: 48, status: 'done', startedAt: '14:28:05', duration: 142 },
  { id: 't2', taskNo: 'AST240002', type: 'outbound', rackCode: 'AS-R02', slotCode: 'R02-F03-C01-L07', cargo: '智能手表模组', qty: 120, status: 'running', startedAt: '14:31:22', duration: 88 },
  { id: 't3', taskNo: 'AST240003', type: 'transfer', rackCode: 'AS-R01', slotCode: 'R01-F07-C04-L01', cargo: 'PCB主板 v2', qty: 200, status: 'pending', startedAt: '-', duration: 0 },
  { id: 't4', taskNo: 'AST240004', type: 'inbound', rackCode: 'AS-R03', slotCode: 'R03-F02-C03-L05', cargo: '液晶屏幕模组', qty: 60, status: 'error', startedAt: '14:15:00', duration: 0 },
  { id: 't5', taskNo: 'AST240005', type: 'outbound', rackCode: 'AS-R01', slotCode: 'R01-F08-C01-L02', cargo: '蓝牙芯片套件', qty: 500, status: 'done', startedAt: '14:05:11', duration: 115 },
];

const rStatusMap: Record<string, { label: string; color: string; dot: string }> = {
  normal:      { label: '正常', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  warning:     { label: '接近满载', color: 'text-yellow-600', dot: 'bg-yellow-400' },
  error:       { label: '满载/故障', color: 'text-red-600', dot: 'bg-red-500' },
  maintenance: { label: '维护中', color: 'text-gray-500', dot: 'bg-gray-400' },
};
const tStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '排队中', color: 'bg-gray-100 text-gray-600' },
  running: { label: '执行中', color: 'bg-blue-50 text-blue-600' },
  done:    { label: '已完成', color: 'bg-emerald-50 text-emerald-600' },
  error:   { label: '异常', color: 'bg-red-50 text-red-600' },
};
const tTypeMap: Record<string, { label: string; color: string }> = {
  inbound:  { label: '入库', color: 'bg-indigo-50 text-indigo-700' },
  outbound: { label: '出库', color: 'bg-orange-50 text-orange-700' },
  transfer: { label: '移位', color: 'bg-purple-50 text-purple-700' },
};

export default function AutoWarehousePage() {
  const [racks] = useState<Rack[]>(initRacks);
  const [tasks] = useState<ASTask[]>(initTasks);

  const totalSlots = racks.reduce((s, r) => s + r.totalSlots, 0);
  const usedSlots = racks.reduce((s, r) => s + r.usedSlots, 0);
  const utilRate = Math.round((usedSlots / totalSlots) * 100);
  const runningTasks = tasks.filter(t => t.status === 'running').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">立体仓库管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">AS/RS自动化立体仓库货架与任务监控</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建任务
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '货架总槽位', value: totalSlots, icon: Layers, color: 'text-blue-500 bg-blue-50' },
          { label: '已占用槽位', value: usedSlots, icon: Package, color: 'text-indigo-500 bg-indigo-50' },
          { label: '整体利用率', value: `${utilRate}%`, icon: BarChart, color: 'text-emerald-500 bg-emerald-50' },
          { label: '执行中任务', value: runningTasks, icon: Zap, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 货架状态 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {racks.map(r => {
          const st = rStatusMap[r.status];
          const pct = Math.round((r.usedSlots / r.totalSlots) * 100);
          return (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${st.dot} ${r.status === 'running' ? 'animate-pulse' : ''}`} />
                  <span className="font-bold text-gray-900">{r.code}</span>
                </div>
                <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
              </div>
              <div className="text-xs text-gray-400">{r.type} · {r.rows}排×{r.cols}列×{r.floors}层</div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>利用率</span><span className="font-semibold">{pct}%（{r.usedSlots}/{r.totalSlots}槽）</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 95 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium"><Eye size={11} />查看</button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium"><Settings size={11} />配置</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 任务队列 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Zap size={15} className="text-blue-500" /><h3 className="font-semibold text-gray-800">任务队列（实时）</h3>
          <span className="ml-auto text-xs text-gray-400">{tasks.filter(t => t.status === 'running').length} 执行中 · {tasks.filter(t => t.status === 'pending').length} 排队</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['任务号', '类型', '货架', '槽位', '货物', '数量', '状态', '开始时间', '耗时(s)'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map(t => {
                const ts = tStatusMap[t.status];
                const tt = tTypeMap[t.type];
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 whitespace-nowrap">{t.taskNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${tt.color}`}>{tt.label}</span></td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{t.rackCode}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{t.slotCode}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-36 truncate">{t.cargo}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">{t.qty}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${ts.color}`}>
                        {t.status === 'running' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                        {ts.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{t.startedAt}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">{t.duration > 0 ? t.duration : '-'}</td>
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
