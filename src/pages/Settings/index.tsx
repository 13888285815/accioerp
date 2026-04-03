import React, { useState } from 'react';
import { Settings, Database, Download, Upload, RefreshCw, Info, Shield } from 'lucide-react';
import { store } from '../../store';

export const SettingsPage: React.FC = () => {
  const [message, setMessage] = useState('');

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExport = () => {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('数据已导出到本地');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          store.importData(ev.target?.result as string);
          showMsg('数据导入成功，正在刷新...');
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          showMsg('导入失败：文件格式不正确');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有演示数据吗？您的自定义修改将会丢失。')) {
      store.resetData();
      showMsg('演示数据已恢复');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {message && (
        <div className="fixed top-20 right-4 md:right-8 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50">
          <div className="flex items-center gap-2 font-medium">
            <Info size={18} />
            {message}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-500 text-sm">管理账户首选项、数据备份和系统配置</p>
      </div>

      {/* 数据管理 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Database size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">数据管理</h2>
            <p className="text-xs text-gray-400">导入、导出或重置系统数据</p>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100 flex gap-3">
            <Shield className="text-amber-600 flex-shrink-0" size={20} />
            <div className="text-sm text-amber-800">
              数据存储在浏览器本地（LocalStorage），建议定期导出备份，防止数据丢失。
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Download size={18} />
              导出备份 JSON
            </button>
            <button
              onClick={handleImport}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Upload size={18} />
              导入数据
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <RefreshCw size={18} />
              重置演示数据
            </button>
          </div>
        </div>
      </section>

      {/* 时区与日期格式 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">显示设置</h2>
            <p className="text-xs text-gray-400">时区与日期格式</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">默认时区</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>(GMT+08:00) 北京、上海、香港</option>
                <option>(GMT+00:00) 伦敦、UTC</option>
                <option>(GMT-05:00) 纽约、华盛顿</option>
                <option>(GMT+09:00) 东京、首尔</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">日期格式</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>YYYY-MM-DD（2026-03-31）</option>
                <option>DD/MM/YYYY（31/03/2026）</option>
                <option>MM/DD/YYYY（03/31/2026）</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 关于系统 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Info size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">关于系统</h2>
            <p className="text-xs text-gray-400">软件版本与技术信息</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm">系统版本</span>
              <span className="text-gray-900 font-medium text-sm">v1.2.4 Enterprise</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm">存储状态</span>
              <span className="text-gray-900 font-medium text-sm">本地存储</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm">技术架构</span>
              <span className="text-gray-900 font-medium text-sm">React + TS + Tailwind</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 text-sm">数据加密</span>
              <span className="text-gray-900 font-medium text-sm">AES-256（本地导出）</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-xs">© 2026 意念ERP. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
