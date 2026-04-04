import React, { useState } from 'react';
import {
  LayoutDashboard, Warehouse, Package, ArrowDownToLine, ArrowUpFromLine,
  ShoppingCart, Truck, Users, BarChart, Settings, X, LogOut, CreditCard,
  Zap, DollarSign, UserCheck, Handshake, ClipboardList, Factory, ChevronRight,
  Shield, Tag, ScanLine, GitBranch, Monitor, Box, FileText, CreditCard as Cashier,
  ShoppingBag, Percent, Building2, PieChart, Database, FileBarChart,
  Network, KeyRound, Key, BarChart2, Lock, ChevronDown,
  Layers, Navigation, Globe, Package2, MapPin, Route, Grid, FolderTree, ReceiptText, Receipt, Calculator,
} from 'lucide-react';
import { User } from '../../types';
import { subscriptionStore } from '../../store/subscription';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem { label: string; icon: React.ElementType; page: string; }
interface NavGroup { label: string; items: NavItem[]; collapsible?: boolean; }

const navGroups: NavGroup[] = [
  {
    label: '主控台',
    items: [
      { label: '工作台', icon: LayoutDashboard, page: 'dashboard' },
      { label: '主控制台', icon: Monitor, page: 'masterconsole' },
    ],
  },
  {
    label: '仓储管理',
    items: [
      { label: '仓库管理', icon: Warehouse, page: 'warehouses' },
      { label: '库存管理', icon: Package, page: 'inventory' },
      { label: '入库管理', icon: ArrowDownToLine, page: 'inbound' },
      { label: '出库管理', icon: ArrowUpFromLine, page: 'outbound' },
      { label: '销售订单', icon: ShoppingCart, page: 'orders' },
      { label: '供应商', icon: Truck, page: 'suppliers' },
      { label: '盘点管理', icon: ScanLine, page: 'stocktake' },
      { label: '分类管理', icon: FolderTree, page: 'category' },
      { label: '空间管理', icon: Grid, page: 'spacemanagement' },
      { label: '立体仓库', icon: Layers, page: 'autowarehouse' },
    ],
  },
  {
    label: '仓储作业',
    collapsible: true,
    items: [
      { label: '分拣管理', icon: ScanLine, page: 'sorting' },
      { label: '加工管理', icon: Factory, page: 'processing' },
      { label: '包装管理', icon: Package2, page: 'packaging' },
      { label: '在途管理', icon: Route, page: 'intransit' },
      { label: '配送管理', icon: Navigation, page: 'delivery' },
      { label: '物流管理', icon: MapPin, page: 'logistics' },
      { label: '运输管理', icon: Truck, page: 'transport' },
    ],
  },
  {
    label: '商品与销售',
    collapsible: true,
    items: [
      { label: '商品管理', icon: Box, page: 'products' },
      { label: '零售管理', icon: ShoppingBag, page: 'retail' },
      { label: '批发管理', icon: Building2, page: 'wholesale' },
      { label: '促销管理', icon: Percent, page: 'promotions' },
      { label: '价格管理', icon: Tag, page: 'price' },
      { label: '收银管理', icon: Cashier, page: 'cashier' },
      { label: '跨境电商', icon: Globe, page: 'crossborder' },
      { label: '寄售管理', icon: Handshake, page: 'consignment' },
    ],
  },
  {
    label: '财税管理',
    collapsible: true,
    items: [
      { label: '凭证管理', icon: ReceiptText, page: 'voucher' },
      { label: '发票管理', icon: Receipt, page: 'invoice' },
      { label: '税务管理', icon: Calculator, page: 'tax' },
    ],
  },
  {
    label: '企业管理 ERP',
    collapsible: true,
    items: [
      { label: '财务管理', icon: DollarSign, page: 'finance' },
      { label: '人力资源', icon: UserCheck, page: 'hr' },
      { label: '客户关系', icon: Handshake, page: 'crm' },
      { label: '采购管理', icon: ClipboardList, page: 'purchase' },
      { label: '生产管理', icon: Factory, page: 'production' },
      { label: '质量管理', icon: Shield, page: 'quality' },
      { label: '合同管理', icon: FileText, page: 'contracts' },
      { label: '流程管理', icon: GitBranch, page: 'workflow' },
    ],
  },
  {
    label: '数据与报表',
    collapsible: true,
    items: [
      { label: '图表分析', icon: PieChart, page: 'chartanalysis' },
      { label: '报表中心', icon: BarChart, page: 'reports' },
      { label: '报表管理', icon: FileBarChart, page: 'reportcenter' },
      { label: '数据中心', icon: Database, page: 'datacenter' },
    ],
  },
  {
    label: '组织与权限',
    collapsible: true,
    items: [
      { label: '组织机构', icon: Network, page: 'orgstructure' },
      { label: '用户管理', icon: Users, page: 'users' },
      { label: '角色管理', icon: KeyRound, page: 'roles' },
      { label: '权限管理', icon: Lock, page: 'permissions' },
    ],
  },
  {
    label: '系统',
    collapsible: true,
    items: [
      { label: 'Token 管理', icon: Zap, page: 'tokenmgr' },
      { label: 'API Key 管理', icon: Key, page: 'apikeys' },
      { label: '系统设置', icon: Settings, page: 'settings' },
    ],
  },
];

const roleLabels: Record<string, string> = {
  admin: '超级管理员',
  manager: '仓库经理',
  operator: '操作员',
  viewer: '只读',
};

const planColors: Record<string, string> = {
  free: 'bg-gray-700 text-gray-300',
  pro: 'bg-blue-600 text-white',
  enterprise: 'bg-purple-600 text-white',
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage, onNavigate, currentUser, onLogout, isOpen, onClose
}) => {
  const plan = subscriptionStore.getCurrentPlan();
  const tokens = subscriptionStore.getTokensAvailable();

  // 默认展开包含当前页面的分组
  const defaultCollapsed = navGroups.reduce((acc, g) => {
    if (g.collapsible) {
      const hasActive = g.items.some(i => i.page === currentPage);
      acc[g.label] = !hasActive;
    }
    return acc;
  }, {} as Record<string, boolean>);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(defaultCollapsed);
  const toggleGroup = (label: string) => setCollapsed(c => ({ ...c, [label]: !c[label] }));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-gray-900 text-white z-40
          flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Factory size={16} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">意念ERP</span>
              <div className="text-[10px] text-gray-500 leading-none">企业资源管理系统</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-800 rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 py-2 overflow-y-auto no-scrollbar" role="navigation">
          {navGroups.map((group) => {
            const isCollapsed = group.collapsible ? (collapsed[group.label] ?? false) : false;
            return (
              <div key={group.label} className="mb-0.5">
                {/* Group Header */}
                <div
                  className={`flex items-center justify-between px-4 py-1.5 ${group.collapsible ? 'cursor-pointer hover:bg-gray-800/50 rounded mx-1' : ''}`}
                  onClick={group.collapsible ? () => toggleGroup(group.label) : undefined}
                >
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {group.label}
                  </span>
                  {group.collapsible && (
                    <ChevronDown size={11} className={`text-gray-600 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                  )}
                </div>
                {/* Group Items */}
                {!isCollapsed && group.items.map(({ label, icon: Icon, page }) => (
                  <button
                    key={page}
                    onClick={() => { onNavigate(page); onClose(); }}
                    className={`
                      w-[calc(100%-8px)] mx-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-150 mb-0.5
                      ${currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    <span className="truncate flex-1 text-left">{label}</span>
                    {currentPage === page && <ChevronRight size={11} className="flex-shrink-0 opacity-60" />}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 space-y-2.5">
          {/* Plan & Tokens */}
          <div className="bg-gray-800/60 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">当前方案</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${planColors[plan.id] || 'bg-gray-600'}`}>
                {plan.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={13} className="text-yellow-400 flex-shrink-0" />
              <span className="text-gray-300 text-xs truncate">
                {tokens === Infinity ? '无限 Token' : `${tokens.toLocaleString()} Token 剩余`}
              </span>
            </div>
            <button
              onClick={() => { onNavigate('subscription'); onClose(); }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
            >
              <CreditCard size={11} />
              <span>订阅与计费</span>
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{currentUser.name}</div>
              <div className="text-xs text-gray-500 truncate">{roleLabels[currentUser.role] || currentUser.role}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>
    </>
  );
};
