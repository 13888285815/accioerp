import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ── localStorage 版本清理（必须在所有 store import 之前执行）──────────────────
// 每次迭代若数据结构变化，递增此版本号，旧数据自动清除
const APP_VERSION = '3';
try {
  if (localStorage.getItem('app_version') !== APP_VERSION) {
    const keys = ['wms_data', 'wms_subscription', 'wms_erp', 'wms_language'];
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('app_version', APP_VERSION);
  }
} catch {
  // localStorage 不可用（隐身模式极限情况），忽略
}

// ── 全局错误捕获（在 React 之前注册，兜底白屏） ──────────────────────────────
function showFatalError(msg: string) {
  document.body.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
      height:100vh;font-family:sans-serif;background:#f8fafc;color:#1e293b;padding:2rem;text-align:center">
      <div style="font-size:3rem;margin-bottom:1rem">🏭</div>
      <h2 style="margin:0 0 0.5rem">意念ERP 启动失败</h2>
      <pre style="color:#dc2626;background:#fef2f2;padding:1rem;border-radius:0.5rem;
        max-width:600px;overflow:auto;text-align:left;font-size:0.875rem;white-space:pre-wrap">${msg}</pre>
      <button onclick="window.location.reload()"
        style="margin-top:1rem;background:#1d4ed8;color:#fff;border:none;
          padding:0.5rem 1.5rem;border-radius:0.5rem;cursor:pointer;font-size:1rem">
        刷新重试
      </button>
    </div>`;
}

window.onerror = (_msg, src, line, col, err) => {
  showFatalError(`${err?.message || _msg}\n\n来源: ${src}:${line}:${col}\n\n${err?.stack || ''}`);
  return true;
};

window.addEventListener('unhandledrejection', (e) => {
  showFatalError(`未处理的 Promise 异常\n\n${e.reason?.stack || e.reason || e}`);
});

// ── React ErrorBoundary ───────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif',
          background: '#f8fafc', color: '#1e293b', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏭</div>
          <h2 style={{ margin: '0 0 0.5rem' }}>意念ERP 启动失败</h2>
          <pre style={{
            color: '#dc2626', background: '#fef2f2', padding: '1rem',
            borderRadius: '0.5rem', maxWidth: '600px', overflow: 'auto',
            textAlign: 'left', fontSize: '0.875rem', whiteSpace: 'pre-wrap'
          }}>
            {this.state.error.message}{'\n\n'}{this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem', background: '#1d4ed8', color: '#fff', border: 'none',
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem',
              cursor: 'pointer', fontSize: '1rem'
            }}
          >
            刷新重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
if (!root) {
  document.body.innerHTML = '<div style="padding:2rem;font-family:sans-serif;color:red">错误：找不到 #root 元素</div>';
} else {
  ReactDOM.createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
