import { Patient, DrugItem, Prescription, TriageStepData } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: '2026090501',
    name: '张三',
    gender: '男',
    age: 45,
    phone: '13812345678',
    avatarColor: 'bg-emerald-500',
    chiefComplaint: '反复上腹痛伴反酸2周，加重2天',
    diagnosis: '慢性胃炎伴糜烂',
    status: '接诊中',
    lastVisit: '2026-06-08',
    allergy: '青霉素过敏',
    bloodType: 'O型',
    medicalHistory: '高血压病史3年，规律服用氨氯地平，控制良好。自述平日工作压力大，饮食不规律。',
    pastHistory: '无重大手术外伤史。有青霉素过敏史。',
    symptoms: '剑突下偏左轻度压痛，无反跳痛及肌紧张，肝脾未触及。胃镜检查见胃窦黏膜多发斑片状充血、糜烂，伴散在浅表小溃疡。'
  },
  {
    id: '2026090502',
    name: '李思',
    gender: '女',
    age: 32,
    phone: '13987654321',
    avatarColor: 'bg-blue-500',
    chiefComplaint: '眩晕伴恶心、呕吐1天，活动时加重',
    diagnosis: '良性阵发性位置性眩晕 (BPPV)',
    status: '待诊',
    lastVisit: '2026-06-08',
    allergy: '无已知药物过敏史',
    bloodType: 'A型',
    medicalHistory: '既往身体健康，发病前有持续加班劳累史，夜间睡眠差。',
    pastHistory: '无慢性病史。无手术史。',
    symptoms: 'Dix-Hallpike试验阳性，伴旋转向上向患侧眼震。无耳鸣、耳聋及神经系统定位体征。'
  },
  {
    id: '2026090503',
    name: '李建国',
    gender: '男',
    age: 54,
    phone: '13555556666',
    avatarColor: 'bg-amber-500',
    chiefComplaint: '活动后胸闷、气促3个月，突发剧烈胸痛3小时',
    diagnosis: '急性冠脉综合征可能性大',
    status: '待诊',
    lastVisit: '2026-06-08',
    allergy: '磺胺类药物过敏',
    bloodType: 'B型',
    medicalHistory: '吸烟史30年，每日20支。血脂异异常5年，未规律服药。',
    pastHistory: '无重大手术史，无高血压、糖尿病史。',
    symptoms: '前胸骨后剧烈绞痛，向左侧肩背部放射，大汗淋漓，舌下含服硝酸甘油未能缓解。'
  },
  {
    id: '2026090504',
    name: '赵六',
    gender: '女',
    age: 58,
    phone: '13700001111',
    avatarColor: 'bg-blue-500',
    chiefComplaint: '多饮、多尿伴下肢麻木发凉半年',
    diagnosis: '2型糖尿病合并周围神经病变',
    status: '已结案',
    lastVisit: '2026-06-01',
    allergy: '无过敏史',
    bloodType: 'AB型',
    medicalHistory: '发现血糖升高5年，口服二甲双胍片控制，空腹血糖近期波差较大。',
    pastHistory: '3年前行阑尾切除术。',
    symptoms: '双足背动脉搏动减弱，膝腱反射减退，双下肢痛温觉呈对称性袜套样减退。'
  },
  {
    id: '2026090505',
    name: '陈晓明',
    gender: '男',
    age: 45,
    phone: '18677778888',
    avatarColor: 'bg-purple-500',
    chiefComplaint: '间歇性右下腹痛半年，突发加剧伴发热4小时',
    diagnosis: '急性阑尾炎',
    status: '回访中',
    lastVisit: '2026-06-05',
    allergy: '头孢类药物过敏',
    bloodType: 'O型',
    medicalHistory: '过往经常由于不规律饮食导致腹痛、消化不良。',
    pastHistory: '无其他病史。',
    symptoms: '转移性右下腹痛。麦氏点（McBurney point）明显压痛、反跳痛，伴局部肌紧张。血常规：白细胞计数 14.5 * 10^9/L ↑'
  }
];

export const DRUG_DIRECTORY: DrugItem[] = [
  { id: 'd1', name: '奥美拉唑肠溶胶囊', spec: '20mg * 14粒/盒', dosage: '20mg', frequency: '1次/日', route: '口服 (餐前)', count: 2 },
  { id: 'd2', name: '枸橼酸铋钾胶囊', spec: '300mg * 24粒/盒', dosage: '300mg', frequency: '2次/日', route: '口服 (餐前)', count: 2 },
  { id: 'd3', name: '多潘立酮片 (吗丁啉)', spec: '10mg * 30片/盒', dosage: '10mg', frequency: '3次/日', route: '口服 (餐前)', count: 1 },
  { id: 'd4', name: '盐酸氨氯地平片 (络活喜)', spec: '5mg * 7片/盒', dosage: '5mg', frequency: '1次/日', route: '口服', count: 1 },
  { id: 'd5', name: '阿司匹林肠溶片', spec: '100mg * 30片/瓶', dosage: '100mg', frequency: '1次/日', route: '口服 (餐前)', count: 1 },
  { id: 'd6', name: '二甲双胍缓释片', spec: '500mg * 30片/盒', dosage: '500mg', frequency: '2次/日', route: '口服 (餐后)', count: 3 },
  { id: 'd7', name: '阿托伐他汀钙片 (立普妥)', spec: '20mg * 7片/盒', dosage: '20mg', frequency: '1次/夜', route: '口服', count: 2 },
  { id: 'd8', name: '蒙脱石散 (思密达)', spec: '3g * 10袋/盒', dosage: '3g', frequency: '3次/日', route: '冲服', count: 1 }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX20260608001',
    patientId: '2026090501',
    patientName: '张三',
    age: 45,
    gender: '男',
    diagnosis: '慢性胃炎伴糜烂(幽门螺杆菌阴性)',
    drugs: [
      { id: 'd1', name: '奥美拉唑肠溶胶囊', spec: '20mg * 14粒/盒', dosage: '20mg', frequency: '1次/日', route: '口服 (餐前)', count: 2 },
      { id: 'd3', name: '多潘立酮片 (吗丁啉)', spec: '10mg * 30片/盒', dosage: '10mg', frequency: '3次/日', route: '口服 (餐前)', count: 1 }
    ],
    date: '2026-06-08',
    status: '已下达',
    signature: '张伟明'
  },
  {
    id: 'RX20260608002',
    patientId: '2026090504',
    patientName: '赵六',
    age: 58,
    gender: '女',
    diagnosis: '2型糖尿病伴周围神经病变',
    drugs: [
      { id: 'd6', name: '二甲双胍缓释片', spec: '500mg * 30片/盒', dosage: '500mg', frequency: '2次/日', route: '口服 (餐后)', count: 2 }
    ],
    date: '2026-06-01',
    status: '已下达',
    signature: '张伟明'
  }
];

export const CLINIC_STATS = {
  today: {
    appointments: 156,
    consultations: 98,
    revenue: 12850.5,
    followupRate: 82.5,
    activePatients: 78,
  },
  general: {
    totalPatients: 3520,
    totalAppointments: 8965,
    satisfactionRate: 94.3,
    aiCoadviseRate: 68.7,
  }
};

export const WEEKLY_TREND = [
  { day: '周一', appointments: 124, consultations: 78, revenue: 10450 },
  { day: '周二', appointments: 142, consultations: 92, revenue: 11800 },
  { day: '周三', appointments: 156, consultations: 98, revenue: 12850 },
  { day: '周四', appointments: 135, consultations: 88, revenue: 11200 },
  { day: '周五', appointments: 168, consultations: 104, revenue: 13900 },
  { day: '周六', appointments: 92, consultations: 52, revenue: 7600 },
  { day: '周日', appointments: 78, consultations: 45, revenue: 5900 }
];

export const DEPARTMENT_STATS = [
  { name: '消化内科', count: 124, percentage: 38 },
  { name: '神经内科', count: 86, percentage: 26 },
  { name: '心血管内科', count: 42, percentage: 13 },
  { name: '呼吸与危重症医学科', count: 38, percentage: 11 },
  { name: '普通外科', count: 24, percentage: 7 },
  { name: '儿科', count: 18, percentage: 5 }
];

export const DOCTOR_LEADERBOARD = [
  { name: '陈思雅', title: '副主任医师', department: '消化内科', consultations: 342, score: 9.8 },
  { name: '张伟明', title: '主任医师', department: '消化内科', consultations: 310, score: 9.9 },
  { name: '赵晓敏', title: '副主任医师', department: '神经内科', consultations: 295, score: 9.7 },
  { name: '李瑞', title: '主治医师', department: '心血管内科', consultations: 278, score: 9.6 },
  { name: '王健康', title: '主任医师', department: '呼吸内科', consultations: 260, score: 9.8 }
];

export const PRESET_CONSULTATION_MESSAGES: Record<string, {sender: 'doctor' | 'patient' | 'ai'; content: string; timestamp: string; isAiSuggested?: boolean}[]> = {
  '2026090501': [
    { sender: 'patient', content: '医生您好，最近两个星期上腹部总是反反复复疼，特别是空腹和夜间的时候，还会反酸，特别难受。', timestamp: '10:00' },
    { sender: 'doctor', content: '您好，上腹痛具体是在什么位置？是隐痛还是胀痛？吃东西后有没有缓解的迹象？', timestamp: '10:02' },
    { sender: 'patient', content: '就在肚脐眼上方偏左一点。稍微吃点苏打饼干好像就能缓解点，但是过一两个小时又开始痛。最近感觉反酸水很厉害，嘴里常有酸味。', timestamp: '10:04' },
    { sender: 'ai', content: '【AI辅助临床建议】：患者主诉胃黏膜刺痛、空腹及夜间上腹痛明显，且进食后有阶段性缓解，临床高度疑似十二指肠球部溃疡或慢性浅表性胃炎伴糜烂。首要鉴别点为是否存在幽门螺杆菌（Hp）感染。建议：1. 确认今日是否有血压波动或服药异常；2. 询问近期是否有柏油样黑便等出血迹象；3. 开具碳13/14尿素呼气试验及必要胃镜筛查。', timestamp: '10:05', isAiSuggested: true }
  ]
};
