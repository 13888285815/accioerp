import React, { useState } from 'react';
import { Factory, Plus, Search, Package, Clock, CheckCircle, AlertTriangle, Users, BarChart, Eye } from 'lucide-react';

interface ProcessOrder {
  id: string; orderNo: string; product: string; rawMaterial: string;
  plannedQty: number; completedQty: number; scrapQty: number;
  line: string; operator: string; status: 'pending' | 'processing' | 'paused' | 'done' | 'scrapped';
  plannedStart: string; plannedEnd: string; actualEnd: string;
  process: string[]; currentStep: number;
}

const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:    { label: '待加工', color: 'bg-gray-100 text-gray-600', icon: Clock },
  processing: { label: '加工中', color: 'bg-blue-50 text-blue-600', icon: Factory },
  paused:     { label: '暂停', color: 'bg-yellow-50 text-yellow-700', icon: AlertTriangle },
  done:       { label: '已完成', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  scrapped:   { label: '报废', color: 'bg-red-50 text-red-600', icon: AlertTriangle },
};

const initData: ProcessOrder[] = [
  { id: '1', orderNo: 'PO20260001', product: '铝合金外壳 A款', rawMaterial: '铝棒 6061-T6', plannedQty: 500, completedQty: 320, scrapQty: 8, line: '产线1', operator: '刘师傅', status: 'processing', plannedStart: '2026-04-03', plannedEnd: '2026-04-05', actualEnd: '-', process: ['下料', '车削', '铣削', '钻孔', '去毛刺', '检验'], currentStep: 3 },
  { id: '2', orderNo: 'PO20260002', product: '注塑件 B型', rawMaterial: 'ABS颗粒 黑色', plannedQty: 2000, completedQty: 2000, scrapQty: 45, line: '产线3', operator: '王师傅', status: 'done', plannedStart: '2026-04-01', plannedEnd: '2026-04-03', actualEnd: '2026-04-03', process: ['注塑', '修边', '检验', '包装'], currentStep: 4 },
  { id: '3', orderNo: 'PO20260003', product: '钣金支架 C型', rawMaterial: '冷轧钢板 1.5mm', plannedQty: 800, completedQty: 0, scrapQty: 0, line: '产线2', operator: '赵师傅', status: 'pending', plannedStart: '2026-04-05', plannedEnd: '2026-04-08', actualEnd: '-', process: ['激光切割', '折弯', '焊接', '喷涂', '检验'], currentStep: 0 },
  { id: '4', orderNo: 'PO20260004', product: '橡胶密封圈', rawMaterial: '硅橡胶 硬度60', plannedQty: 5000, completedQty: 1200, scrapQty: 120, line: '产线4', operator: '陈师傅', status: 'paused', plannedStart: '2026-04-02', plannedEnd: '2026-04-04', actualEnd: '-', process: ['混炼', '硫化', '修边', '检验'], currentStep: 2 },
];

export default function ProcessingPage() {
  const [data] = useState<ProcessOrder[]>(initData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = data.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (d.orderNo.includes(search) || d.product.includes(search) || d.operator.includes(search))
  );

  const totalPlanned = data.reduce((s, d) => s + d.plannedQty, 0);
  const totalCompleted = data.reduce((s, d) => s + d.completedQty, 0);
  const totalScrap = data.reduce((s, d) => s + d.scrapQty, 0);
  const yieldRate = totalCompleted > 0 ? Math.round(((totalCompleted - totalScrap) / totalCompleted) * 100) : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">加工管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">加工工单、工艺流程与良品率追踪</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建加工工单
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '计划总量', value: totalPlanned.toLocaleString(), icon: Factory, color: 'text-blue-500 bg-blue-50' },
          { label: '完成数量', value: totalCompleted.toLocaleString(), icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '报废数量', value: totalScrap, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
          { label: '综合良品率', value: `${yieldRate}%`, icon: BarChart, color: 'text-purple-500 bg-purple-50' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索工单/产品/操作员…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="all">全部状态</option>
          {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map(d => {
          const st = statusMap[d.status];
          const pct = Math.round((d.completedQty / d.plannedQty) * 100);
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-blue-600">{d.orderNo}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${st.color}`}><st.icon size={10} />{st.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span><Factory size={10} className="inline mr-0.5" />{d.line}</span>
                  <span><Users size={10} className="inline mr-0.5" />{d.operator}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><div className="text-xs text-gray-400">产品</div><div className="font-medium text-gray-800 truncate">{d.product}</div></div>
                <div><div className="text-xs text-gray-400">原材料</div><div className="text-gray-600 truncate">{d.rawMaterial}</div></div>
                <div><div className="text-xs text-gray-400">计划 / 完成 / 报废</div><div className="text-gray-800">{d.plannedQty} / <span className="text-emerald-600 font-medium">{d.completedQty}</span> / <span className="text-red-500">{d.scrapQty}</span></div></div>
                <div><div className="text-xs text-gray-400">计划周期</div><div className="text-gray-600">{d.plannedStart} → {d.plannedEnd}</div></div>
              </div>
              {/* 完成进度 */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>完成进度</span><span>{pct}%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              {/* 工艺步骤 */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {d.process.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap
                      ${i < d.currentStep ? 'bg-emerald-50 text-emerald-600' : i === d.currentStep && d.status === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step}
                    </div>
                    {i < d.process.length - 1 && <div className={`w-4 h-0.5 flex-shrink-0 ${i < d.currentStep ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
