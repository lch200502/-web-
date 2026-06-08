import React, { useState } from 'react';
import { 
  Users, 
  PhoneCall, 
  CheckCircle, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Clock, 
  UserPlus,
  Stethoscope,
  Info
} from 'lucide-react';
import { Patient, ActiveTab } from '../types';

interface WorkbenchProps {
  patients: Patient[];
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedPatientId: (id: string) => void;
  onAcceptPatient: (patientId: string) => void;
}

export default function Workbench({ 
  patients, 
  setActiveTab, 
  setSelectedPatientId,
  onAcceptPatient 
}: WorkbenchProps) {
  const [selectedQueuePatient, setSelectedQueuePatient] = useState<Patient | null>(patients[0] || null);

  // Filter queues
  const waitingPatients = patients.filter(p => p.status === '待诊' || p.status === '接诊中');
  
  const handleAccept = (pId: string) => {
    onAcceptPatient(pId);
  };

  const handleInspect = (p: Patient) => {
    setSelectedQueuePatient(p);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">您好，张伟明 主任医师</h2>
          <p className="text-sm text-slate-500 mt-1">
            截至今日 12:00，已接诊问诊并下达合理处方 <span className="font-mono font-bold text-blue-600">8</span> 例，待处理回访康复评估计 <span className="font-mono font-bold text-amber-600">4</span> 个。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-lg border border-blue-100 self-start md:self-auto font-bold shadow-xs">
          <Clock size={14} />
          <span>今日排班出诊中 (已执勤 4.5h)</span>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '待接诊问诊', total: '3', change: '+1 新接入', color: 'border-blue-100 bg-blue-50/30 text-blue-600', icon: Stethoscope, tab: 'consultation' as const },
          { label: '待处理回访', total: '4', change: '2条即将过期', color: 'border-amber-100 bg-amber-50/20 text-amber-600', icon: PhoneCall, tab: 'followup' as const },
          { label: '已完成问诊', total: '12', change: '今日累计', color: 'border-blue-100 bg-blue-50/20 text-blue-600', icon: CheckCircle, tab: 'patients' as const },
          { label: '已完成回访', total: '8', change: '较昨日 +3', color: 'border-emerald-100 bg-emerald-50/20 text-emerald-600', icon: CheckCircle, tab: 'followup' as const },
        ].map((stat, idx) => (
          <div 
            key={idx}
            onClick={() => setActiveTab(stat.tab)}
            className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-xs font-sans text-slate-500 font-bold block">{stat.label}</span>
                <span className="text-3xl font-mono font-bold text-slate-100 bg-slate-900 inline-block px-2.5 py-0.5 rounded-lg mr-2 leading-none">{stat.total}</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-sans text-slate-400 font-medium">{stat.change}</span>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Core Queue List & Processing Records */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="font-sans font-bold text-slate-800 text-base">待接诊问诊列表 ({waitingPatients.length})</h3>
            </div>
            <button 
              onClick={() => setActiveTab('consultation')}
              className="text-xs font-sans font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              进入问诊大厅 <ChevronRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-slate-150 max-h-[460px] overflow-y-auto">
            {waitingPatients.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleInspect(p)}
                className={`p-5 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  selectedQueuePatient?.id === p.id ? 'bg-blue-50/30 border-l-4 border-blue-600 pl-4' : 'hover:bg-slate-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-full ${p.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-slate-900">{p.name}</span>
                      <span className="text-xs text-slate-400">{p.gender} / {p.age}岁</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                        p.status === '接诊中' ? 'bg-blue-50 text-blue-750 border border-blue-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm font-sans text-slate-605 mt-1 line-clamp-1 font-medium">
                      主诉：{p.chiefComplaint}
                    </p>
                    {p.allergy && (
                      <span className="inline-block mt-1 bg-red-50 text-red-600 text-[11px] font-bold font-sans px-2 py-0.5 rounded border border-red-100">
                        {p.allergy}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(p.id);
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white font-sans font-bold text-xs rounded-lg hover:bg-blue-500 active:bg-blue-700 shadow-sm transition-all flex items-center gap-1 cursor-pointer border-0"
                  >
                    <UserPlus size={12} />
                    接诊
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInspect(p);
                    }}
                    className="px-3 py-1.5 border border-slate-205 bg-white text-slate-655 font-sans font-bold text-xs rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    查看
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Recently processed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-sans font-bold text-slate-800 text-base">最近处理记录 (今日已接诊)</h3>
          </div>
          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-200">
                  <th className="p-4">患者名</th>
                  <th className="p-4">性别/年龄</th>
                  <th className="p-4">诊断结果</th>
                  <th className="p-4">处方状态</th>
                  <th className="p-4">处理时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: '赵六', age: '58', gender: '女', diagnosis: '2型糖尿病伴周围神经病变', status: '已发药', time: '10:45' },
                  { name: '陈晓明', age: '45', gender: '男', diagnosis: '急性急性阑尾炎术后', status: '已下达', time: '09:20' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{row.name}</td>
                    <td className="p-4 text-slate-500 font-semibold">{row.gender} / {row.age}岁</td>
                    <td className="p-4 text-slate-600 font-medium">{row.diagnosis}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-750 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg select-none">
                        <CheckCircle size={10} />
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 font-medium">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
