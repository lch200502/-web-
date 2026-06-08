import React, { useState } from 'react';
import { 
  Building, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Activity, 
  PieChart, 
  Award, 
  DollarSign, 
  Sparkles,
  Heart
} from 'lucide-react';
import { 
  CLINIC_STATS, 
  WEEKLY_TREND, 
  DEPARTMENT_STATS, 
  DOCTOR_LEADERBOARD 
} from '../mockData';

export default function Statistics() {
  const [metricTab, setMetricTab] = useState<'today' | 'weekly' | 'quality'>('today');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Selector Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            临床数字化管理决策系统 (MedSystem Pro)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            实时查看门诊挂诊负荷、医生绩效排行、AI 诊断采纳建议转化与满意度大数据分析
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-lg self-start">
          {[
            { id: 'today', label: '今日数据' },
            { id: 'weekly', label: '7天业务趋势' },
            { id: 'quality', label: '质量指标审计' }
          ].map(it => (
            <button
              key={it.id}
              onClick={() => setMetricTab(it.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-sans font-bold transition-all cursor-pointer ${
                metricTab === it.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日挂号预约数', val: CLINIC_STATS.today.appointments, sub: '较昨日 +12%', icon: Users, color: 'text-blue-600 bg-blue-50 border border-blue-100' },
          { label: '在线就诊问诊量', val: CLINIC_STATS.today.consultations, sub: '接待活跃率 94.6%', icon: Activity, color: 'text-blue-600 bg-blue-50 border border-blue-100' },
          { label: '医保存单实收额', val: `¥${CLINIC_STATS.today.revenue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`, sub: '复诊药房费占 55%', icon: DollarSign, color: 'text-amber-600 bg-amber-50 border border-amber-100' },
          { label: '随访康复完成率', val: `${CLINIC_STATS.today.followupRate}%`, sub: '超额完成指标 +2.5%', icon: Heart, color: 'text-blue-600 bg-purple-50 border border-blue-100' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-sans font-medium block">{card.label}</span>
              <strong className="text-2xl font-mono text-slate-900 block font-bold">{card.val}</strong>
              <span className="text-[11px] text-slate-400 font-sans block pt-1">{card.sub}</span>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 Cumulative Indicator counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '累计就诊患者总数', val: CLINIC_STATS.general.totalPatients.toLocaleString(), tag: '分院全覆盖' },
          { label: '累计门急诊流水总量', val: CLINIC_STATS.general.totalAppointments.toLocaleString(), tag: '数字链路化' },
          { label: '住院部患者整体满意度', val: `${CLINIC_STATS.general.satisfactionRate}%`, tag: '高水准口碑' },
          { label: 'AI辅助医生核准确率', val: `${CLINIC_STATS.general.aiCoadviseRate}%`, tag: '算法迭代中' }
        ].map((card, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs font-sans flex flex-col justify-between h-24 shadow-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-semibold">{card.label}</span>
              <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9.5px] font-mono font-bold text-slate-600">{card.tag}</span>
            </div>
            <strong className="text-xl font-mono font-bold text-slate-900 leading-none">{card.val}</strong>
          </div>
        ))}
      </div>

      {/* Core Grid stats section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Span 2 trend details and Department Loads */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trend chart representation */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-1.5">
              <TrendingUp size={18} className="text-blue-600" />
              近七日业务负荷与收入趋势变化
            </h3>

            <div className="h-56 bg-slate-50 rounded-lg p-4 flex flex-col justify-between border border-slate-100">
              {/* Complex SVG representation */}
              <div className="flex-1 flex gap-2 justify-between items-end relative h-40">
                {WEEKLY_TREND.map((day, dIdx) => {
                  const maxVal = 180;
                  const percentHeight = (day.appointments / maxVal) * 100;
                  return (
                    <div key={dIdx} className="flex-1 flex flex-col hover:bg-slate-200/50 rounded-md p-1 items-center justify-end h-full font-mono text-[9px] transition-colors">
                      {/* Bar 1 */}
                      <div className="w-full flex justify-center gap-1 h-32 items-end">
                        <div className="w-3 bg-blue-600 hover:bg-blue-500 rounded-t-sm transition-colors" style={{ height: `${percentHeight}%` }} title={`挂号在诊：${day.appointments}`} />
                        <div className="w-3 bg-blue-300 hover:bg-blue-200 rounded-t-sm transition-colors" style={{ height: `${(day.consultations/maxVal)*150}%` }} title={`在线问诊：${day.consultations}`} />
                      </div>

                      <span className="text-[10px] text-slate-600 block pt-1.5 font-sans font-bold">{day.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 items-center justify-center text-[10px] text-slate-550 font-sans border-t border-slate-200 pt-2 text-center font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-600 rounded-sm block" /> 门诊预约在诊负荷</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-300 rounded-sm block" /> 在线互联网问诊接待数</span>
              </div>
            </div>
          </div>

          {/* Department Workloads breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4.5 space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-1.5">
              <PieChart size={18} className="text-blue-600" />
              全院各病区挂号工作负荷占比分布 (今日)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div className="space-y-3.5">
                {DEPARTMENT_STATS.slice(0, 3).map((dep, pos) => (
                  <div key={pos} className="space-y-1.5 font-sans">
                    <div className="flex justify-between text-slate-700">
                      <strong className="text-slate-800">{dep.name}</strong>
                      <span className="font-mono text-slate-500 font-bold">{dep.count} 人 / {dep.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dep.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 text-xs font-sans">
                {DEPARTMENT_STATS.slice(3).map((dep, pos) => (
                  <div key={pos} className="space-y-1.5 font-sans">
                    <div className="flex justify-between text-slate-700">
                      <strong className="text-slate-800">{dep.name}</strong>
                      <span className="font-mono text-slate-500 font-bold">{dep.count} 人 / {dep.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${dep.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Leaders table Performance rating rank */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-1.5">
              <Award size={18} className="text-blue-600" />
              本周杰出医生接待与绩评 (TOP 5)
            </h3>

            <div className="space-y-3.5">
              {DOCTOR_LEADERBOARD.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-sans hover:bg-slate-50 p-2.5 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded bg-slate-900 font-mono font-bold flex items-center justify-center text-white text-[11px]">{idx+1}</span>
                    <div className="font-sans">
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{doc.title} • {doc.department}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-slate-700">
                    <strong className="block text-slate-900">{doc.consultations} 例</strong>
                    <span className="text-[10px] text-blue-600 font-bold block pt-0.5">★ {doc.score}分</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Clinical Efficiency */}
          <div className="bg-blue-50/40 text-slate-800 p-5 rounded-xl border border-blue-150 shadow-sm space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-blue-300" />
              <h4 className="font-sans font-bold text-sm">AI 临床决策质量审计报告</h4>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              ● 本月全院由 AI 提供辅助的前置预检卡通过率达到 <strong className="text-blue-700 font-extrabold">91.4%</strong>，漏检率比去年同期下降了 <strong className="text-blue-700 font-extrabold">4.2%</strong>。
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              * 数据由质量控制中心与慢病管委会联合监督校验发布，旨在保障医疗电子单据的绿色流向标准。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
