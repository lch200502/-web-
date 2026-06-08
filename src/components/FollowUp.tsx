import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  FileCheck2, 
  Sparkles, 
  PhoneCall, 
  CheckCircle,
  ThumbsUp,
  UserCheck,
  Info
} from 'lucide-react';
import { Patient } from '../types';

interface FollowUpProps {
  patients: Patient[];
}

export default function FollowUp({ patients }: FollowUpProps) {
  const [selectedPatientId, setSelectedPatientId] = useState('2026090501'); // Defaults to '张三'
  const [isAdopted, setIsAdopted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Custom edit states
  const [exerciseRegimen, setExerciseRegimen] = useState('每周三次、每次20分钟的中等强度有氧运动，如快走。');
  const [dietaryRegimen, setDietaryRegimen] = useState('严格限制盐分摄入（每日不超过5g），少吃油腻及辛辣刺激食物，多吃粗粮水果。');

  // Find active patient details
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Mock score & indicators based on chosen patients
  const scoreData = {
    '2026090501': { score: 85, delta: '+5', warning: '血压偏高: 145/95 mmHg', advice: '立即暂停高强度抗阻训练，多进行静态呼吸放松，增加晨起/夜间双次血压监控，若复测仍高建议咨询主治医生加服复方控盐剂。' },
    '2026090502': { score: 92, delta: '+8', warning: '暂无异常指标', advice: '复位治疗后眼震反射完全消失。建议避免猛烈转头与频繁低头俯卧，继续规律作息，增加小脑运动平稳度性锻炼。' },
    '2026090503': { score: 68, delta: '-4', warning: '心率偏快及偶发胸闷: 92次/分', advice: '患者运动依从度极低（低于35%），吸烟尚未完全戒除。嘱其绝对不能参与中重体力负担体力活，有胸骨后压榨感时立即含服硝酸甘油并就地休息。' },
    '2026090504': { score: 79, delta: '+2', warning: '空腹血糖波动: 8.2 mmol/L', advice: '餐后运动及用药依从可。注意睡前防低血糖。每日睡前检查双足，避免足部皮肤皲裂及创伤。' },
    '2026090505': { score: 88, delta: '+12', warning: '胃肠蠕动减缓: 轻度腹胀', advice: '术后恢复尚可，需增加粗纤维及流食配比。饭后保持慢走半小时促肠蠕动排气，忌大补及服用坚硬药物。' }
  }[selectedPatientId] || { score: 80, delta: '+1', warning: '无明显指标异常', advice: '继续保持常规康复动作，保持充足水分 and 规律作息。' };

  const handleAdopt = () => {
    setIsAdopted(true);
    setTimeout(() => setIsAdopted(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Selector Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-1000 tracking-tight flex items-center gap-2">
            <PhoneCall size={20} className="text-blue-600" />
            随访康复评估监测中心
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            选择出院患者或在线定点随访对象，核测穿戴监护设备同步回馈的多维体征指标
          </p>
        </div>

        <div>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setIsAdopted(false);
              setIsEditing(false);
            }}
            className="text-xs font-sans px-3.5 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 text-slate-850 font-bold cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} (患者ID: {p.id})</option>
            ))}
          </select>
        </div>
      </div>

      {activePatient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Triage / Warning banner if abnormal */}
            {scoreData.warning !== '暂无异常指标' && scoreData.warning !== '无明显指标异常' && (
              <div className="bg-red-50 border border-red-200 p-4.5 rounded-lg flex items-start gap-3 shadow-xs">
                <AlertCircle className="text-rose-600 shrink-0 mt-0.5 animate-pulse" size={20} />
                <div className="font-sans text-xs">
                  <span className="font-bold text-rose-900 text-sm block">临床异常体征研判警告</span>
                  <div className="mt-1 text-slate-750 font-semibold leading-relaxed font-sans">
                    <strong className="text-rose-700 bg-rose-100/50 px-1.5 py-0.5 rounded mr-1">“{scoreData.warning}”</strong> — {scoreData.advice}
                  </div>
                </div>
              </div>
            )}

            {/* Metrics Trends Chart Component */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-1.5">
                  <TrendingUp size={18} className="text-blue-600" />
                  多维康复核心指标随访变化趋势
                </h3>
                <span className="text-xs font-mono text-slate-400">近4周智能测量传感器更新</span>
              </div>

              {/* Graphic charts mock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* 1. Target Score progress */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 font-sans block">健康自评依从复合评分 (0-100)</span>
                  <div className="h-44 bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-end h-28 relative">
                      {/* Bar graph bars */}
                      {[
                        { label: '第1周', val: 55, h: 'h-1/2' },
                        { label: '第2周', val: 70, h: 'h-2/3' },
                        { label: '第3周', val: 80, h: 'h-[80%]' },
                        { label: '本周', val: scoreData.score, h: 'h-[85%] bg-blue-600 shadow-md shadow-blue-600/20' }
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[10px] font-mono font-bold text-slate-600">{bar.val}分</span>
                          <div className={`w-8 rounded-t-md transition-all duration-300 ${i === 3 ? 'bg-blue-600' : 'bg-blue-200 hover:bg-blue-300'}`} style={{ height: `${bar.val}%` }} />
                          <span className="text-[10px] font-sans text-slate-450 font-semibold">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Specific Indicator (Blood pressure static or ECG values) */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 font-sans block">患者核心关联体征趋势 ({selectedPatientId === '2026090501' ? '收缩压/mmHg' : '静息心率/次分'})</span>
                  <div className="h-44 bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-end h-28 relative">
                      {[
                        { label: '第1周', val: selectedPatientId === '2026090501' ? 152 : 82 },
                        { label: '第2周', val: selectedPatientId === '2026090501' ? 149 : 88 },
                        { label: '第3周', val: selectedPatientId === '2026090501' ? 142 : 78 },
                        { label: '本周', val: selectedPatientId === '2026090501' ? 145 : 72 }
                      ].map((item, i) => {
                        const targetMax = selectedPatientId === '2026090501' ? 180 : 120;
                        const percentHeight = (item.val / targetMax) * 100;
                        const isAbnormal = selectedPatientId === '2026090501' ? item.val > 140 : item.val > 90;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <span className={`text-[10px] font-mono font-bold ${isAbnormal ? 'text-rose-600' : 'text-slate-650'}`}>{item.val}</span>
                            <div 
                              className={`w-8 rounded-t-md transition-all duration-300 ${isAbnormal ? 'bg-rose-500' : 'bg-blue-350'}`} 
                              style={{ height: `${percentHeight}%` }} 
                            />
                            <span className="text-[10px] font-sans text-slate-450 font-semibold">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Medical Plan Suggestions */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5 font-display">
                  <Sparkles size={16} className="text-blue-600" />
                  AI 生成的个性化下一步康复改进专案
                </span>
                <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded font-mono text-slate-500">
                  方案版本 v3.8.1
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-4 font-sans text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">运动/康复调节锻炼处方</label>
                    <textarea 
                      rows={2}
                      value={exerciseRegimen}
                      onChange={(e) => setExerciseRegimen(e.target.value)}
                      className="w-full text-xs font-sans px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">饮食营养平衡指令</label>
                    <textarea 
                      rows={2}
                      value={dietaryRegimen}
                      onChange={(e) => setDietaryRegimen(e.target.value)}
                      className="w-full text-xs font-sans px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm"
                    >
                      保 存
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50/20 rounded-lg border border-blue-100/50 space-y-1">
                    <span className="text-xs font-bold font-sans text-blue-900 font-bold">1. 下一步身体功能性康复锻炼建议</span>
                    <p className="text-xs text-slate-650 font-sans leading-relaxed pt-1 font-semibold">
                      {selectedPatientId === '2026090501' ? exerciseRegimen : '建议进行前庭康复（Hebrand-Brandt）眼球追视，每日一次。保持小脑位置平衡锻炼，不推荐举重负压行动。'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/20 rounded-lg border border-blue-100/50 space-y-1">
                    <span className="text-xs font-bold font-sans text-blue-900 font-bold">2. 合理养胃调护和营养学专方</span>
                    <p className="text-xs text-slate-650 font-sans leading-relaxed pt-1 font-semibold">
                      {selectedPatientId === '2026090501' ? dietaryRegimen : '餐后避免卧床平躺，饭食推荐少量多次。忌大骨肉汤油盐煎炸，每日碳水化合物与果蔬推荐纤维配比6:4。'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons footer */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-[10px] text-slate-450 font-sans italic font-bold">
                  * 临床AI建议由中英文慢病指南共识引擎交叉审计生成，仅作为医生参考决议。
                </span>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 py-1.5 border border-slate-205 text-slate-700 bg-white font-sans font-bold text-xs rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    修改建议
                  </button>
                  <button 
                    onClick={handleAdopt}
                    className="px-4 py-1.5 bg-blue-600 text-white bg-blue-600 hover:bg-blue-500 font-sans font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle size={12} />
                    采纳并推送随访
                  </button>
                </div>
              </div>

              {isAdopted && (
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-900 rounded-lg text-xs flex items-center gap-1.5 justify-center animate-fade-in font-sans font-bold shadow-xs">
                  <ThumbsUp size={14} className="text-blue-600" />
                  采纳成功！健康康复调控指导方案已安全推送至 {activePatient.name} 的移动随访客户端中。
                </div>
              )}
            </div>
          </div>

        {/* Right Column: Mini score metrics card (Span 1) */}
        <div className="space-y-6">
          {/* Health Score metrics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base">复合评估分值概要</h3>

            <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
              <span className="text-[11px] font-sans text-slate-400 font-bold uppercase tracking-wider">综合康复评分 (8周内)</span>
              
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-5xl font-mono font-black text-slate-900 leading-none">{scoreData.score}</span>
                <span className="text-xs font-sans font-extrabold text-slate-400">/ 100</span>
              </div>

              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-bold font-mono border border-blue-100">
                {scoreData.delta > '0' ? '较上周提升' : '发生变相降低'} {scoreData.delta} 分
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex justify-between items-center text-slate-650 font-bold">
                <span>多效依从度(服药、作息)</span>
                <span className="font-mono font-bold text-slate-900">{selectedPatientId === '2026090501' ? '82%' : selectedPatientId === '2026090502' ? '95%' : '32%'}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: selectedPatientId === '2026090501' ? '82%' : selectedPatientId === '2026090502' ? '95%' : '32%' }} 
                />
              </div>

              <div className="flex justify-between items-center text-slate-650 font-bold">
                <span>定点运动活跃度评估</span>
                <span className="font-mono font-bold text-slate-900">{selectedPatientId === '2026090501' ? '78%' : selectedPatientId === '2026090502' ? '88%' : '44%'}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-305 bg-blue-400 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: selectedPatientId === '2026090501' ? '78%' : selectedPatientId === '2026090502' ? '88%' : '44%' }} 
                />
              </div>
            </div>
          </div>

          {/* Call follow-up helper */}
          <div className="bg-blue-50/40 text-slate-800 rounded-xl border border-blue-150 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <PhoneCall size={18} className="text-blue-300" />
              <h4 className="font-sans font-bold text-sm">电话/音视频回访快捷呼叫</h4>
            </div>
            <p className="text-xs text-slate-650 font-sans leading-relaxed font-medium">
              可通过临床SIP网络专线对 <strong>{activePatient.name}</strong> 的私密号段（{activePatient.phone}）开启一键电话回诊，录音文件将自动回溯转化进入随访报告中。
            </p>
            <button 
              onClick={() => {}} 
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-750 text-white text-xs font-sans font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-600/10"
            >
              <PhoneCall size={12} />
              开启临床SIP加密呼叫
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
