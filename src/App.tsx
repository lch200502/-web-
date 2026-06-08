import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Patient, Prescription } from './types';
import { INITIAL_PATIENTS, INITIAL_PRESCRIPTIONS } from './mockData';

// Component imports
import Sidebar from './components/Sidebar';
import Workbench from './components/Workbench';
import Patients from './components/Patients';
import FollowUp from './components/FollowUp';
import Triage from './components/Triage';
import Consultation from './components/Consultation';
import Prescriptions from './components/Prescriptions';
import Statistics from './components/Statistics';
import Profile from './components/Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workbench');
  
  // Shared patient list state to enable real-time cross-tab updates!
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  
  // Shared prescriptions state to track Rx issued during Consultation or Patients tab
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);

  // Active online consult patient selector details
  const [selectedConsultPatientId, setSelectedConsultPatientId] = useState<string>('2026090501');

  // Badge calculators
  const pendingConsultationsCount = patients.filter(p => p.status === '待诊' || p.status === '接诊中').length;
  const pendingFollowupsCount = patients.filter(p => p.status === '回访中').length || 4; // Defaults/Fallback to 4

  const handleUpdatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddPrescription = (newRx: Prescription) => {
    setPrescriptions(prev => [newRx, ...prev]);
  };

  const handleAcceptPatientFromQueue = (patientId: string) => {
    // Update target patient status to '接诊中'
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: '接诊中' };
      }
      return p;
    }));
    setSelectedConsultPatientId(patientId);
    setActiveTab('consultation');
  };

  // Safe container animation configs
  const tabVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15 } }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* 1. Sidebar Nav */}
      <Sidebar 
         activeTab={activeTab} 
         setActiveTab={setActiveTab}
         pendingConsultations={pendingConsultationsCount}
         pendingFollowups={pendingFollowupsCount}
      />

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-blue-50 flex items-center justify-between px-8 shrink-0 shadow-sm z-10 font-sans">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-400">视角模式 &gt;</span>
            <span className="text-sm font-sans font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'workbench' && '数字化智能临床工作台'}
              {activeTab === 'patients' && '电子病历 (EMR) 归档档案'}
              {activeTab === 'followup' && '患者随访与功能康复指数'}
              {activeTab === 'triage' && '辅助分诊与临床阈值审核'}
              {activeTab === 'consultation' && '远程数字会话问诊交互'}
              {activeTab === 'prescriptions' && '数字安全CA下达处方库'}
              {activeTab === 'statistics' && '管理者效能及决策分析看板'}
              {activeTab === 'profile' && '执业医生个人中心'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-750 font-bold rounded-lg border border-blue-100 text-xs font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              全院专网授信正常
            </div>
            
            <div className="w-0.5 h-5 bg-slate-250" />
            
            <span className="text-xs font-sans font-bold text-slate-500 whitespace-nowrap">
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </span>
          </div>
        </header>

        {/* Outer scrolling slot with soft margins */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/60">
          <div className="max-w-7xl mx-auto w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full pb-10"
              >
                {activeTab === 'workbench' && (
                  <Workbench 
                    patients={patients}
                    setActiveTab={setActiveTab}
                    setSelectedPatientId={setSelectedConsultPatientId}
                    onAcceptPatient={handleAcceptPatientFromQueue}
                  />
                )}

                {activeTab === 'patients' && (
                  <Patients 
                    patients={patients}
                    onUpdatePatient={handleUpdatePatient}
                    onAddPrescription={handleAddPrescription}
                  />
                )}

                {activeTab === 'followup' && (
                  <FollowUp patients={patients} />
                )}

                {activeTab === 'triage' && (
                  <Triage />
                )}

                {activeTab === 'consultation' && (
                  <Consultation 
                    patients={patients}
                    selectedPatientId={selectedConsultPatientId}
                    setSelectedPatientId={setSelectedConsultPatientId}
                    onAddPrescription={handleAddPrescription}
                    onUpdatePatient={handleUpdatePatient}
                  />
                )}

                {activeTab === 'prescriptions' && (
                  <Prescriptions prescriptions={prescriptions} />
                )}

                {activeTab === 'statistics' && (
                  <Statistics />
                )}

                {activeTab === 'profile' && (
                  <Profile />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Status Bar with Geometric Balance design */}
        <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-8 text-slate-505 text-[10px] sm:text-[10px] uppercase tracking-wider shrink-0 z-10 font-sans">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-bold">HIS GATEWAY ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-bold">EMR CORE SYNCED</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-semibold">
            <span>SESSION: ACTIVE</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-blue-600 font-bold">NODE: CL-EAST-CN1</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
