import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/ui/Toast';
import { store } from './store';
import { User } from './types';

// WMS Pages
import DashboardPage from './pages/Dashboard';
import WarehousesPage from './pages/Warehouses';
import InventoryPage from './pages/Inventory';
import InboundPage from './pages/Inbound';
import OutboundPage from './pages/Outbound';
import OrdersPage from './pages/Orders';
import SuppliersPage from './pages/Suppliers';
import UsersPage from './pages/Users';
import ReportsPage from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import SubscriptionPage from './pages/Subscription';
import LoginPage from './pages/Login';

// ERP Pages
import FinancePage from './pages/Finance';
import HRPage from './pages/HR';
import CRMPage from './pages/CRM';
import PurchasePage from './pages/Purchase';
import ProductionPage from './pages/Production';
import QualityPage from './pages/Quality';
import PricePage from './pages/Price';
import StocktakePage from './pages/Stocktake';
import WorkflowPage from './pages/Workflow';

// New Pages
import MasterConsolePage from './pages/MasterConsole';
import ProductsPage from './pages/Products';
import ContractsPage from './pages/Contracts';
import CashierPage from './pages/Cashier';
import RetailPage from './pages/Retail';
import PromotionsPage from './pages/Promotions';
import WholesalePage from './pages/Wholesale';
import ChartAnalysisPage from './pages/ChartAnalysis';
import DataCenterPage from './pages/DataCenter';
import ReportCenterPage from './pages/ReportCenter';
import OrgStructurePage from './pages/OrgStructure';
import RolesPage from './pages/Roles';
import PermissionsPage from './pages/Permissions';
import TokenMgrPage from './pages/TokenMgr';
import ApiKeysPage from './pages/ApiKeys';

// New Batch 2 Pages
import CategoryPage from './pages/Category';
import CrossBorderPage from './pages/CrossBorder';
import ConsignmentPage from './pages/Consignment';
import InTransitPage from './pages/InTransit';
import DeliveryPage from './pages/Delivery';
import LogisticsPage from './pages/Logistics';
import TransportPage from './pages/Transport';
import SpaceManagementPage from './pages/SpaceManagement';
import AutoWarehousePage from './pages/AutoWarehouse';
import SortingPage from './pages/Sorting';
import ProcessingPage from './pages/Processing';
import PackagingPage from './pages/Packaging';
import VoucherPage from './pages/Voucher';
import InvoicePage from './pages/Invoice';
import TaxPage from './pages/Tax';

// New Batch 3 Pages
import MemberPage from './pages/Member';
import MaintenancePage from './pages/Maintenance';
import ProcessMgrPage from './pages/ProcessMgr';
import AssetsPage from './pages/Assets';
import AccountingPage from './pages/Accounting';
import FundManagementPage from './pages/FundManagement';
import TransferPage from './pages/Transfer';
import RouteManagementPage from './pages/RouteManagement';
import MapViewPage from './pages/MapView';
import SatNavPage from './pages/SatNav';

type Page =
  | 'dashboard' | 'warehouses' | 'inventory' | 'inbound' | 'outbound'
  | 'orders' | 'suppliers' | 'users' | 'reports' | 'settings' | 'subscription'
  | 'finance' | 'hr' | 'crm' | 'purchase' | 'production'
  | 'quality' | 'price' | 'stocktake' | 'workflow'
  | 'masterconsole' | 'products' | 'contracts' | 'cashier'
  | 'retail' | 'promotions' | 'wholesale'
  | 'chartanalysis' | 'datacenter' | 'reportcenter'
  | 'orgstructure' | 'roles' | 'permissions' | 'tokenmgr' | 'apikeys'
  | 'category' | 'crossborder' | 'consignment' | 'intransit'
  | 'delivery' | 'logistics' | 'transport' | 'spacemanagement'
  | 'autowarehouse' | 'sorting' | 'processing' | 'packaging'
  | 'voucher' | 'invoice' | 'tax'
  | 'member' | 'maintenance' | 'processmgr' | 'assets'
  | 'accounting' | 'fundmgmt' | 'transfer'
  | 'routemgmt' | 'mapview' | 'satnav';

const pageTitles: Record<string, string> = {
  dashboard: '工作台',
  warehouses: '仓库管理',
  inventory: '库存管理',
  inbound: '入库管理',
  outbound: '出库管理',
  orders: '销售订单',
  suppliers: '供应商',
  users: '用户管理',
  reports: '报表中心',
  settings: '系统设置',
  subscription: '订阅与计费',
  finance: '财务管理',
  hr: '人力资源',
  crm: '客户关系',
  purchase: '采购管理',
  production: '生产管理',
  quality: '质量管理',
  price: '价格管理',
  stocktake: '盘点管理',
  workflow: '流程管理',
  masterconsole: '主控制台',
  products: '商品管理',
  contracts: '合同管理',
  cashier: '收银管理',
  retail: '零售管理',
  promotions: '促销管理',
  wholesale: '批发管理',
  chartanalysis: '图表分析',
  datacenter: '数据中心',
  reportcenter: '报表管理',
  orgstructure: '组织机构',
  roles: '角色管理',
  permissions: '权限管理',
  tokenmgr: 'Token 管理',
  apikeys: 'API Key 管理',
  category: '分类管理',
  crossborder: '跨境电商',
  consignment: '寄售管理',
  intransit: '在途管理',
  delivery: '配送管理',
  logistics: '物流管理',
  transport: '运输管理',
  spacemanagement: '空间管理',
  autowarehouse: '立体仓库',
  sorting: '分拣管理',
  processing: '加工管理',
  packaging: '包装管理',
  voucher: '凭证管理',
  invoice: '发票管理',
  tax: '税务管理',
  member: '会员管理',
  maintenance: '维护管理',
  processmgr: '进程管理',
  assets: '资产管理',
  accounting: '会计管理',
  fundmgmt: '资金管理',
  transfer: '调拨管理',
  routemgmt: '路线管理',
  mapview: '地图管理',
  satnav: '卫星导航',
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [layoutDir, setLayoutDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const currentDir = (document.documentElement.dir as 'ltr' | 'rtl') || 'ltr';
    setLayoutDir(currentDir);
    const state = store.getState();
    if (state.currentUser) setCurrentUser(state.currentUser);

    const observer = new MutationObserver(() => {
      setLayoutDir((document.documentElement.dir as 'ltr' | 'rtl') || 'ltr');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => { store.logout(); setCurrentUser(null); };

  const renderPage = () => {
    switch (currentPage) {
      // WMS
      case 'dashboard':      return <DashboardPage />;
      case 'warehouses':     return <WarehousesPage />;
      case 'inventory':      return <InventoryPage />;
      case 'inbound':        return <InboundPage />;
      case 'outbound':       return <OutboundPage />;
      case 'orders':         return <OrdersPage />;
      case 'suppliers':      return <SuppliersPage />;
      case 'users':          return <UsersPage />;
      case 'reports':        return <ReportsPage />;
      case 'settings':       return <SettingsPage />;
      case 'subscription':   return <SubscriptionPage />;
      // ERP
      case 'finance':        return <FinancePage />;
      case 'hr':             return <HRPage />;
      case 'crm':            return <CRMPage />;
      case 'purchase':       return <PurchasePage />;
      case 'production':     return <ProductionPage />;
      case 'quality':        return <QualityPage />;
      case 'price':          return <PricePage />;
      case 'stocktake':      return <StocktakePage />;
      case 'workflow':       return <WorkflowPage />;
      // New
      case 'masterconsole':  return <MasterConsolePage />;
      case 'products':       return <ProductsPage />;
      case 'contracts':      return <ContractsPage />;
      case 'cashier':        return <CashierPage />;
      case 'retail':         return <RetailPage />;
      case 'promotions':     return <PromotionsPage />;
      case 'wholesale':      return <WholesalePage />;
      case 'chartanalysis':  return <ChartAnalysisPage />;
      case 'datacenter':     return <DataCenterPage />;
      case 'reportcenter':   return <ReportCenterPage />;
      case 'orgstructure':   return <OrgStructurePage />;
      case 'roles':          return <RolesPage />;
      case 'permissions':    return <PermissionsPage />;
      case 'tokenmgr':       return <TokenMgrPage />;
      case 'apikeys':        return <ApiKeysPage />;
      // Batch 2
      case 'category':       return <CategoryPage />;
      case 'crossborder':    return <CrossBorderPage />;
      case 'consignment':    return <ConsignmentPage />;
      case 'intransit':      return <InTransitPage />;
      case 'delivery':       return <DeliveryPage />;
      case 'logistics':      return <LogisticsPage />;
      case 'transport':      return <TransportPage />;
      case 'spacemanagement': return <SpaceManagementPage />;
      case 'autowarehouse':  return <AutoWarehousePage />;
      case 'sorting':        return <SortingPage />;
      case 'processing':     return <ProcessingPage />;
      case 'packaging':      return <PackagingPage />;
      case 'voucher':        return <VoucherPage />;
      case 'invoice':        return <InvoicePage />;
      case 'tax':            return <TaxPage />;
      // Batch 3
      case 'member':         return <MemberPage />;
      case 'maintenance':    return <MaintenancePage />;
      case 'processmgr':     return <ProcessMgrPage />;
      case 'assets':         return <AssetsPage />;
      case 'accounting':     return <AccountingPage />;
      case 'fundmgmt':       return <FundManagementPage />;
      case 'transfer':       return <TransferPage />;
      case 'routemgmt':      return <RouteManagementPage />;
      case 'mapview':        return <MapViewPage />;
      case 'satnav':         return <SatNavPage />;
      default:               return <DashboardPage />;
    }
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir={layoutDir}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as Page)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={pageTitles[currentPage] || '意念ERP'} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
