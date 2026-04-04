import React, { useState } from 'react';
import { Plus, Pencil, Trash, Shield, Users, CheckCircle, Lock } from 'lucide-react';

interface Role {
  id: string; name: string; code: string; description: string;
  userCount: number; permissions: string[]; isSystem: boolean; createdAt: string;
}

const ALL_PERMS = [
  '仓库查看', '仓库编辑', '库存查看', '库存编辑', '入库操作', '出库操作',
  '订单查看', '订单编辑', '供应商管理', '财务查看', '财务编辑', 'HR管理',
  'CRM管理', '采购管理', '生产管理', '报表查看', '用户管理', '系统设置', '订阅管理',
];

const initRoles: Role[] = [
  { id: '1', name: '超级管理员', code: 'admin', description: '拥有所有权限，可管理整个系统', userCount: 2, permissions: ALL_PERMS, isSystem: true, createdAt: '2026-01-01' },
  { id: '2', name: '仓库经理', code: 'manager', description: '管理仓库日常运营，库存和订单', userCount: 8, permissions: ['仓库查看', '仓库编辑', '库存查看', '库存编辑', '入库操作', '出库操作', '订单查看', '订单编辑', '供应商管理', '报表查看'], isSystem: true, createdAt: '2026-01-01' },
  { id: '3', name: '操作员', code: 'operator', description: '执行日常入出库操作', userCount: 24, permissions: ['仓库查看', '库存查看', '入库操作', '出库操作', '订单查看'], isSystem: true, createdAt: '2026-01-01' },
  { id: '4', name: '只读用户', code: 'viewer', description: '只能查看数据，无法进行任何修改', userCount: 12, permissions: ['仓库查看', '库存查看', '订单查看', '报表查看'], isSystem: true, createdAt: '2026-01-01' },
  { id: '5', name: '财务专员', code: 'finance', description: '负责财务数据录入和报表', userCount: 4, permissions: ['财务查看', '财务编辑', '报表查看', '订单查看'], isSystem: false, createdAt: '2026-02-15' },
  { id: '6', name: '销售顾问', code: 'sales', description: 'CRM和订单管理权限', userCount: 18, permissions: ['CRM管理', '订单查看', '订单编辑', '供应商管理', '报表查看'], isSystem: false, createdAt: '2026-03-01' },
];

const ROLE_COLORS: Record<string, string> = {
  admin: 'from-red-500 to-rose-600',
  manager: 'from-blue-500 to-indigo-600',
  operator: 'from-emerald-500 to-teal-600',
  viewer: 'from-gray-400 to-gray-500',
  finance: 'from-purple-500 to-violet-600',
  sales: 'from-orange-500 to-amber-600',
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initRoles);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState<Partial<Role>>({});
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const openAdd = () => { setEditing(null); setForm({ isSystem: false }); setSelectedPerms([]); setShowModal(true); };
  const openEdit = (r: Role) => { setEditing(r); setForm(r); setSelectedPerms([...r.permissions]); setShowModal(true); };

  const togglePerm = (p: string) => setSelectedPerms(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p]);

  const handleSave = () => {
    if (!form.name || !form.code) return;
    if (editing) {
      setRoles(rs => rs.map(r => r.id === editing.id ? { ...r, ...form, permissions: selectedPerms } as Role : r));
    } else {
      setRoles(rs => [...rs, { id: String(Date.now()), userCount: 0, isSystem: false, createdAt: new Date().toISOString().slice(0, 10), ...form, permissions: selectedPerms } as Role]);
    }
    setShowModal(false);
  };

  const handleDelete = (r: Role) => {
    if (r.isSystem) return;
    setRoles(rs => rs.filter(x => x.id !== r.id));
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">角色管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">定义角色权限，控制系统访问</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建角色
        </button>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '角色总数', value: roles.length, icon: Shield, color: 'text-blue-500 bg-blue-50' },
          { label: '系统内置', value: roles.filter(r => r.isSystem).length, icon: Lock, color: 'text-purple-500 bg-purple-50' },
          { label: '自定义角色', value: roles.filter(r => !r.isSystem).length, icon: Plus, color: 'text-emerald-500 bg-emerald-50' },
          { label: '分配用户数', value: roles.reduce((s, r) => s + r.userCount, 0), icon: Users, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 角色卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map(r => (
          <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${ROLE_COLORS[r.code] || 'from-gray-400 to-gray-500'}`} />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{r.name}</h3>
                    {r.isSystem && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">内置</span>}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{r.code}</div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users size={13} className="text-gray-400" />{r.userCount} 人
                </div>
              </div>
              <p className="text-sm text-gray-500">{r.description}</p>
              <div>
                <div className="text-xs text-gray-400 mb-1.5">权限（{r.permissions.length}/{ALL_PERMS.length}）</div>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.slice(0, 6).map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">{p}</span>
                  ))}
                  {r.permissions.length > 6 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">+{r.permissions.length - 6}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                <button onClick={() => openEdit(r)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium"><Pencil size={11} />编辑</button>
                {!r.isSystem && (
                  <button onClick={() => handleDelete(r)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium ml-auto"><Trash size={11} />删除</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">{editing ? '编辑角色' : '新建角色'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">角色名称</label>
                <input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="如：审计员" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">角色代码（英文）</label>
                <input value={form.code || ''} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="如：auditor" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">角色描述</label>
                <textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">权限配置（{selectedPerms.length} 项已选）</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {ALL_PERMS.map(p => (
                    <label key={p} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-xs ${selectedPerms.includes(p) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={selectedPerms.includes(p)} onChange={() => togglePerm(p)} className="w-3.5 h-3.5 accent-blue-600" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
