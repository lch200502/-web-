import React, { useState } from 'react';
import { 
  UserRound, 
  ShieldCheck, 
  Settings, 
  Bell, 
  KeyRound, 
  CheckCircle, 
  Calendar,
  Layers,
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';

export default function Profile() {
  // Simple form fields update states
  const [phone, setPhone] = useState('13800000002');
  const [email, setEmail] = useState('doctor.zhang@clinical.example.org');

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Custom alert and success state representation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPwSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('请完整填写密码修改信息');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('新密码与重复输入的新密码不一致，请核实。');
      return;
    }

    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Hero Sheet */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 p-6 md:p-8 rounded-xl border border-blue-300 text-white shadow-lg flex flex-col md:flex-row justify-between md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-tr from-white to-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-2xl md:text-3xl font-black font-sans shadow-md select-none">
            张
          </div>
          <div className="space-y-1.5 font-sans">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-none">张伟明</h2>
              <span className="px-2.5 py-0.5 text-[10px] md:text-xs font-bold bg-white/20 text-white border border-white/30 font-bold shadow-xs rounded flex items-center gap-1 select-none">
                <ShieldCheck size={12} />
                实名数字安全授信
              </span>
            </div>
            
            <p className="text-xs md:text-xs text-slate-600 font-semibold">
              主任医师 • 消化内科科室副总管 | 临床医学双博士
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] md:text-xs pt-0.5 font-bold">
              <span className="px-2.5 py-0.5 bg-white/10 border border-white/25 rounded text-white">执业经验: 15年+</span>
              <span className="px-2.5 py-0.5 bg-white/10 border border-white/25 rounded text-white">医保验证公钥: HP-6019-XM2</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[11px] md:text-xs text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 self-start md:self-auto z-10 space-y-1 font-bold">
          <div><span className="font-bold text-slate-500 mr-2">执业合格登记证号:</span> <span className="font-mono text-blue-300">PDY-201109401X</span></div>
          <div><span className="font-bold text-slate-500 mr-2">门急诊排班序列:</span> <span className="text-slate-600">周一/周三全天、周五上午</span></div>
          <div><span className="font-bold text-slate-500 mr-2">临床系统授权级别:</span> <span className="text-slate-600">门诊责任主治医生</span></div>
        </div>
      </div>

      {/* Bento style Forms rows info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span 2 forms basic */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form 1 - Contact profile */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center gap-1.5 font-display">
              <UserRound size={18} className="text-blue-600" />
              医师基本数字档案信息表格
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 block">门诊系统账户名</label>
                <input 
                  type="text" 
                  value="doctor001" 
                  disabled 
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 text-slate-450 cursor-not-allowed rounded-lg font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 block">真实备案医师姓名</label>
                <input 
                  type="text" 
                  value="张伟明" 
                  disabled 
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 text-slate-450 cursor-not-allowed rounded-lg font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-650 block">绑定的移动手机号码 (SMS)</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-650 block">官方执业电子信箱 (E-Mail)</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                />
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/20 border border-blue-100/50 rounded-lg flex items-start gap-2.5 shadow-xs">
              <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={16} />
              <div className="text-xs font-sans font-semibold">
                <span className="font-bold text-slate-800">国家卫健委实名注册授信：</span>
                <span className="text-slate-550 block mt-0.5 leading-normal">注册所属医保卡号：440************001X。系统严禁异地转借或冒名登录，单次操作不匹配即强制熔断CA及可信链连接。</span>
              </div>
            </div>
          </div>

          {/* Form 2 - Modify password forms block */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base border-b border-slate-200 pb-3 flex items-center gap-1.5 font-display">
              <KeyRound size={18} className="text-blue-600" />
              安全登录密码更新凭证
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-650">当前旧密码</label>
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-650">设定新密码</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-650">重复确认新密码</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-rose-700 rounded-lg text-xs flex items-center gap-1.5 font-bold animate-fade-in">
                  <AlertCircle size={14} className="text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 text-xs">
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  确认下达新密码
                </button>
              </div>

              {pwSuccess && (
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-900 rounded-lg text-xs flex items-center gap-1.5 justify-center animate-fade-in font-bold">
                  <CheckCircle size={14} className="text-blue-600" />
                  医师登录凭证密码CA核准更新成功！下次强制使用新凭证授信。
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right - Profile System Presets column (Span 1) */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-1.5 font-display">
              <Settings size={18} className="text-blue-600" />
              工作台便捷安全功能管理
            </h3>

            <div className="space-y-2.5 font-sans text-xs">
              {[
                { title: '排班日程管理', desc: '设定或核查上午/下午门诊调班预置计划', count: '周排班' },
                { title: '临床安全消息流通知', desc: '预检高危红线、随访体征指标异常主动警报', count: '已启用' },
                { title: 'CA读盾外部设备连接', desc: '指纹或医院电子工牌数码盾自动连续验证', count: '免验证1h' },
                { title: '临床医学指南库同步', desc: '检查最新慢病中西共识指南数据库版本', count: 'v12.0 最新' }
              ].map((act, i) => (
                <div 
                  key={i}
                  className="p-3 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 rounded-lg flex justify-between items-center cursor-pointer transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block text-xs">{act.title}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">{act.desc}</span>
                  </div>
                  <span className="text-[10px] bg-slate-150 text-slate-650 px-2.5 py-0.5 rounded font-bold shrink-0">{act.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/40 text-slate-650 p-5 rounded-xl border border-blue-150 space-y-3 shadow-xs font-sans text-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            <h4 className="font-sans font-bold text-blue-800 text-sm font-extrabold flex items-center gap-1 font-display">
              <Info size={16} />
              医患数据安全合规准则
            </h4>
            <p className="leading-relaxed text-slate-600">
              本工作台技术及逻辑完全符合国家数字化二级医疗单位信息保密安全法。所有签署通过的电子病历及CA处方笺，均有区块链存根及数字加密信封，留痕备份长达15年，确保诊疗流程绝对可追溯。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
