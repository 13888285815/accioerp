import React, { useState } from 'react';
import { Shield, Lock, Unlock, Users, ChevronRight, CheckCircle, XCircle, Search } from 'lucide-react';

interface PermGroup {
  group: string; icon: string;
  permissions: { code: string; name: string; desc: string }[];
}

const PERM_GROUPS: PermGroup[] = [
  {
    group: '仓储管理', icon: '🏭',
    permissions: [
      { code: 'warehouse:view', name: '仓库查看', desc: '查看仓库列表和详情' },
      { code: 'warehouse:edit', name: '仓库编辑', desc: '新增、修改、删除仓库' },
      { code: 'inventory:view', name: '库存查看', desc: '查看库存数量和记录' },
      { code: 'inventory:edit', name: '库存编辑', desc: '修改库存数量和属性' },
      { code: 'inbound:operate', name: '入库操作', desc: '创建和确认入库单' },
      { code: 'outbound:operate', name: '出库操作', desc: '创建和确认出库单' },
    ],
  },
  {
    group: '订单与供应商', icon: '📦',
    permissions: [
      { code: 'order:view', name: '订单查看', desc: '查看所有销售订单' },
      { code: 'order:edit', name: '订单编辑', desc: '创建、修改、取消订单' },
      { code: 'supplier:manage', name: '供应商管理', desc: '管理供应商信息和合同' },
    ],
  },
  {
    group: '财务与HR', icon: '💰',
    permissions: [
      { code: 'finance:view', name: '财务查看', desc: '查看财务报表和账单' },
      { code: 'finance:edit', name: '财务编辑', desc: '录入收支记录' },
      { code: 'hr:manage', name: 'HR管理', desc: '管理员工、考勤、薪资' },
      { code: 'crm:manage', name: 'CRM管理', desc: '管理客户和商机' },
    ],
  },
  {
    group: '系统管理', icon: '⚙️',
    permissions: [
      { code: 'report:view', name: '报表查看', desc: '查看和导出各类报表' },
      { code: 'user:manage', name: '用户管理', desc: '管理系统用户账号' },
      { code: 'role:manage', name: '角色管理', desc: '管理角色和权限分配' },
      { code: 'system:settings', name: '系统设置', desc: '修改系统全局配置' },
      { code: 'subscription:manage', name: '订阅管理', desc: '管理订阅计划和计费' },
    ],
  },
];

const ROLES = ['超级管理员', '仓库经理', '操作员', '只读用户', '财务专员', '销售顾问'];
const ROLE_GRANTS: Record<string, string[]> = {
  '超级管理员': PERM_GROUPS.flatMap(g => g.permissions.map(p => p.code)),
  '仓库经理': ['warehouse:view','warehouse:edit','inventory:view','inventory:edit','inbound:operate','outbound:operate','order:view','order:edit','supplier:manage','report:view'],
  '操作员': ['warehouse:view','inventory:view','inbound:operate','outbound:operate','order:view'],
  '只读用户': ['warehouse:view','inventory:view','order:view','report:view'],
  '财务专员': ['finance:view','finance:edit','report:view','order:view'],
  '销售顾问': ['crm:manage','order:view','order:edit','supplier:manage','report:view'],
};

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [search, setSearch] = useState('');
  const grants = ROLE_GRANTS[selectedRole] || [];
  const allPerms = PERM_GROUPS.flatMap(g => g.permissions);
  const filtered = search
    ? PERM_GROUPS.map(g => ({ ...g, permissions: g.permissions.filter(p => p.name.includes(search) || p.code.includes(search)) })).filter(g => g.permissions.length > 0)
    : PERM_GROUPS;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">查看各角色的权限分配明细</p>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '权限总数', value: allPerms.length, icon: Shield, color: 'text-blue-500 bg-blue-50' },
          { label: '权限分组', value: PERM_GROUPS.length, icon: Lock, color: 'text-purple-500 bg-purple-50' },
          { label: '角色数量', value: ROLES.length, icon: Users, color: 'text-emerald-500 bg-emerald-50' },
          { label: '当前角色权限', value: grants.length, icon: CheckCircle, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* 角色选择 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">选择角色</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {ROLES.map(role => (
              <button key={role} onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${selectedRole === role ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span>{role}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs ${selectedRole === role ? 'text-blue-500' : 'text-gray-400'}`}>{(ROLE_GRANTS[role] || []).length}</span>
                  <ChevronRight size={13} className={selectedRole === role ? 'text-blue-400' : 'text-gray-300'} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 权限列表 */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索权限..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>

          <div className="space-y-4">
            {filtered.map(group => (
              <div key={group.group} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span>{group.icon}</span>
                  <h3 className="font-semibold text-gray-800 text-sm">{group.group}</h3>
                  <span className="ml-auto text-xs text-gray-400">
                    {group.permissions.filter(p => grants.includes(p.code)).length}/{group.permissions.length} 项已授权
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {group.permissions.map(perm => {
                    const granted = grants.includes(perm.code);
                    return (
                      <div key={perm.code} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{perm.name}</span>
                            <span className="text-xs font-mono text-gray-400 hidden sm:block">{perm.code}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{perm.desc}</div>
                        </div>
                        <div className={`flex items-center gap-1.5 text-sm font-medium flex-shrink-0 ${granted ? 'text-emerald-600' : 'text-gray-300'}`}>
                          {granted ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          <span className="text-xs">{granted ? '已授权' : '未授权'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
