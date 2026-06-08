import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  ChevronRight, 
  Users, 
  HelpCircle, 
  Send, 
  Activity, 
  Info, 
  Building2, 
  CornerDownLeft,
  FileSpreadsheet,
  AlertTriangle,
  History,
  Volume2,
  FileText,
  CheckCircle,
  XCircle,
  ThumbsUp
} from 'lucide-react';

interface TriageStep {
  num: number;
  label: string;
}

export default function Triage() {
  const steps: TriageStep[] = [
    { num: 1, label: '症状输入' },
    { num: 2, label: 'AI分析' },
    { num: 3, label: '追问补充' },
    { num: 4, label: '科室推荐' },
    { num: 5, label: '预检报告' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [patientName, setPatientName] = useState('张建设');
  const [patientGender, setPatientGender] = useState<'男' | '女'>('男');
  const [patientAge, setPatientAge] = useState(52);
  const [symptomsInput, setSymptomsInput] = useState(
    '患者自述于发病前突发剧烈偏头痛，伴随轻度眩晕及颈部僵硬酸痛，有明显畏光症状，未发生耳鸣及肢体麻木，已持续72小时无明显缓解迹象。'
  );

  // Simulated Chat items for Step 3
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'patient' | 'doctor'; content: string }>>([
    { sender: 'ai', content: '您好，针对您提到的慢性胸膜区前胸剧烈钝痛。请问这种绞痛在深呼吸、咳嗽或平躺时是否会明显加重？' },
    { sender: 'patient', content: '是的，特别是深呼吸、打喷嚏或者左侧卧时痛得更厉害，坐起来稍微舒服点。' }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  
  // Custom successful action logs
  const [auditResult, setAuditResult] = useState<'pending' | 'passed' | 'rejected'>('pending');

  const addChatSuggestion = (tagText: string) => {
    setChatMessages([
      ...chatMessages,
      { sender: 'doctor', content: `追问补充：患者是否有“${tagText}”合并体征？` },
      { sender: 'patient', content: `有此体征。的确觉得${tagText}，伴随偶发性冷汗出，咽部有紧缩压迫。` },
      { sender: 'ai', content: `【AI二次校验反馈】：收到追加体征。由于胸骨后放射至“${tagText}”且合并咽部紧缩感，心源性梗死、不稳定型心绞痛风险系数由 65% 上升至 88% ↑。建议立即行床旁急诊十二导联心电图及Troponin心肌酶快速筛查。` }
    ]);
  };

  const handleSendChat = () => {
    if (!userChatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'doctor', content: userChatInput },
      { sender: 'patient', content: '这倒不明显，大汗和恶心想吐的感觉很少有。' },
      { sender: 'ai', content: '已追加该反馈记录。排除反射性植物神经症状，仍高度警戒主动脉夹层、肺栓塞等极高危冠脉危机。' }
    ]);
    setUserChatInput('');
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(steps.length, prev + 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stepper Wizard Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck2 size={20} className="text-blue-600" />
              AI 预检及前置导诊审核台
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
              通过深度强化临床推理算力，自动审计评估患者线上分流体征，提供推荐二级病区与导诊决策
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-lg self-start">
            {steps.map((st) => (
              <button
                key={st.num}
                onClick={() => {
                  setAuditResult('pending');
                  setCurrentStep(st.num);
                }}
                className={`px-3 py-1.5 rounded text-xs font-sans font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentStep === st.num 
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : currentStep > st.num
                    ? 'text-blue-750 bg-blue-50/70 border border-blue-100/50'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep >= st.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-650 font-bold'
                }`}>{st.num}</span>
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {auditResult === 'passed' && (
        <div className="bg-blue-50/40 border border-blue-200 text-blue-900 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2.5 animate-fade-in font-sans shadow-sm">
          <CheckCircle className="text-blue-600" size={32} />
          <h3 className="font-bold text-base text-blue-900 font-display">审核通过并准予分流进入门急诊序列</h3>
          <p className="text-xs text-slate-500 max-w-xl leading-normal font-semibold">
            预检方案完成临床核对准入。诊断凭证和 AI 推荐的 【十二导联超急静息心电图】 临床指南已推送至患者随身客户端。分流执飞流水号 EHR-2026-905-X9 全程安全绑定。
          </p>
          <button 
            onClick={() => {
              setCurrentStep(1);
              setAuditResult('pending');
            }} 
            className="mt-3 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-all cursor-pointer shadow-xs"
          >
            开始新一案的导诊审核流程
          </button>
        </div>
      )}

      {auditResult === 'rejected' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2.5 animate-fade-in font-sans shadow-sm">
          <XCircle className="text-rose-600" size={32} />
          <h3 className="font-bold text-base text-rose-950 font-display">该分诊审核被驳回待检</h3>
          <p className="text-xs text-slate-500 max-w-xl leading-normal font-medium">
            该分流申请被判定驳回重核。原因为：主诉伴随中重度前胸骨闷胀、合并反酸胃热等典型消化道疾病征兆，不满足分流至“眼科”的对应准则。请在首关修正要素重新提交。
          </p>
          <button 
            onClick={() => {
              setCurrentStep(1);
              setAuditResult('pending');
            }} 
            className="mt-3 px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500 transition-all cursor-pointer shadow-xs"
          >
            返回重新填写
          </button>
        </div>
      )}

      {auditResult === 'pending' && (
        <div className="min-h-[420px]">
          {/* STEP 1: SYMPTOM DETAILS TEXTAREA INPUT */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
                <div className="space-y-4 font-sans text-sm">
                  <h3 className="font-sans font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center justify-between font-display">
                    <span>1. 临床主诉自测体征采集</span>
                    <span className="text-[10px] font-mono bg-blue-50 border border-blue-200 text-blue-750 px-2.5 py-0.5 rounded font-bold">
                      就诊人: {patientName} ({patientGender} • {patientAge}岁)
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 block">真实备案姓名</label>
                      <input 
                        type="text" 
                        value={patientName} 
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 block">性别偏好</label>
                      <select 
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as '男' | '女')}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-slate-850 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-bold"
                      >
                        <option value="男">男</option>
                        <option value="女">女</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 block">实足年龄 (岁)</label>
                      <input 
                        type="number" 
                        value={patientAge} 
                        onChange={(e) => setPatientAge(parseInt(e.target.value) || 20)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg text-slate-805 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="font-bold text-slate-700 text-xs">前台接诊汇总及患者自述痛感文本</label>
                    <textarea 
                      rows={6}
                      value={symptomsInput}
                      onChange={(e) => setSymptomsInput(e.target.value)}
                      className="w-full font-sans text-slate-750 font-medium leading-relaxed text-xs p-4 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Audio recorder mockup */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50/20 border border-dashed border-blue-200 rounded-lg">
                    <div className="p-2 bg-blue-600 text-white rounded-lg animate-pulse shrink-0">
                      <Volume2 size={16} />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block font-sans">语音声线及川粤多方言输入模块 (Voice Parser API)</span>
                      <span className="text-slate-500 font-sans block mt-0.5 font-medium">支持医师口授记录自动翻译，精简重组为符合电子病历规约的断句条目。</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-150">
                  <button 
                    onClick={nextStep}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white text-xs font-sans font-bold rounded-lg shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                  >
                    开始 AI 大模型评估建模
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Sidebar tip */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 font-sans">
                <span className="text-[10px] font-mono font-bold text-blue-600 block tracking-wider uppercase">Triage Guideline Standard</span>
                <h4 className="font-sans font-bold text-slate-800 text-sm">如何科学审计预检病情？</h4>
                <div className="text-xs text-slate-500 leading-relaxed space-y-3 font-semibold">
                  <p>● 录入病情主诉阶段，尽量精确囊括了<strong>病损起始、性质（绞痛、坠胀）、重症分型评分、是否产生胸骨后酸性溢出放射</strong>等多重特征词，提高最终流向匹配概率。</p>
                  <p>● 决策保护：AI算力不擅自跨过医生数字CA授权决策，旨在作为第二重逻辑校验，防止脑卒中或主动脉夹层等危重症在大厅等挂号被疏漏。</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI DEEP ANALYSIS */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-sans font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center justify-between font-display">
                  <span className="flex items-center gap-1.5"><Sparkles size={18} className="text-blue-600" /> AI 疑似疾病特征及指征权重排序</span>
                  <span className="text-xs text-slate-400 font-mono font-bold">诊断大模型: MedInsight-Clinical 70B</span>
                </h3>

                {/* Symptom list summarize */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-505 block">核心临床指征提取：</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans text-slate-700">
                    <div className="flex border border-slate-200 bg-slate-50 p-3 rounded-lg justify-between items-center font-bold">
                      <span className="text-slate-500">疼痛定位</span>
                      <strong className="text-slate-900">局限性单侧刺痛 (主诉头骨区)</strong>
                    </div>
                    <div className="flex border border-slate-200 bg-slate-50 p-3 rounded-lg justify-between items-center font-bold">
                      <span className="text-slate-500">累计时长</span>
                      <strong className="text-slate-900">72 小时慢阻性反馈</strong>
                    </div>
                    <div className="flex border border-slate-200 bg-slate-50 p-3 rounded-lg justify-between items-center font-bold">
                      <span className="text-slate-500">痛觉量级评估</span>
                      <strong className="text-amber-600">VAS 评分：7 (中重度痛觉)</strong>
                    </div>
                    <div className="flex border border-slate-200 bg-slate-50 p-3 rounded-lg justify-between items-center font-bold">
                      <span className="text-slate-500">并发症隐患</span>
                      <strong className="text-slate-900">轻度眩晕、颈背酸硬肌肉群紧张</strong>
                    </div>
                  </div>
                </div>

                {/* Gauge Probability values */}
                <div className="space-y-5 pt-3">
                  <span className="text-xs font-bold text-slate-505 block">推荐鉴别疑似疾病清单 (本院病历池相似匹配)</span>
                  
                  <div className="space-y-4">
                    {[
                      { name: '紧张性肌肉收缩头痛 (Tension Headache)', prob: 78, color: 'bg-blue-600' },
                      { name: '偏头痛综合物理发作 (Migraine with aura)', prob: 15, color: 'bg-blue-400' },
                      { name: '丛集性自主神经痛 (Cluster Headache)', prob: 4, color: 'bg-slate-500' },
                      { name: '前庭受限引起的植物体征异常', prob: 3, color: 'bg-slate-350' }
                    ].map((dis, i) => (
                      <div key={i} className="text-xs font-sans space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{dis.name}</span>
                          <span className="font-mono text-slate-900">{dis.prob}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-2 rounded-full ${dis.color}`} style={{ width: `${dis.prob}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                  <button onClick={prevStep} className="px-4 py-2 border border-slate-250 text-slate-600 text-xs rounded-lg font-bold hover:bg-slate-50 cursor-pointer">
                    返回上一处修改主诉
                  </button>
                  <button onClick={nextStep} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-sans font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer">
                    继续追加深度追问
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Tips panel */}
              <div className="bg-blue-50/40 text-slate-800 rounded-xl border border-blue-150 p-5 space-y-4 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-1.5 text-blue-600 font-display">
                  <Activity size={18} />
                  <h4 className="font-sans font-bold text-sm">AI 临检高通量推理决策</h4>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed font-semibold">
                  由于主诉带有 【颈部僵硬酸痛】 的反射现象，大模型提示需慎重排查轻质脑膜炎、枕颈高位交感病变，如在此处追问中伴随轻微发热，建议立刻启用多导心电及体温监护预警通道，避免漏诊。
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: INTERACTIVE CHAT INQUIRY */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient brief index */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[10px] font-mono font-bold text-blue-600 block uppercase tracking-wider">PATIENT SUMMARY</span>
                <div className="space-y-2.5 font-sans text-xs font-semibold">
                  <div><span className="font-bold text-slate-450 block mb-1">当前接诊人手机备案：</span> <strong className="text-slate-800 text-sm">陈建国 (男 / 54岁)</strong></div>
                  <div>
                    <span className="font-bold text-slate-450 block mb-1">主诊断病情陈述：</span> 
                    <span className="text-slate-650 leading-relaxed block bg-white p-2.5 border border-slate-200 rounded font-medium">心前区持续剧烈绞压痛达3h，大汗淋漓向四周蔓延。</span>
                  </div>
                </div>
                
                {/* Clickable Quick Tags Option */}
                <div className="space-y-2 pt-2 border-t border-slate-200 font-sans">
                  <span className="text-[11px] font-bold text-slate-500 block">AI 检索相关疑似伴随指标（点击即可加入追问记录）：</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      '向左肩左肢、下颌骨严重放射痛',
                      '后背部明显切割剥离痛',
                      '胃气上逆、反酸胀气不明显',
                      '既往使用胰岛素/降糖药物'
                    ].map((tag, i) => (
                      <button 
                        key={i}
                        onClick={() => addChatSuggestion(tag)}
                        className="px-2.5 py-1.5 text-[11px] font-sans font-bold text-slate-700 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-750 hover:bg-blue-50/50 rounded transition-all text-left block w-full cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle interactive chat log area */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-[460px]">
                <div className="space-y-4 overflow-y-auto pr-2 max-h-[360px] flex-1 pb-4">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-3 text-xs md:text-sm font-sans ${
                        msg.sender === 'ai' ? 'justify-start' : msg.sender === 'doctor' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed ${
                        msg.sender === 'ai' 
                          ? 'bg-slate-900 text-slate-100 font-sans font-medium border border-slate-800' 
                          : msg.sender === 'doctor' 
                          ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold' 
                          : 'bg-slate-50 text-slate-800 font-medium border border-slate-200'
                      }`}>
                        <div className="text-[10px] font-mono font-bold tracking-wider uppercase block opacity-60 mb-1">
                          {msg.sender === 'ai' ? '🤖 Pre-Triage AI Core' : msg.sender === 'doctor' ? '👨‍⚕️ Zhang Weiming 主任医师' : '👤 就诊人反馈意见'}
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat text bar inputs */}
                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <input 
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="请输入追问询问内容，按回车或点发送..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    className="flex-1 text-xs font-sans px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-slate-850 font-bold"
                  />
                  <button 
                    onClick={handleSendChat}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs shadow-sm border-0 font-sans font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Send size={12} />
                    下达追问
                  </button>
                  <button 
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-sans font-bold rounded-lg transition-all shrink-0 cursor-pointer"
                  >
                    下 一 步
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DEPARTMENT EXCELLENCE LISTS */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-sans font-bold text-slate-850 text-base border-b border-slate-200 pb-3 flex items-center justify-between font-display">
                  <span>4. 大模型推演匹配流向病区科室</span>
                  <span className="text-xs text-slate-400 font-sans font-bold">综合概率加权源自二十万名三甲病历归档</span>
                </h3>

                <div className="space-y-4">
                  {[
                    { rank: 1, name: '心血管内科门急诊联合病区 (绿通监护)', match: 98, desc: '患者典型主诉：前胸部骨后压窄绞痛加重、合并冷汗如雨，符合典型急性冠脉综合征、心肌梗塞临床标准，进入首套监护绿色通卡。' },
                    { rank: 2, name: '普通消化门诊及急腹症普外', match: 72, desc: '需鉴别排除重症急性十二指肠高位溃疡、胆源性急性胰腺梗阻疼痛，具备副科备查条件。' },
                    { rank: 3, name: '心胸大血管血管外科方向', match: 45, desc: '预防主动脉中层突发夹层切割破坏导致的外向反射剧烈刺痛，建立急诊二级协同指引。' }
                  ].map((dept) => (
                    <div key={dept.rank} className="p-4 border border-slate-200 hover:border-blue-300 rounded-lg bg-slate-50/20 hover:bg-blue-50/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-xs">
                      <div className="space-y-1.5 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center font-mono text-[10px]">{dept.rank}</span>
                          <span className="font-bold text-slate-900 text-sm block font-sans">{dept.name}</span>
                        </div>
                        <p className="text-slate-550 font-sans font-semibold leading-relaxed pt-1">{dept.desc}</p>
                      </div>

                      <div className="flex flex-col items-center shrink-0 w-24 border-l md:border-l-0 md:border-none pt-3 md:pt-0 border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">MATCH PROB</span>
                        <span className="text-2xl font-mono font-black text-blue-600 mt-1">{dept.match}%</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 pb-1">
                          <div className="bg-blue-600 h-1.5" style={{ width: `${dept.match}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                  <button onClick={prevStep} className="px-3.5 py-2 border border-slate-250 text-slate-650 text-xs rounded-lg font-bold hover:bg-slate-50 cursor-pointer">
                    返回追问详情
                  </button>
                  <button onClick={nextStep} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white text-xs font-sans font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs">
                    渲染生成预审终判报告
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Side notice Illustration */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 font-sans text-xs">
                <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2 py-0.5 rounded border border-blue-100 block w-max self-start select-none">
                  二级黄色警戒执勤警示
                </span>
                <h4 className="font-sans font-bold text-slate-800 text-sm">危险分阶及前置处置守则</h4>
                <div className="text-slate-500 leading-relaxed font-semibold space-y-3">
                  <p>● 患者具有 <strong>【心前区剧痛 &gt;3小时0分】</strong> 的特异高危警兆，切忌让其在大厅走廊内原地等待核酸或缓慢挂号。</p>
                  <p>● 点击审核通过后，该案例的数据报告自动推送至前检接诊护手PAD端，预先开立检验单据，缩短急危重候诊周期。</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TRIAL REPORT FINAL SHEET CARD */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-10">
              {/* Paper Document Layout (Span 2) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-205 shadow-md overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                <div className="p-6 md:p-8 space-y-6">
                  {/* Clinic logo header */}
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-5">
                    <div className="space-y-1 font-sans">
                      <h2 className="text-lg md:text-xl font-display font-black text-slate-900 tracking-tight leading-none uppercase">Clinical Pre-Triage Report</h2>
                      <span className="text-xs font-mono text-slate-400 font-bold">门诊部及病床数字化前置导诊排班建议单</span>
                    </div>
                    <div className="border border-slate-200 p-2 text-center rounded bg-slate-50 font-mono text-[9px] font-bold shrink-0">
                      <span className="text-slate-400 block uppercase font-bold text-[8px] select-none">SYSTEM DIGITALLY ATTESTED</span>
                      <strong className="text-slate-800 block text-xs mt-0.5 font-bold">REG-DX-90501X</strong>
                    </div>
                  </div>

                  {/* Patient Info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block font-bold mb-0.5">就诊人名字</span>
                      <strong className="text-slate-850 text-slate-800 text-sm">{patientName}</strong>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block font-bold mb-0.5">性别 / 报告年龄</span>
                      <strong className="text-slate-805 text-slate-800 text-sm">{patientGender} • {patientAge}岁</strong>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block font-bold mb-0.5">关联通信备案手机</span>
                      <strong className="text-slate-805 text-slate-800 text-xs font-mono font-bold">{patientName === '张建设' ? '13800000002' : '13555556666'}</strong>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 block font-bold mb-0.5">导诊病情分层级级别</span>
                      <span className="inline-block text-blue-750 text-[10.5px] px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded font-black">
                        普通分时诊级 (Normal)
                      </span>
                    </div>
                  </div>

                  {/* Bento grids report content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs font-sans">
                      <span className="font-bold text-slate-750 block">◆ 核心主要诉求体征整理</span>
                      <p className="text-slate-600 font-semibold leading-relaxed pt-1">
                        {symptomsInput}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs font-sans">
                      <span className="font-bold text-slate-750 block">◆ AI 智能分析评估详情</span>
                      <p className="text-slate-600 font-semibold leading-relaxed pt-1">
                        考虑主要由中枢交感型、典型紧张性硬化收缩性偏头痛导致发作。可能合并近期作息压力剧增，微循环一过性狭窄导致舒张限流。
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs col-span-2 font-sans">
                      <span className="font-bold text-slate-750 block">◆ 门诊前置诊疗检验开单建议表 (建议快速采取血液及影像)</span>
                      <div className="flex flex-wrap gap-2 pt-1 font-semibold">
                        <span className="px-2.5 py-1 bg-white border border-slate-205 rounded text-slate-700">12导联超静息标准心电图 (静息)</span>
                        <span className="px-2.5 py-1 bg-white border border-slate-205 rounded text-slate-700">心肌酶肌钙蛋白全套(Troponin-V)</span>
                        <span className="px-2.5 py-1 bg-white border border-slate-205 rounded text-slate-700">高空间分辨率胸部多层计算机CR片</span>
                        <span className="px-2.5 py-1 bg-white border border-slate-205 rounded text-slate-700">动脉血管机能生化与临床气道分析</span>
                      </div>
                    </div>
                  </div>

                  {/* Important precautions checklist */}
                  <div className="space-y-1 text-xs font-sans font-bold">
                    <span className="text-rose-600 block">⚠️ 护诊随行特殊警示红线：</span>
                    <p className="text-rose-700 leading-normal pl-1 font-medium text-xs">
                      ● 严禁患者剧烈扭头或搬抬重物。维持平静空气吸入。临床对冷汗症状增多的案例需高度警备，备齐便携诊查平车。
                    </p>
                  </div>
                </div>

                {/* Audit recommendation slider bar footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-sans py-1 font-semibold leading-relaxed">
                    <span className="font-bold text-slate-750 block font-sans">流向审查核准意见：</span>
                    考虑满足高等级绿通，前置接诊由 【心血管内科急诊重症监护二组】 承接治疗。
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setAuditResult('rejected')}
                      className="px-4 py-2 border border-rose-250 text-rose-600 bg-white hover:bg-rose-50 rounded-lg font-sans font-bold text-xs transition-all cursor-pointer"
                    >
                      驳回前案
                    </button>
                    <button 
                      onClick={() => setAuditResult('passed')}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      核准方案并下达分流
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar helper notes */}
              <div className="space-y-6">
                <div className="bg-blue-50/40 text-slate-650 rounded-xl border border-blue-150 p-5 space-y-3 font-sans text-xs leading-relaxed font-medium">
                  <h4 className="font-sans font-bold text-blue-600 text-sm flex items-center gap-1 font-display">
                    <Info size={16} />
                    法律责任及数据告知书
                  </h4>
                  <p className="font-medium text-slate-300 leading-relaxed">
                    本大模型前置生成诊断及检验代开单草案并不等同于首诊注册医师口授病理证明。本站AI数据推荐纯为概率评估，患者一切最终分流处置结论，其医学行政和医疗安全法案责任，最终归属于签名盖章的接诊医生。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
