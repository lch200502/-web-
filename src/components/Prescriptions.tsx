import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  Clock, 
  Printer, 
  Lock, 
  Check, 
  AlertCircle,
  Building,
  UserCheck,
  Info
} from 'lucide-react';
import { Prescription } from '../types';

interface PrescriptionsProps {
  prescriptions: Prescription[];
}

export default function Prescriptions({ prescriptions }: PrescriptionsProps) {
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(prescriptions[0] || null);
  const [rxQuery, setRxQuery] = useState('');

  // Sign states
  const [showSignModal, setShowSignModal] = useState(false);
  const [caPassword, setCaPassword] = useState('');
  const [signSuccess, setSignSuccess] = useState(false);
  
  // Custom toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filtered = prescriptions.filter(p => 
    p.patientName.includes(rxQuery) || p.id.includes(rxQuery)
  );

  const handlePrint = () => {
    showToast('正在呼叫理疗室网络热敏打印机，RP诊断核准签章联输出纸中...');
  };

  const handleCAVerify = () => {
    if (caPassword === '123456') {
      setSignSuccess(true);
      setTimeout(() => {
        if (selectedRx) {
          selectedRx.status = '已下达';
          selectedRx.signature = '张伟明';
        }
        setSignSuccess(false);
        setShowSignModal(false);
        setCaPassword('');
        showToast('执业医师认证核签成功，处方笺安全数字指纹已下发。');
      }, 1500);
    } else {
      showToast('❌ CA验证失败：密码错误。请再次核实医师数码盾（测试密码：123456）');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-blue-600 text-white shadow-lg border border-blue-550 font-sans font-bold text-xs px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-slide-in">
          <Info size={14} className="text-blue-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sign password dialog modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-xs">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2.5 font-display">
              <Lock size={16} className="text-blue-600" />
              执业医师 CA 数字安全签章核准
            </h3>

            {signSuccess ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-1.5 text-blue-800">
                <CheckCircle size={32} className="text-blue-600 animate-bounce" />
                <span className="text-xs font-bold font-sans">数字信封加密核签完成！</span>
                <span className="text-[10px] text-slate-400">正在生成区块链门诊核账存根校验码</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                  安全规范提示：下达医疗处方涉及民生医保清算，请验证您的执业医师商用CA盾密钥授权，测试密码为：<strong className="font-mono text-blue-600 font-black">123456</strong>：
                </p>
                <div className="space-y-1 text-xs">
                  <input 
                    type="password"
                    placeholder="请输入六位安全签章数码盾密码"
                    value={caPassword}
                    onChange={(e) => setCaPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-lg text-slate-800 text-center text-sm font-bold tracking-widest focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2 text-xs">
                  <button 
                    onClick={() => setShowSignModal(false)}
                    className="px-3.5 py-1.5 border border-slate-250 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleCAVerify}
                    className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    授信核章签名
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              电子处方存根核查案卷
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
              追踪检索本院出院患者历史开立药单档案，由官方CA中心加密安全信封确立可信医保流转
            </p>
          </div>

          <div className="relative font-sans text-xs w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索患者真实姓名 / 处方ID..." 
              value={rxQuery}
              onChange={(e) => setRxQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-bold transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel list of recent items */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[460px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 text-slate-850 font-bold text-xs flex justify-between items-center">
              <span>历史药单明细份数</span>
              <span className="font-mono bg-white px-2 py-0.5 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">{filtered.length} 份</span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
              {filtered.map((rx) => (
                <div 
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-4 transition-colors cursor-pointer flex flex-col gap-1.5 border-l-4 ${
                    selectedRx?.id === rx.id ? 'bg-blue-50/40 border-blue-600' : 'border-transparent hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400 font-bold">Rp No.{rx.id.substring(0, 12)}</span>
                    <span className="text-slate-400 text-[10px] font-mono font-bold">{rx.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-sans">
                    <strong className="text-slate-900 block text-sm font-bold">{rx.patientName} <span className="text-xs text-slate-450 font-medium">({rx.gender} • {rx.age}岁)</span></strong>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      rx.status === '已下达' ? 'bg-blue-50 text-blue-750 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {rx.status}
                    </span>
                  </div>
                  <p className="text-xs font-sans text-slate-550 truncate font-semibold">基本诊断：{rx.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right paper Prescription Preview Sheet */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-205 shadow-md overflow-hidden relative border-t-4 border-t-blue-600">
            {selectedRx ? (
              <div className="p-6 md:p-8 flex flex-col h-full justify-between gap-6">
                <div className="space-y-6">
                  {/* Prescription Official Print Header */}
                  <div className="text-center space-y-1.5 border-b border-slate-300 pb-4 font-sans">
                    <h1 className="text-lg font-display font-black tracking-widest text-slate-900">数字化临床医疗电子处方箋</h1>
                    <div className="flex justify-center items-center gap-4 text-[10px] text-slate-400 font-mono font-semibold">
                      <span>处方安全流水号: {selectedRx.id}</span>
                      <span>•</span>
                      <span>全国数字化大医防药一体核准</span>
                    </div>
                  </div>

                  {/* Patient Demographic Profile sheet */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-sans">
                    <div>
                      <span className="text-slate-400 block font-bold mb-0.5">患者真实姓名</span>
                      <strong className="text-slate-805 text-slate-800 text-xs md:text-sm">{selectedRx.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold mb-0.5">患者性别 / 年龄</span>
                      <strong className="text-slate-805 text-slate-800 text-xs md:text-sm">{selectedRx.gender} • {selectedRx.age}岁</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold mb-0.5">门诊责任科室</span>
                      <strong className="text-slate-805 text-slate-800 text-xs md:text-sm">消化内科二病区</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold mb-0.5">临床诊断审记结果</span>
                      <strong className="text-slate-805 text-slate-800 text-xs truncate block">{selectedRx.diagnosis}</strong>
                    </div>
                  </div>

                  {/* Medication detail row */}
                  <div className="pt-2 font-sans space-y-4">
                    <div className="flex items-center gap-1.5 text-slate-900 border-b border-slate-200 pb-2">
                      <strong className="text-xl italic font-serif text-slate-950 font-black tracking-tight select-none">Rp</strong>
                    </div>

                    <div className="divide-y divide-slate-100 font-sans text-xs">
                      {selectedRx.drugs.map((dr, pos) => (
                        <div key={dr.id} className="py-3.5 flex justify-between items-start">
                          <div className="space-y-1 text-slate-800 max-w-[70%]">
                            <span className="font-bold text-sm text-slate-900 block">{pos+1}. {dr.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">单体规格：{dr.spec}</span>
                            <p className="text-slate-650 font-semibold mt-1">给药指导：{dr.dosage} • {dr.frequency} ({dr.route})</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900 text-sm">{dr.count} 盒 / 剂</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Print action and signature blocks */}
                <div className="pt-6 border-t border-dashed border-slate-250 mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-xs font-sans">
                  <div className="space-y-1.5 font-medium text-slate-500">
                    <div><span className="font-bold text-slate-400 mr-1.5">印核签发执业医师:</span> <strong className="text-slate-800 text-sm font-bold">{selectedRx.signature || <span className="text-rose-550 text-rose-600 underline decoration-dotted font-bold">待医师 CA 金钥验盾投签</span>}</strong></div>
                    <div><span className="font-bold text-slate-400 mr-1.5">区块链授信密钥哈希:</span> <span className="font-mono text-slate-450 font-bold">8f4e2f89...a1f6a1d8</span></div>
                  </div>

                  {/* QR code and Barcode simulator */}
                  <div className="flex gap-4 self-end">
                    <div className="border border-slate-200 p-2 text-center rounded-lg bg-slate-50 flex items-center justify-center flex-col shadow-xs select-none">
                      {/* Premium Vector SVG QR Code */}
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-800">
                        <path d="M3 3h4v4H3zM17 3h4v4H17zM3 17h4v4H3zM14 14h2M18 18h2M14 18h1M18 14h1" />
                      </svg>
                      <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase font-bold tracking-wider">配派核药</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={handlePrint}
                        className="p-3 border border-slate-250 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-xs"
                        title="输出处方"
                      >
                        <Printer size={16} />
                      </button>

                      {selectedRx.status === '草稿' || !selectedRx.signature ? (
                        <button 
                          onClick={() => {
                            setCaPassword('');
                            setShowSignModal(true);
                          }}
                          className="px-5 py-2.5 bg-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Lock size={12} />
                          CA 盾签章印
                        </button>
                      ) : (
                        <div className="px-4 py-2.5 bg-blue-50 text-blue-750 border border-blue-200 rounded-lg font-bold font-sans flex items-center gap-1.5 shadow-xs select-none">
                          <Check size={14} className="text-blue-600" />
                          已投递药房药审
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-450 font-bold font-sans">
                请先在左侧点选任一有效的处方明细单
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
