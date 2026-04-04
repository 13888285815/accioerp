import React, { useState } from 'react';
import { Key, Plus, Copy, Trash, Eye, EyeOff, Shield, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface ApiKey {
  id: string; name: string; prefix: string; secret: string;
  permissions: string[]; status: 'active' | 'inactive' | 'expired';
  lastUsed: string; createdAt: string; expiresAt: string | null;
  requestCount: number;
}

const maskKey = (prefix: string) => `${prefix}${'•'.repeat(32)}`;

const initKeys: ApiKey[] = [
  { id: '1', name: '生产环境主密钥', prefix: 'sk-prod-', secret: 'sk-prod-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', permissions: ['read', 'write', 'admin'], status: 'active', lastUsed: '2分钟前', createdAt: '2026-01-01', expiresAt: null, requestCount: 48291 },
  { id: '2', name: '前端只读密钥', prefix: 'sk-ro-', secret: 'sk-ro-q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2', permissions: ['read'], status: 'active', lastUsed: '1小时前', createdAt: '2026-02-15', expiresAt: '2026-12-31', requestCount: 12840 },
  { id: '3', name: '测试环境密钥', prefix: 'sk-test-', secret: 'sk-test-g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8', permissions: ['read', 'write'], status: 'inactive', lastUsed: '3天前', createdAt: '2026-03-01', expiresAt: '2026-04-30', requestCount: 2104 },
  { id: '4', name: '已过期密钥', prefix: 'sk-old-', secret: 'sk-old-w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4', permissions: ['read'], status: 'expired', lastUsed: '30天前', createdAt: '2025-10-01', expiresAt: '2026-03-31', requestCount: 8820 },
];

const PERM_LABELS: Record<string, { label: string; color: string }> = {
  read: { label: '只读', color: 'bg-blue-50 text-blue-700' },
  write: { label: '读写', color: 'bg-emerald-50 text-emerald-700' },
  admin: { label: '管理', color: 'bg-red-50 text-red-700' },
};

const STATUS_MAP = {
  active: { label: '正常', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  inactive: { label: '已禁用', color: 'text-gray-500 bg-gray-100', icon: AlertTriangle },
  expired: { label: '已过期', color: 'text-red-500 bg-red-50', icon: Clock },
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(initKeys);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', permissions: ['read'], expiresAt: '' });

  const handleCopy = (key: ApiKey) => {
    navigator.clipboard.writeText(key.secret).catch(() => {});
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => setKeys(ks => ks.filter(k => k.id !== id));
  const handleToggle = (id: string) => setKeys(ks => ks.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'inactive' : 'active' } : k));

  const handleCreate = () => {
    if (!form.name) return;
    const prefix = 'sk-new-';
    const secret = prefix + Math.random().toString(36).slice(2, 34);
    setKeys(ks => [{
      id: String(Date.now()), name: form.name, prefix, secret,
      permissions: form.permissions, status: 'active',
      lastUsed: '刚刚创建', createdAt: new Date().toISOString().slice(0, 10),
      expiresAt: form.expiresAt || null, requestCount: 0,
    }, ...ks]);
    setShowModal(false);
    setForm({ name: '', permissions: ['read'], expiresAt: '' });
  };

  const togglePerm = (p: string) => setForm(f => ({
    ...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x => x !== p) : [...f.permissions, p]
  }));

  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalReqs = keys.reduce((s, k) => s + k.requestCount, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Key 管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">管理系统 API 密钥，控制第三方访问权限</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
          <Plus size={16} /> 创建 API Key
        </button>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'API Key 总数', value: keys.length, icon: Key, color: 'text-blue-500 bg-blue-50' },
          { label: '活跃密钥', value: activeKeys, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
          { label: '总请求数', value: totalReqs.toLocaleString(), icon: RefreshCw, color: 'text-purple-500 bg-purple-50' },
          { label: '过期/禁用', value: keys.filter(k => k.status !== 'active').length, icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon size={18} /></div>
            <div><div className="text-xl font-bold text-gray-900">{c.value}</div><div className="text-xs text-gray-500">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* 密钥列表 */}
      <div className="space-y-3">
        {keys.map(k => {
          const s = STATUS_MAP[k.status];
          const revealed = revealedId === k.id;
          const copied = copiedId === k.id;
          return (
            <div key={k.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{k.name}</h3>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                      <s.icon size={10} />{s.label}
                    </span>
                    {k.permissions.map(p => (
                      <span key={p} className={`text-xs px-1.5 py-0.5 rounded font-medium ${PERM_LABELS[p]?.color}`}>{PERM_LABELS[p]?.label}</span>
                    ))}
                  </div>
                  {/* Key 显示 */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 font-mono text-xs text-gray-600 overflow-x-auto">
                    <Key size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="flex-1 truncate">{revealed ? k.secret : maskKey(k.prefix)}</span>
                    <button onClick={() => setRevealedId(revealed ? null : k.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                      {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => handleCopy(k)} className={`flex-shrink-0 transition-colors ${copied ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}>
                      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span><Clock size={10} className="inline mr-0.5" />最近使用：{k.lastUsed}</span>
                    <span><Shield size={10} className="inline mr-0.5" />创建：{k.createdAt}</span>
                    {k.expiresAt && <span className={k.status === 'expired' ? 'text-red-400' : ''}>到期：{k.expiresAt}</span>}
                    <span>调用次数：{k.requestCount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  {k.status !== 'expired' && (
                    <button onClick={() => handleToggle(k.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${k.status === 'active' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                      {k.status === 'active' ? '禁用' : '启用'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(k.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1">
                    <Trash size={11} />删除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 创建弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">创建 API Key</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">密钥名称</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="如：移动端访问密钥" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">权限范围</label>
                <div className="flex gap-2">
                  {['read', 'write', 'admin'].map(p => (
                    <label key={p} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors text-sm ${form.permissions.includes(p) ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePerm(p)} className="w-3.5 h-3.5 accent-blue-600" />
                      {PERM_LABELS[p]?.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">到期日期（留空为永不过期）</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-700">
                <AlertTriangle size={12} className="inline mr-1" />密钥创建后仅显示一次，请妥善保存
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">创建密钥</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
