import React, { useState } from 'react';
import { BookOpen, Plus, Search, DollarSign, TrendingUp, TrendingDown, BarChart2, ChevronRight, Eye, Download } from 'lucide-react';

interface AccountItem {
  code: string; name: string; type: '资产' | '负债' | '权益' | '收入' | '费用' | '成本';
  level: number; balance: number; debitTotal: number; creditTotal: number;
  direction: 'debit' | 'credit'; hasChildren: boolean;
}

const typeColors: Record<string, string> = {
  '资产': 'bg-blue-50 text-blue-700',
  '负债': 'bg-red-50 text-red-700',
  '权益': 'bg-purple-50 text-purple-700',
  '收入': 'bg-emerald-50 text-emerald-700',
  '费用': 'bg-orange-50 text-orange-700',
  '成本': 'bg-yellow-50 text-yellow-700',
};

interface PnlRow { label: string; amount: number; isTotal?: boolean; isSubtitle?: boolean; isNegative?: boolean; }

const pnlData: PnlRow[] = [
  { label: '一、营业收入', amount: 8_620_000, isSubtitle: true },
  { label: '  主营业务收入', amount: 8_200_000 },
  { label: '  其他业务收入', amount: 420_000 },
  { label: '减：营业成本', amount: -5_850_000, isNegative: true },
  { label: '  主营业务成本', amount: -5_600_000, isNegative: true },
  { label: '  其他业务成本', amount: -250_000, isNegative: true },
  { label: '减：税金及附加', amount: -124_000, isNegative: true },
  { label: '减：销售费用', amount: -380_000, isNegative: true },
  { label: '减：管理费用', amount: -560_000, isNegative: true },
  { label: '减：财务费用', amount: -48_000, isNegative: true },
  { label: '二、营业利润', amount: 1_658_000, isTotal: true },
  { label: '加：营业外收入', amount: 12_000 },
  { label: '减：营业外支出', amount: -8_000, isNegative: true },
  { label: '三、利润总额', amount: 1_662_000, isTotal: true },
  { label: '减：所得税费用', amount: -415_500, isNegative: true },
  { label: '四、净利润', amount: 1_246_500, isTotal: true },
];

const accounts: AccountItem[] = [
  { code: '1000', name: '资产类合计', type: '资产', level: 0, balance: 12_580_000, debitTotal: 28_400_000, creditTotal: 15_820_000, direction: 'debit', hasChildren: true },
  { code: '1001', name: '库存现金', type: '资产', level: 1, balance: 80_000, debitTotal: 320_000, creditTotal: 240_000, direction: 'debit', hasChildren: false },
  { code: '1002', name: '银行存款', type: '资产', level: 1, balance: 4_820_000, debitTotal: 18_600_000, creditTotal: 13_780_000, direction: 'debit', hasChildren: false },
  { code: '1122', name: '应收账款', type: '资产', level: 1, balance: 3_260_000, debitTotal: 8_620_000, creditTotal: 5_360_000, direction: 'debit', hasChildren: false },
  { code: '1221', name: '预付账款', type: '资产', level: 1, balance: 680_000, debitTotal: 1_200_000, creditTotal: 520_000, direction: 'debit', hasChildren: false },
  { code: '1402', name: '在途物资', type: '资产', level: 1, balance: 420_000, debitTotal: 960_000, creditTotal: 540_000, direction: 'debit', hasChildren: false },
  { code: '1405', name: '库存商品', type: '资产', level: 1, balance: 3_320_000, debitTotal: 5_800_000, creditTotal: 2_480_000, direction: 'debit', hasChildren: false },
  { code: '2000', name: '负债类合计', type: '负债', level: 0, balance: -6_420_000, debitTotal: 9_200_000, creditTotal: 15_620_000, direction: 'credit', hasChildren: true },
  { code: '2202', name: '应付账款', type: '负债', level: 1, balance: -3_850_000, debitTotal: 4_200_000, creditTotal: 8_050_000, direction: 'credit', hasChildren: false },
  { code: '2211', name: '应付职工薪酬', type: '负债', level: 1, balance: -920_000, debitTotal: 3_600_000, creditTotal: 4_520_000, direction: 'credit', hasChildren: false },
  { code: '6001', name: '主营业务收入', type: '收入', level: 0, balance: -8_200_000, debitTotal: 0, creditTotal: 8_200_000, direction: 'credit', hasChildren: false },
  { code: '6401', name: '主营业务成本', type: '成本', level: 0, balance: 5_600_000, debitTotal: 5_600_000, creditTotal: 0, direction: 'debit', hasChildren: false },
];

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'pnl' | 'balance'>('pnl');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = accounts.filter(a =>
    (filterType === 'all' || a.type === filterType) &&
    (a.code.includes(search) || a.name.includes(search))
  );

  const totalRevenue = pnlData.find(r => r.label === '一、营业收入')?.amount || 0;
  const netProfit = pnlData.find(r => r.label === '四、净利润')?.amount || 0;
  const profitMargin = Math.round((netProfit / totalRevenue) * 100);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会计管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">科目余额、利润表、资产负债表</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm"><Download size={14} />导出报表</button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-sm"><Plus size={16} />录入凭证</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '本期营业收入', value: `¥${(totalRevenue / 10000).toFixed(0)}万`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
          { label: '净利润', value: `¥${(netProfit / 10000).toFixed(0)}万`, icon: DollarSign, color: 'text-blue-500 bg-blue-50' },
          { label: '利润率', value: `${profitMargin}%`, icon: BarChart2, color: 'text-purple-500 bg-purple-50' },
          { label: '当前期间', value: '2026-04', icon: BookOpen, color: 'text-gray-500 bg-gray-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* Tab */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: 'pnl', label: '利润表' },
          { key: 'ledger', label: '科目余额表' },
          { key: 'balance', label: '资产负债' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'pnl' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">利润表 (2026年4月)</h3>
            <span className="text-xs text-gray-400">单位：元</span>
          </div>
          <div className="divide-y divide-gray-50">
            {pnlData.map((row, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-2.5 ${row.isTotal ? 'bg-blue-50/40 font-bold' : ''} ${row.isSubtitle ? 'bg-gray-50/60 font-semibold' : ''}`}>
                <span className={`text-sm ${row.isTotal ? 'text-blue-700' : row.isSubtitle ? 'text-gray-700' : 'text-gray-500'}`}>{row.label}</span>
                <span className={`text-sm font-mono ${row.isTotal ? 'text-blue-700 text-base' : row.isNegative ? 'text-red-500' : 'text-gray-800'}`}>
                  {row.amount >= 0 ? '' : ''}{Math.abs(row.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索科目编码/名称…" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
              <option value="all">全部类型</option>
              {Object.keys(typeColors).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['科目编码', '科目名称', '类别', '方向', '借方发生额', '贷方发生额', '期末余额'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(a => (
                    <tr key={a.code} className={`hover:bg-gray-50 transition-colors ${a.level === 0 ? 'bg-gray-50/50 font-semibold' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">{a.code}</td>
                      <td className="px-4 py-3 text-gray-800" style={{ paddingLeft: `${16 + a.level * 20}px` }}>{a.name}</td>
                      <td className="px-4 py-3"><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[a.type]}`}>{a.type}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{a.direction === 'debit' ? '借' : '贷'}</td>
                      <td className="px-4 py-3 text-right text-emerald-600">{a.debitTotal > 0 ? a.debitTotal.toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-right text-red-500">{a.creditTotal > 0 ? a.creditTotal.toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{Math.abs(a.balance).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { title: '资产（Asset）', color: 'blue', items: [
              { name: '货币资金', amount: 4_900_000 },
              { name: '应收账款（净）', amount: 3_260_000 },
              { name: '预付账款', amount: 680_000 },
              { name: '存货', amount: 3_740_000 },
              { name: '固定资产净值', amount: 1_050_500 },
            ]},
            { title: '负债及权益（Liability & Equity）', color: 'red', items: [
              { name: '应付账款', amount: 3_850_000 },
              { name: '应付职工薪酬', amount: 920_000 },
              { name: '应交税费', amount: 560_000 },
              { name: '实收资本', amount: 5_000_000 },
              { name: '未分配利润', amount: 3_300_500 },
            ]},
          ].map(section => {
            const total = section.items.reduce((s, i) => s + i.amount, 0);
            return (
              <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`px-5 py-4 border-b border-gray-100 bg-${section.color}-50/30`}>
                  <h3 className="font-semibold text-gray-800 text-sm">{section.title}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {section.items.map(item => (
                    <div key={item.name} className="flex justify-between px-5 py-3 text-sm">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-mono font-medium text-gray-900">¥{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-5 py-3 text-sm font-bold bg-gray-50">
                    <span className="text-gray-700">合计</span>
                    <span className="font-mono text-blue-700">¥{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
