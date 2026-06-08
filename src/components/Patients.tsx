import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  ChevronRight, 
  FileText, 
  Edit, 
  Clock, 
  ArrowLeft,
  CalendarCheck,
  Building,
  AlertTriangle,
  FileCheck,
  Stethoscope,
  Send,
  Plus,
  Trash2,
  ListCheck
} from 'lucide-react';
import { Patient, DrugItem, Prescription } from '../types';
import { DRUG_DIRECTORY } from '../mockData';

interface PatientsProps {
  patients: Patient[];
  onUpdatePatient: (updated: Patient) => void;
  onAddPrescription: (newRx: Prescription) => void;
}

export default function Patients({ 
  patients, 
  onUpdatePatient,
  onAddPrescription 
}: PatientsProps) {
  // Screen views: 'list' | 'view_ehr' | 'edit_ehr'
  const [viewState, setViewState] = useState<'list' | 'view_ehr' | 'edit_ehr'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Search/Filter states
  const [searchName, setSearchName] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // EHR edit variables
  const [editChiefComplaint, setEditChiefComplaint] = useState('');
  const [editMedicalHistory, setEditMedicalHistory] = useState('');
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editPastHistory, setEditPastHistory] = useState('');
  
  // Rx state inside path editor
  const [draftDrugs, setDraftDrugs] = useState<DrugItem[]>([]);
  const [searchDrugQuery, setSearchDrugQuery] = useState('');

  const handleSearchReset = () => {
    setSearchName('');
    setFilterDept('all');
    setFilterStatus('all');
  };

  const handleOpenEhr = (p: Patient) => {
    setSelectedPatient(p);
    setViewState('view_ehr');
  };

  const handleEditEhr = (p: Patient) => {
    setSelectedPatient(p);
    setEditChiefComplaint(p.chiefComplaint);
    setEditMedicalHistory(p.medicalHistory);
    setEditDiagnosis(p.diagnosis || '');
    setEditPastHistory(p.pastHistory);
    setDraftDrugs([]);
    setViewState('edit_ehr');
  };

  const handleSaveEhr = () => {
    if (!selectedPatient) return;
    const updated: Patient = {
      ...selectedPatient,
      chiefComplaint: editChiefComplaint,
      medicalHistory: editMedicalHistory,
      diagnosis: editDiagnosis,
      pastHistory: editPastHistory,
      status: '已结案'
    };
    onUpdatePatient(updated);

    // If there are prescription drugs in the editor, let's also generate a prescription!
    if (draftDrugs.length > 0) {
      const newRx: Prescription = {
        id: `RX${Date.now()}`,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        diagnosis: editDiagnosis || '慢性病复诊健康评估',
        drugs: [...draftDrugs],
        date: new Date().toISOString().split('T')[0],
        status: '已下达',
        signature: '张伟明'
      };
      onAddPrescription(newRx);
    }

    setSelectedPatient(updated);
    setViewState('view_ehr');
  };

  const handleAddDrug = (drug: DrugItem) => {
    if (draftDrugs.some(d => d.id === drug.id)) return;
    setDraftDrugs([...draftDrugs, { ...drug }]);
  };

  const handleRemoveDrug = (drugId: string) => {
    setDraftDrugs(draftDrugs.filter(d => d.id !== drugId));
  };

  const handleUpdateDrugCount = (drugId: string, delta: number) => {
    setDraftDrugs(draftDrugs.map(d => {
      if (d.id === drugId) {
        return { ...d, count: Math.max(1, d.count + delta) };
      }
      return d;
    }));
  };

  // Filter computation
  const filteredPatients = patients.filter(p => {
    const matchesName = p.name.includes(searchName) || p.phone.includes(searchName) || p.id.includes(searchName);
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    
    // Custom department matching
    let matchesDept = true;
    if (filterDept !== 'all') {
      if (filterDept === '消化内科') matchesDept = p.chiefComplaint.includes('腹') || p.chiefComplaint.includes('胃') || p.diagnosis?.includes('胃');
      else if (filterDept === '神经内科') matchesDept = p.chiefComplaint.includes('眩晕') || p.chiefComplaint.includes('晕') || p.diagnosis?.includes('眩晕');
      else if (filterDept === '泌尿外科') matchesDept = p.chiefComplaint.includes('战') || p.chiefComplaint.includes('痛');
    }
    return matchesName && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* 1. LIST VIEW */}
      {viewState === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top filter bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-sm">检索过滤条件</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索真实姓名 / 手机 / ID" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full text-xs font-sans pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>

              <div>
                <select 
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full text-xs font-sans px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-700 font-bold"
                >
                  <option value="all">全部挂号科室</option>
                  <option value="消化内科">消化内科</option>
                  <option value="神经内科">神经内科</option>
                  <option value="泌尿外科">普通外科</option>
                </select>
              </div>

              <div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full text-xs font-sans px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-700 font-bold"
                >
                  <option value="all">全部接诊状态</option>
                  <option value="待诊">待诊</option>
                  <option value="接诊中">接诊中</option>
                  <option value="回访中">回访中</option>
                  <option value="已结案">已结案</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {}} 
                  className="flex-1 bg-blue-600 hover:bg-blue-600 text-white font-sans font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-600/10"
                >
                  <Search size={14} />
                  检索记录
                </button>
                <button 
                  onClick={handleSearchReset}
                  className="p-2.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 rounded-lg transition-all cursor-pointer"
                  title="重置"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-sans font-bold text-slate-800 text-base">临床患者库 ({filteredPatients.length})</h3>
              <span className="text-xs font-mono text-slate-400">检索同步于今日 12:00</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-100/50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-4 pl-6">ID / 患者名</th>
                    <th className="p-4">性别 / 年龄</th>
                    <th className="p-4">联系电话</th>
                    <th className="p-4">最新主要诊断</th>
                    <th className="p-4">更新日期</th>
                    <th className="p-4">接诊状态</th>
                    <th className="p-4 text-right pr-6">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${p.avatarColor} text-white font-black flex items-center justify-center text-xs shadow-sm`}>
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{p.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 block font-medium">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-700 font-semibold">{p.gender} • {p.age}岁</td>
                        <td className="p-4 font-mono text-slate-600 font-bold">{p.phone}</td>
                        <td className="p-4 text-slate-800 font-bold">
                          {p.diagnosis || <span className="text-slate-400 italic">暂无正式诊断</span>}
                        </td>
                        <td className="p-4 font-mono text-slate-500">{p.lastVisit}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-lg border ${
                            p.status === '待诊' ? 'bg-slate-50 border-slate-200 text-slate-600' :
                            p.status === '接诊中' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            p.status === '已结案' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              p.status === '待诊' ? 'bg-slate-400' :
                              p.status === '接诊中' ? 'bg-amber-500' :
                              p.status === '已结案' ? 'bg-blue-600' :
                              'bg-blue-500'
                            }`} />
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEhr(p)}
                              className="px-3 py-1.5 border border-slate-205 text-slate-650 font-sans font-bold text-[11.5px] rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <FileText size={12} />
                              查看病历
                            </button>
                            <button 
                              onClick={() => handleEditEhr(p)}
                              className="px-3 py-1.5 bg-slate-50 border border-slate-205 hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600 font-bold text-[11.5px] text-slate-650 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Edit size={12} />
                              处置/开处方
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-450 font-bold">
                        当前库中未检索到符合条件的临床记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. EHR DETAILED VIEW */}
      {viewState === 'view_ehr' && selectedPatient && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setViewState('list')}
              className="px-4 py-2 bg-white border border-slate-250 hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              返回患者总览列表
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditEhr(selectedPatient)}
                className="px-4 py-2 bg-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Edit size={13} />
                处置本案病历
              </button>
            </div>
          </div>

          {/* Demographic card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full ${selectedPatient.avatarColor} text-white font-black flex items-center justify-center text-xl shadow-inner`}>
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-display font-bold text-slate-900 leading-none">{selectedPatient.name}</h2>
                  <span className="text-sm text-slate-400 font-medium">|</span>
                  <span className="text-xs font-sans text-slate-655 font-bold">{selectedPatient.gender} • {selectedPatient.age} 岁</span>
                  <span className="text-xs text-slate-400 font-mono">（档案编号ID: {selectedPatient.id}）</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] pt-1.5">
                  <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 rounded font-mono text-slate-600 font-bold">
                    血型: {selectedPatient.bloodType} 型
                  </span>
                  <span className="px-2.5 py-0.5 bg-red-50 border border-red-100 text-red-650 rounded font-bold">
                    敏感史: {selectedPatient.allergy || '无已知药物过敏'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500 space-y-1 flex-col">
              <div><span className="font-bold text-slate-400">挂号就诊流水号:</span> <span className="font-mono text-slate-800 font-bold">REG-2026-905-01</span></div>
              <div><span className="font-bold text-slate-400">门诊责任科室:</span> <span className="text-slate-800 font-bold">消化内科二病区</span></div>
              <div><span className="font-bold text-slate-400">主治专家医师:</span> <span className="text-slate-800 font-bold">张伟明 主任医师</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline details */}
            <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                就诊历史时间轴
              </h3>
              
              <div className="relative border-l-2 border-slate-150 pl-4 space-y-6 ml-3 pt-2">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 bg-blue-600 ring-4 ring-blue-50" />
                  <span className="text-[10px] font-mono font-bold text-blue-600 block">2026-06-08 (今日就诊)</span>
                  <span className="text-sm font-sans font-bold text-slate-800 mt-1 block">常规复诊极病情多维干预</span>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans leading-relaxed">主诉上腹痛明显加重两日，进行全面临床处方开立并下达。</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-250 ring-4 ring-slate-50" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">2026-02-15</span>
                  <span className="text-sm font-sans font-bold text-slate-700 mt-1 block">内科高危筛查诊断</span>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans leading-relaxed">高血压常规慢病管理筛测评估，维持稳定诊室降压治疗方案。</p>
                </div>

                <div className="relative border-none pr-2">
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-250 ring-4 ring-slate-50" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">2025-11-10</span>
                  <span className="text-sm font-sans font-bold text-slate-700 mt-1 block">急诊医学临床分步筛查</span>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans leading-relaxed">因上腹部刀割疼痛进行急诊，Hp初次判定鉴别。</p>
                </div>
              </div>
            </div>

            {/* Selected case detail (Bento Cards) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Core Case Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex border-b border-slate-200 pb-3 justify-between items-center">
                  <h3 className="font-sans font-bold text-slate-800 text-base">临床电子病历详情 (2026-06-08 本案)</h3>
                  <span className="text-xs font-mono text-slate-450 font-bold">病历流水号: EHR-002495-2026</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-405 text-slate-500 block uppercase">就诊主诉</span>
                    <p className="text-xs font-sans text-slate-800 font-bold leading-relaxed mt-1">
                      {selectedPatient.chiefComplaint}
                    </p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-405 text-slate-500 block uppercase">临床诊断结论</span>
                    <p className="text-xs font-sans text-blue-750 font-bold leading-relaxed mt-1 flex items-center gap-1.5">
                      <FileCheck size={14} className="text-blue-600" />
                      {selectedPatient.diagnosis || '诊断暂无，待补充'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-450 font-sans block">现病史及病史描述</span>
                  <p className="text-xs font-sans text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-150 font-medium">
                    {selectedPatient.medicalHistory || '患者暂无录入现病史。'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-455 font-sans block">既往病史及风险合并症</span>
                  <p className="text-xs font-sans text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-150 font-medium font-sans">
                    {selectedPatient.pastHistory || '既往身体健康，无手术，无肝肾病变记录。'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-455 font-sans block">客观体格检查记录</span>
                  <p className="text-xs font-sans text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-150 font-medium font-sans">
                    {selectedPatient.symptoms || '腹部软，未见胃肠型及蠕动皮外。上腹及脐周中轻度压痛，无明显肌紧张。'}
                  </p>
                </div>

                {/* Patient files mock */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block">已关联化学/放射报告扫描 (2)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50/30 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-sans font-bold text-slate-800 block truncate">幽门螺杆菌胃镜检查分析报告.pdf</span>
                        <span className="text-[9.5px] font-mono text-slate-400 block mt-0.5">2026-06-08 10:15 • 3.2MB</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50/30 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-sans font-bold text-slate-800 block truncate">生化常规：血常规与肝功全套.pdf</span>
                        <span className="text-[9.5px] font-mono text-slate-400 block mt-0.5">2026-06-08 09:30 • 1.5MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI helper box */}
              <div className="bg-blue-50/40 text-slate-850 rounded-xl border border-blue-150 shadow-sm p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                <h4 className="font-sans font-bold text-blue-800 text-sm flex items-center gap-1.5 font-display">
                  <Stethoscope size={16} />
                  AI 临床决策同步协防安全评估报告
                </h4>
                <div className="text-xs font-sans text-slate-600 leading-relaxed font-semibold space-y-2">
                  <p>● 基于该患者 【奥美拉唑】 和 【吗丁啉】 药物联合处方，未检索到药物配伍红线。多潘立酮与胃粘膜保护剂联合，通常疗效叠加，控制慢性糜烂性胃窦疼痛。对高血压合并状态具有全链安全性。</p>
                  <p>● 【过敏红线审计】：患者声明具有【青霉素过敏史】。当前开具的所有非阿莫西林胃三联药物、胃四联药物处于安全绿色区域，已核准规避配方。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDIT EHR & MEDICINE RX FORM */}
      {viewState === 'edit_ehr' && selectedPatient && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setViewState('view_ehr')}
              className="px-4 py-2 bg-white border border-slate-250 hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              取消变更并退出
            </button>
            <h2 className="text-base font-sans font-bold text-slate-900">数字化处方与病历草签编辑器</h2>
            <button 
              onClick={handleSaveEhr}
              className="px-6 py-2.5 bg-blue-600 bg-blue-600 hover:bg-blue-500 font-sans font-bold text-xs text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck size={14} />
              提交本案并电子签名下达
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-205 text-amber-900 p-4 rounded-lg text-xs flex items-start gap-2.5 shadow-xs">
            <AlertTriangle size={16} className="text-amber-650 shrink-0 mt-0.5 animate-pulse" />
            <div className="font-sans font-semibold">
              <span className="font-bold">医师辅助审阅敏感情报红线警示：</span>
              该患者具有明确的 <strong>【{selectedPatient.allergy}】</strong>，请严格核对处方是否因人工疏漏而录入了不合规的抗生素（如阿莫西林等青霉素衍生物）。如有红线不匹配，电子药单终审将拒绝审核通过。
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Modify EHR Profile fields */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center gap-1.5 font-display">
                <FileText size={18} className="text-blue-600" />
                临床诊断与病历主干修改
              </h3>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-705 text-slate-600 block">主诉病情汇总描述</label>
                  <textarea 
                    rows={2}
                    value={editChiefComplaint}
                    onChange={(e) => setEditChiefComplaint(e.target.value)}
                    className="w-full text-xs font-sans px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 leading-relaxed font-semibold focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-705 text-slate-600 block">现病史详情 & 辅助排查建议</label>
                  <textarea 
                    rows={4}
                    value={editMedicalHistory}
                    onChange={(e) => setEditMedicalHistory(e.target.value)}
                    className="w-full text-xs font-sans px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 leading-relaxed font-semibold focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-750 text-slate-700 block">正式临床决策诊断 (极精准联想推荐词)</label>
                  <input 
                    type="text"
                    value={editDiagnosis}
                    onChange={(e) => setEditDiagnosis(e.target.value)}
                    placeholder="请输入最终诊断词意，如：慢性萎缩性胃炎伴中度肠化..."
                    className="w-full text-xs font-sans px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 font-bold focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-705 text-slate-600 block">其他既往合并症风险评估</label>
                  <textarea 
                    rows={2}
                    value={editPastHistory}
                    onChange={(e) => setEditPastHistory(e.target.value)}
                    className="w-full text-xs font-sans px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 leading-relaxed font-semibold focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Right Card: Prescription pharmaceuticals configuration */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center justify-between font-display">
                  <span className="flex items-center gap-1.5">
                    <Building size={18} className="text-blue-600 text-blue-600" />
                    本案新开处方 (RP)
                  </span>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-750 px-2.5 py-0.5 rounded border border-blue-100 font-bold">
                    已选配药: {draftDrugs.length} 种
                  </span>
                </h3>

                {/* Selected drugs tables */}
                {draftDrugs.length > 0 ? (
                  <div className="divide-y divide-slate-100 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {draftDrugs.map((d) => (
                      <div key={d.id} className="py-2.5 flex items-center justify-between gap-3 text-xs font-sans">
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <span className="font-bold text-slate-800 block truncate">{d.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5 font-medium">{d.spec} | {d.dosage} • {d.route} | {d.frequency}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden font-mono text-xs">
                            <button 
                              onClick={() => handleUpdateDrugCount(d.id, -1)}
                              className="px-2 py-1 text-slate-400 hover:text-slate-600 transition-colors font-bold"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 text-slate-805 text-slate-700 font-bold bg-slate-50 border-x border-slate-200">
                              {d.count} 盒
                            </span>
                            <button 
                              onClick={() => handleUpdateDrugCount(d.id, 1)}
                              className="px-2 py-1 text-slate-400 hover:text-slate-600 transition-colors font-bold"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => handleRemoveDrug(d.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center text-center justify-center text-slate-450 font-sans">
                    <ListCheck size={28} className="text-slate-350 mb-2" />
                    <span className="text-xs font-bold leading-normal">暂无开具处方。请从下方西药房库中检索并点选添加。</span>
                  </div>
                )}

                {/* Medication Library search and select list */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="检索医院西药房及中成药目录库..."
                      value={searchDrugQuery}
                      onChange={(e) => setSearchDrugQuery(e.target.value)}
                      className="w-full text-xs font-sans pl-8 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-slate-750 font-bold"
                    />
                  </div>

                  <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-100 bg-slate-50 border border-slate-205 rounded-lg">
                    {DRUG_DIRECTORY.filter(d => d.name.includes(searchDrugQuery)).map((drug) => {
                      const alreadyAdded = draftDrugs.some(draft => draft.id === drug.id);
                      return (
                        <div key={drug.id} className="p-2.5 flex items-center justify-between text-xs font-sans hover:bg-white transition-colors">
                          <div>
                            <span className="font-bold text-slate-800">{drug.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{drug.spec} • {drug.route} • {drug.frequency}</span>
                          </div>
                          <button 
                            type="button"
                            disabled={alreadyAdded}
                            onClick={() => handleAddDrug(drug)}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-0.5 cursor-pointer ${
                              alreadyAdded 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                            }`}
                          >
                            <Plus size={12} />
                            {alreadyAdded ? '已添加' : '加入药单'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Rx bottom disclaimer */}
              <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 text-[10px] text-blue-700 leading-normal font-sans font-bold pt-4 mt-4">
                ★ 电子处方将基于我国执业医师规范在线审核，药品极高频剂量均经过药典临床阈值硬比对，任何越安全红线的处方均将引发总审拒绝。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
