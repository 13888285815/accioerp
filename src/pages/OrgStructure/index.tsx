import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronDown, Users, Building, Pencil, Trash, UserPlus } from 'lucide-react';

interface Dept {
  id: string; name: string; manager: string; headcount: number; budget: number;
  children?: Dept[];
}

const initTree: Dept[] = [
  {
    id: '1', name: '总公司', manager: '董事长 张总', headcount: 1, budget: 10000000,
    children: [
      {
        id: '2', name: '技术部', manager: '技术总监 李明', headcount: 42, budget: 2800000,
        children: [
          { id: '5', name: '前端组', manager: '前端组长 王小红', headcount: 12, budget: 600000 },
          { id: '6', name: '后端组', manager: '后端组长 陈志远', headcount: 18, budget: 900000 },
          { id: '7', name: '测试组', manager: '测试组长 赵雪梅', headcount: 8, budget: 400000 },
          { id: '8', name: '运维组', manager: '运维组长 钱建国', headcount: 4, budget: 200000 },
        ]
      },
      {
        id: '3', name: '销售部', manager: '销售总监 王芳', headcount: 56, budget: 3200000,
        children: [
          { id: '9', name: '华北区', manager: '区域经理 孙伟', headcount: 20, budget: 1200000 },
          { id: '10', name: '华东区', manager: '区域经理 周婷', headcount: 24, budget: 1400000 },
          { id: '11', name: '华南区', manager: '区域经理 吴强', headcount: 12, budget: 600000 },
        ]
      },
      {
        id: '4', name: '行政部', manager: '行政总监 刘洋', headcount: 18, budget: 800000,
        children: [
          { id: '12', name: 'HR组', manager: 'HR主管 郑美丽', headcount: 8, budget: 300000 },
          { id: '13', name: '财务组', manager: '财务主管 胡雨晴', headcount: 6, budget: 280000 },
          { id: '14', name: '法务组', manager: '法务主管 黄天宇', headcount: 4, budget: 220000 },
        ]
      },
    ]
  }
];

const DeptNode: React.FC<{ dept: Dept; level: number; onDelete: (id: string) => void }> = ({ dept, level, onDelete }) => {
  const [open, setOpen] = useState(level < 2);
  const hasChildren = dept.children && dept.children.length > 0;

  return (
    <div>
      <div className={`flex items-center gap-2 py-2.5 px-3 rounded-xl hover:bg-gray-50 group transition-colors`} style={{ marginLeft: `${level * 20}px` }}>
        <button onClick={() => setOpen(!open)} className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 ${!hasChildren && 'invisible'}`}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${level === 0 ? 'bg-blue-600 text-white' : level === 1 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          <Building size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{dept.name}</span>
            <span className="text-xs text-gray-400 flex items-center gap-0.5"><Users size={10} />{dept.headcount}人</span>
          </div>
          <div className="text-xs text-gray-400 truncate">{dept.manager} · 预算 ¥{(dept.budget / 10000).toFixed(0)}万</div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Pencil size={12} /></button>
          <button onClick={() => onDelete(dept.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash size={12} /></button>
        </div>
      </div>
      {open && hasChildren && dept.children!.map(child => (
        <DeptNode key={child.id} dept={child} level={level + 1} onDelete={onDelete} />
      ))}
    </div>
  );
};

const flatCount = (dept: Dept): number => {
  if (!dept.children) return dept.headcount;
  return dept.headcount + dept.children.reduce((s, d) => s + flatCount(d), 0);
};

export default function OrgStructurePage() {
  const [tree, setTree] = useState<Dept[]>(initTree);

  const handleDelete = (id: string) => {
    const remove = (depts: Dept[]): Dept[] =>
      depts.filter(d => d.id !== id).map(d => ({ ...d, children: d.children ? remove(d.children) : undefined }));
    setTree(remove(tree));
  };

  const total = tree.reduce((s, d) => s + flatCount(d), 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">组织机构管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">部门树形结构与编制管理</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 新建部门
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '部门总数', value: 14, icon: Building, color: 'text-blue-500 bg-blue-50' },
          { label: '员工总数', value: total, icon: Users, color: 'text-emerald-500 bg-emerald-50' },
          { label: '层级深度', value: 3, icon: ChevronDown, color: 'text-purple-500 bg-purple-50' },
          { label: '年度预算', value: '¥6800万', icon: UserPlus, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="mb-3 flex items-center gap-2 px-3">
          <Building size={15} className="text-blue-500" />
          <h3 className="font-semibold text-gray-800 text-sm">部门架构</h3>
        </div>
        <div className="space-y-0.5">
          {tree.map(d => <DeptNode key={d.id} dept={d} level={0} onDelete={handleDelete} />)}
        </div>
      </div>
    </div>
  );
}
