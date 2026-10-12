import React, { useState } from 'react';
import { Header } from './components/Header';
import { PrimaryRail } from './components/PrimaryRail';
import { SecondarySidebar, SubMenuKey } from './components/SecondarySidebar';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { TcpStringModelManagement } from './components/TcpStringModelManagement';
import { TcpStringModelConfig } from './components/TcpStringModelConfig';
import { TcpFixedModelView } from './components/TcpFixedModelView';
import { HttpModelView } from './components/HttpModelView';
import { GenericConfigPlaceholder } from './components/GenericConfigPlaceholder';
import { AppManageView } from './components/AppManageView';
import { BusinessFieldsModal } from './components/BusinessFieldsModal';
import { Toast } from './components/Toast';
import { initialTcpStringModels } from './mock/data';
import { TcpStringModel } from './types';

export default function App() {
  // Requirement 1: Default selected item is 'tcp_string' (TCP字符串模型)
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenuKey>('tcp_string');

  // Requirement 2: TCP字符串模型分为模型管理与模型配置tab，默认为模型管理页面
  const [tcpStringTab, setTcpStringTab] = useState<'management' | 'config'>('management');

  // Persistent models state for TCP String Models
  const [tcpStringModels, setTcpStringModels] = useState<TcpStringModel[]>(initialTcpStringModels);

  // Business fields dictionary modal
  const [isBusinessFieldsModalOpen, setIsBusinessFieldsModalOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toggle to inspect Figure 5 & Figure 6 Application Management Reference
  const [showAppViewDemo, setShowAppViewDemo] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const handleUpdateModel = (updated: TcpStringModel) => {
    setTcpStringModels((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  const handleDeleteModel = (id: number) => {
    setTcpStringModels((prev) => prev.filter((m) => m.id !== id));
  };

  const handleResetData = () => {
    setTcpStringModels(initialTcpStringModels);
    showToast('已恢复初始模拟数据');
  };

  const handleClearData = () => {
    setTcpStringModels([]);
    showToast('已清空模型列表以测试空状态');
  };

  const handleSaveNewModel = (newModel: TcpStringModel) => {
    setTcpStringModels((prev) => [newModel, ...prev]);
    // Switch to management tab to see the newly added model
    setTcpStringTab('management');
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-100 overflow-hidden text-slate-800 font-sans antialiased">
      {/* 1. Top Header Bar (Figure 1) */}
      <Header
        showAppViewDemo={showAppViewDemo}
        onToggleAppViewDemo={() => setShowAppViewDemo(!showAppViewDemo)}
      />

      {/* Main Container */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 2. Primary Dark Navigation Rail (Figure 1 leftmost bar) */}
        <PrimaryRail activeRailId="config" />

        {/* 3. Secondary Functional Sidebar (Figure 1: 功能配置 + Newly added TCP models) */}
        <SecondarySidebar
          selectedKey={selectedSubMenu}
          onSelectKey={(key) => {
            setSelectedSubMenu(key);
            setShowAppViewDemo(false);
          }}
          tcpStringCount={tcpStringModels.length}
        />

        {/* 4. Main Work Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {showAppViewDemo ? (
            /* Figure 5 & Figure 6 dedicated component style reference */
            <AppManageView showToast={showToast} />
          ) : (
            <>
              {/* Breadcrumbs & Time Bar */}
              <BreadcrumbBar
                currentKey={selectedSubMenu}
                onRefresh={() => showToast('已刷新当前模型配置数据')}
              />

              {/* View Router */}
              {selectedSubMenu === 'tcp_string' && (
                /* TCP字符串模型 (Default selected) */
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Tab Navigation: 模型管理 vs 模型配置 */}
                  <div className="h-11 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTcpStringTab('management')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded border transition-all ${
                          tcpStringTab === 'management'
                            ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                            : 'border-slate-300 text-slate-600 hover:text-slate-900 bg-white'
                        }`}
                      >
                        模型管理
                      </button>
                      <button
                        onClick={() => setTcpStringTab('config')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded border transition-all ${
                          tcpStringTab === 'config'
                            ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                            : 'border-slate-300 text-slate-600 hover:text-slate-900 bg-white'
                        }`}
                      >
                        模型配置
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  {tcpStringTab === 'management' ? (
                    /* Requirement 2: 模型管理页面展示列表如图2，图3，点击列表列展示对应的参数部分 */
                    <TcpStringModelManagement
                      models={tcpStringModels}
                      onUpdateModel={handleUpdateModel}
                      onDeleteModel={handleDeleteModel}
                      onResetData={handleResetData}
                      onClearData={handleClearData}
                      onGoToConfigTab={() => setTcpStringTab('config')}
                      onOpenBusinessFieldsModal={() => setIsBusinessFieldsModalOpen(true)}
                      showToast={showToast}
                    />
                  ) : (
                    /* Requirement 3: 模型配置页面展示图4内容 */
                    <TcpStringModelConfig
                      onSaveNewModel={handleSaveNewModel}
                      showToast={showToast}
                    />
                  )}
                </div>
              )}

              {selectedSubMenu === 'tcp_fixed' && (
                /* Newly added TCP定长模型 */
                <TcpFixedModelView
                  showToast={showToast}
                  onOpenBusinessFieldsModal={() => setIsBusinessFieldsModalOpen(true)}
                />
              )}

              {selectedSubMenu === 'http' && (
                /* HTTP模型 (Figure 1) */
                <HttpModelView
                  showToast={showToast}
                  onOpenBusinessFieldsModal={() => setIsBusinessFieldsModalOpen(true)}
                />
              )}

              {![
                'tcp_string',
                'tcp_fixed',
                'http',
              ].includes(selectedSubMenu) && (
                <GenericConfigPlaceholder
                  currentKey={selectedSubMenu}
                  onGoBackToTcpString={() => setSelectedSubMenu('tcp_string')}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Business Fields Dictionary Modal */}
      <BusinessFieldsModal
        isOpen={isBusinessFieldsModalOpen}
        onClose={() => setIsBusinessFieldsModalOpen(false)}
      />

      {/* Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
