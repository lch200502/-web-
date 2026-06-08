import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  FileText, 
  Stethoscope, 
  FileCheck2, 
  BarChart3, 
  UserRound,
  HeartPulse
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingConsultations: number;
  pendingFollowups: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  pendingConsultations, 
  pendingFollowups 
}: SidebarProps) {
  const menuItems = [
    { id: 'workbench', label: '工作台首页', icon: LayoutDashboard, badge: 0 },
    { id: 'patients', label: '患者管理', icon: Users, badge: 0 },
    { id: 'followup', label: '回访管理', icon: CalendarClock, badge: pendingFollowups },
    { id: 'triage', label: '导诊审核', icon: FileCheck2, badge: 0 },
    { id: 'consultation', label: '在线问诊', icon: Stethoscope, badge: pendingConsultations },
    { id: 'prescriptions', label: '处方管理', icon: FileText, badge: 0 },
    { id: 'statistics', label: '数据统计', icon: BarChart3, badge: 0 },
    { id: 'profile', label: '个人中心', icon: UserRound, badge: 0 },
  ] as const;

  return (
    <aside id="sidebar-nav" className="w-64 bg-white text-slate-705 flex flex-col h-full border-r border-slate-100">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center rotate-45 shrink-0 shadow-md shadow-blue-500/20">
          <div className="w-4 h-4 border-2 border-white"></div>
        </div>
        <div className="pl-1.5">
          <h1 className="font-display font-bold text-base tracking-wider text-slate-900">CLINICAL.UI</h1>
          <span className="text-[10px] font-sans text-blue-600 tracking-wider block uppercase font-bold">精密诊疗管理</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-all cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15 font-semibold' 
                  : 'text-slate-600 hover:bg-blue-50/70 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-mono rounded-full ${
                  isActive ? 'bg-white text-blue-600 font-bold' : 'bg-red-50 text-red-500 font-bold'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-blue-50/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-250 overflow-hidden flex items-center justify-center text-blue-600 font-bold bg-gradient-to-tr from-blue-100 to-blue-50">
            张
          </div>
          <div>
            <div className="text-sm font-sans font-bold text-slate-805">张伟明</div>
            <div className="text-xs font-sans text-slate-400">主任医师 • 消化内科</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
