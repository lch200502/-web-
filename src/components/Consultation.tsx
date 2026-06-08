import React, { useState } from 'react';
import { 
  Stethoscope, 
  Send, 
  Paperclip, 
  ListTodo, 
  Sparkles, 
  Heart, 
  Minus, 
  Plus,
  HelpCircle,
  FileCheck,
  Building,
  CheckCircle,
  AlertTriangle,
  History,
  TrendingUp,
  Settings,
  Info
} from 'lucide-react';
import { Patient, Prescription, Message } from '../types';
import { DRUG_DIRECTORY } from '../mockData';

interface ConsultationProps {
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  onAddPrescription: (newRx: Prescription) => void;
  onUpdatePatient: (updated: Patient) => void;
}

export default function Consultation({
  patients,
  selectedPatientId,
  setSelectedPatientId,
  onAddPrescription,
  onUpdatePatient
}: ConsultationProps) {
  // Ensure we have an active patient
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  
  // Custom toast notification state to replace window.alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Quick replies
  const quickReplies = [
    '请问现在感到胸口疼痛有向后脚或背部放射的感觉吗？',
    '规律服药期间有每天早上测静息血压吗？',
    '是否伴生恶心、想吐或者胃反酸？',
    '请保持休息，不要熬夜，这两天清淡饮食为主。'
  ];

  // Chat message stack state
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'patient', content: '医生您好，最近两星期上腹部总是反反复复疼，特别是空腹和夜间的时候，还会反酸，特别难受。', timestamp: '10:00' },
    { id: 'm2', sender: 'doctor', content: '您好，上腹痛具体是在什么位置？是隐痛还是胀痛？吃东西后有没有缓解的迹象？', timestamp: '10:02' },
    { id: 'm3', sender: 'patient', content: '就在肚脐眼上方偏左一点。稍微吃点苏打饼干好像就能缓解点，但是过一两个小时又开始痛。最近感觉反酸水很厉害，嘴里常有酸味。', timestamp: '10:04' },
  ]);
  const [chatInputValue, setChatInputValue] = useState('');

  // Checklist tasks
  const [tasks, setTasks] = useState([
    { id: 't1', text: '询问发病诱因及上腹痛具体部位', checked: true },
    { id: 't2', text: '确认空腹及餐后疼痛缓解规律', checked: true },
    { id: 't3', text: '排查是否存在柏油样便等黑软便危机', checked: false },
    { id: 't4', text: '确立Hp幽门螺杆菌感染排查与处方意见', checked: false }
  ]);

  // Active electronic Rx draft drawer trigger
  const [showQuickRx, setShowQuickRx] = useState(false);
  const [draftRxDrugs, setDraftRxDrugs] = useState<typeof DRUG_DIRECTORY>([]);
  const [rxDiagnosis, setRxDiagnosis] = useState('慢性糜烂性胃窦炎 (HP待排)');
  const [isRxSubmitted, setIsRxSubmitted] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleSendMessage = () => {
    if (!chatInputValue.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: 'doctor',
      content: chatInputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setChatInputValue('');

    // Trigger AI assistance reply suggestion after 1s
    setTimeout(() => {
      const aiReply: Message = {
        id: `m_ai_${Date.now()}`,
        sender: 'ai',
        content: '🤖 【AI 临床协作助手建议】：针对患者刚反馈的伴随反酸症状，因胃内高酸环境对胃黏膜持续腐蚀。建议餐前给予第二代质子泵抑制剂奥美拉唑（艾司奥美拉唑20mg gd）及胃动力联合治疗。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiSuggested: true
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1200);
  };

  const handleQuickAddFeedback = (text: string) => {
    setChatInputValue(text);
  };

  const handleAddDrugToQuickRx = (drug: typeof DRUG_DIRECTORY[0]) => {
    if (draftRxDrugs.some(d => d.id === drug.id)) return;
    setDraftRxDrugs([...draftRxDrugs, { ...drug }]);
  };

  const handleRemoveDrugFromQuickRx = (drugId: string) => {
    setDraftRxDrugs(draftRxDrugs.filter(d => d.id !== drugId));
  };

  const handleSaveQuickPrescription = () => {
    if (!patient) return;
    const newRx: Prescription = {
      id: `RX${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
      diagnosis: rxDiagnosis,
      drugs: [...draftRxDrugs],
      date: new Date().toISOString().split('T')[0],
      status: '已下达',
      signature: '张伟明'
    };
    onAddPrescription(newRx);

    // Update patient status to 已结案
    const updated: Patient = {
      ...patient,
      diagnosis: rxDiagnosis,
      status: '已结案'
    };
    onUpdatePatient(updated);

    setIsRxSubmitted(true);
    setTimeout(() => {
      setIsRxSubmitted(false);
      setShowQuickRx(false);
      setDraftRxDrugs([]);
      // Auto post to chat
      setMessages(prev => [
        ...prev,
        {
          id: `m_rx_${Date.now()}`,
          sender: 'doctor',
          content: `📋 床旁电子处方已开立！诊断结果：【${rxDiagnosis}】，开具药品：${newRx.drugs.map(d => `${d.name} (${d.count}盒)`).join(', ')}。请点击药单查看核对自取。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      showToast('电子处方已保存，系统已同步更新患者档案状态为已结案。');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-blue-600 text-white shadow-lg border border-blue-550 font-sans font-bold text-xs px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-slide-in">
          <Info size={14} className="text-blue-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Selector banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-1000 tracking-tight flex items-center gap-2">
            <Stethoscope size={20} className="text-blue-600" />
            在线门诊专家问诊室
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            实时文字音视频线上诊查，结合患者病历摘要历史行高精诊治决策
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-sans">
          <span className="text-slate-400 font-bold font-mono uppercase tracking-wider">患者切换:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setDraftRxDrugs([]);
              setShowQuickRx(false);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.gender} / 年龄 {p.age}岁)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Patient health resume profile (Span 1) */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className={`w-10 h-10 rounded-full ${patient.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                {patient.name.charAt(0)}
              </div>
              <div className="space-y-0.5 font-sans">
                <span className="font-bold text-slate-900 block text-base leading-none">{patient.name}</span>
                <span className="text-[11px] text-slate-450 font-bold block mt-1">{patient.gender} • {patient.age}岁 • {patient.bloodType}型</span>
              </div>
            </div>

            <div className="text-xs font-sans space-y-3.5">
              <div className="space-y-1">
                <span className="text-slate-400 block font-bold">就诊主要主诉</span>
                <p className="bg-slate-50 p-2.5 border border-slate-200 rounded-lg text-slate-700 min-h-12 leading-normal font-sans">
                  {patient.chiefComplaint}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block font-bold">既往高危合并症</span>
                <p className="bg-slate-50 p-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium leading-normal font-sans">
                  {patient.medicalHistory}
                </p>
              </div>

              {patient.allergy && (
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-100 font-bold flex items-center gap-1.5 shadow-xs">
                  <AlertTriangle size={12} />
                  <span>【过敏原】：{patient.allergy}</span>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase font-sans tracking-wide">常用快捷指引 (点击呼入输入框)</span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {quickReplies.map((reply, i) => (
                  <button 
                    key={i}
                    onClick={() => handleQuickAddFeedback(reply)}
                    className="w-full text-left p-2 border border-slate-150 hover:border-blue-300 hover:bg-blue-50/20 text-[11px] text-slate-600 rounded-lg transition-all font-sans truncate cursor-pointer block font-medium"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Rx Actions and Consultation conclusion */}
            <div className="space-y-2 pt-4">
              <button 
                onClick={() => setShowQuickRx(true)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-600 text-white font-sans font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <FileCheck size={14} />
                开具临床电子处方
              </button>
              <button 
                onClick={() => {
                  const updated: Patient = { ...patient, status: '已结案' };
                  onUpdatePatient(updated);
                  showToast('问诊已结案结单！患者健康随访追踪同步归档。');
                }}
                className="w-full py-2 border border-slate-250 bg-white text-slate-650 font-sans font-bold text-xs rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
              >
                完结归档本次门诊
              </button>
            </div>
          </div>
        </div>

        {/* Middle Area: Telehealth Chat conversation thread (Span 2) */}
        <div className="lg:col-span-2 h-[560px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden relative">
          
          {/* Quick Rx Modal drawer overlay inside middle container */}
          {showQuickRx && (
            <div className="absolute inset-0 bg-slate-950/45 z-30 flex justify-end">
              <div className="w-5/6 md:w-2/3 h-full bg-white shadow-2xl p-6 flex flex-col justify-between border-l border-slate-250 animate-slide-in">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Building size={16} className="text-blue-600" />
                      快捷开立电子药单 (RP)
                    </h3>
                    <button 
                      onClick={() => setShowQuickRx(false)} 
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      ✕ 取消
                    </button>
                  </div>

                  {isRxSubmitted ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-blue-750 font-sans text-xs">
                      <CheckCircle size={36} className="text-blue-600 animate-bounce" />
                      <strong className="text-sm font-bold text-blue-900">处方电子签章核准成功！</strong>
                      <span>系统已完成电子签章并直接回写入库。</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Diagnosis */}
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-slate-600 block">门诊合并临床诊断</label>
                        <input 
                          type="text"
                          value={rxDiagnosis}
                          onChange={(e) => setRxDiagnosis(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      {/* Selected list drugs */}
                      {draftRxDrugs.length > 0 ? (
                        <div className="divide-y divide-slate-100 bg-slate-50 p-2.5 border border-slate-200 rounded-lg max-h-[160px] overflow-y-auto">
                          {draftRxDrugs.map(dr => (
                            <div key={dr.id} className="py-2 flex items-center justify-between text-xs">
                              <div className="min-w-0 pr-2">
                                <span className="font-bold block text-slate-800 truncate">{dr.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium block">{dr.spec} | {dr.route}</span>
                              </div>
                              <button 
                                onClick={() => handleRemoveDrugFromQuickRx(dr.id)}
                                className="text-rose-500 text-xs font-bold hover:underline cursor-pointer"
                              >
                                移除
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-sans text-xs">
                          暂无配药。请在下方名录点选。
                        </div>
                      )}

                      {/* Select fast pills */}
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase tracking-wide">极高频推荐药房配药清单</span>
                        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
                          {DRUG_DIRECTORY.map(drug => (
                            <button
                              key={drug.id}
                              onClick={() => handleAddDrugToQuickRx(drug)}
                              className="text-left p-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-lg text-[10px] font-sans cursor-pointer transition-colors block"
                            >
                              <span className="font-bold block text-slate-700 truncate">{drug.name}</span>
                              <span className="text-slate-400 text-[9px] block">规格: {drug.spec}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!isRxSubmitted && (
                  <button 
                    onClick={handleSaveQuickPrescription}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs rounded-lg text-center cursor-pointer transition-colors"
                    disabled={draftRxDrugs.length === 0}
                  >
                    电子印制签章核发
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages block header */}
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm font-sans font-bold text-slate-800">在线实时就诊指导通道 (WebRTC Linked)</span>
            </div>
            <span className="text-xs font-mono text-slate-400">已保持在线 14分45秒</span>
          </div>

          {/* Conversation chat scroll panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[400px]">
            {messages.map((m) => {
              if (m.sender === 'ai') {
                return (
                  <div key={m.id} className="p-4 bg-blue-50/50 text-slate-800 border border-blue-150 rounded-lg space-y-2 font-medium shadow-xs text-xs font-sans animate-fade-in shadow-md">
                    <div className="flex items-center gap-1.5 text-blue-300 pb-1 border-b border-slate-800">
                      <Sparkles size={14} className="animate-spin-slow text-blue-300" />
                      <strong className="font-bold italic">AI 临床决策同步协防安全系统指示</strong>
                    </div>
                    <p className="leading-relaxed font-sans font-light text-slate-350">{m.content}</p>
                  </div>
                );
              }

              const isMe = m.sender === 'doctor';
              return (
                <div key={m.id} className={`flex gap-3 text-xs md:text-sm font-sans ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className={`w-8 h-8 rounded-full ${patient.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                      {patient.name.charAt(0)}
                    </div>
                  )}
                  <div className={`shadow-xs rounded-lg p-3 max-w-[85%] leading-relaxed ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none hover:bg-blue-700' 
                      : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    <span className="text-[10px] opacity-40 font-mono block mb-1">{m.timestamp}</span>
                    <span className="font-sans text-xs">{m.content}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Chat Inputs bar */}
          <div className="p-4 border-t border-slate-200 flex gap-2 bg-slate-50">
            <button className="p-2.5 border border-slate-250 bg-white text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer shadow-xs" title="插入附件">
              <Paperclip size={16} />
            </button>
            <input 
              type="text"
              value={chatInputValue}
              onChange={(e) => setChatInputValue(e.target.value)}
              placeholder="输入问诊回复或配药建议，如多潘立酮。按回车健发送..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-xs font-sans px-3.5 py-2.5 bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button 
              type="button"
              onClick={handleSendMessage}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white font-sans font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
            >
              发送指导
            </button>
          </div>
        </div>

        {/* Right Panel: Doctor checklists & weekly trends (Span 1) */}
        <div className="space-y-6 animate-fade-in">
          {/* Question Task Checklist */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3">
              <ListTodo size={18} className="text-blue-600" />
              <h3 className="font-sans font-bold text-slate-800 text-sm">门诊问诊必问要素</h3>
            </div>

            <div className="space-y-3">
              {tasks.map(tsk => (
                <label 
                  key={tsk.id}
                  className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer font-sans leading-relaxed font-semibold"
                >
                  <input 
                    type="checkbox"
                    checked={tsk.checked}
                    onChange={() => toggleTask(tsk.id)}
                    className="mt-0.5 rounded border-slate-350 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className={tsk.checked ? 'line-through text-slate-400 font-bold' : 'font-bold'}>
                    {tsk.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Weekly indicator diagram trend */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3">
              <TrendingUp size={18} className="text-blue-600" />
              <h3 className="font-sans font-bold text-slate-800 text-sm font-sans">今日关联生理体征历史趋势</h3>
            </div>

            <div className="h-32 bg-slate-50 rounded-lg p-3 flex flex-col justify-between border border-slate-100">
              <div className="flex justify-between items-end h-20">
                {[
                  { k: '11-15', v: 138 },
                  { k: '12-20', v: 142 },
                  { k: '02-10', v: 135 },
                  { k: '今日', v: 148 }
                ].map((pt, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full font-mono text-[9px]">
                    <span className="font-bold text-slate-600">{pt.v}</span>
                    <div className={`w-4 rounded-t-sm transition-all duration-300 ${i === 3 ? 'bg-blue-600' : 'bg-blue-200'}`} style={{ height: `${(pt.v/200)*100}%` }} />
                    <span className="text-[8px] font-sans text-slate-400 font-bold">{pt.k}</span>
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-sans text-slate-450 block text-center mt-1 font-bold">空腹收缩压历史波段测量值</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
