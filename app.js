const views = [...document.querySelectorAll('.view')];
const navItems = [...document.querySelectorAll('.nav-item')];
const title = document.getElementById('viewTitle');
const subtitle = document.getElementById('viewSubtitle');
const toast = document.getElementById('toast');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const roleText = document.getElementById('userRoleText');

function showToast(text){toast.textContent=text;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2300)}
function openModal(t, text){modalTitle.textContent=t;modalText.textContent=text;modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}
function switchView(id){
  const view = document.getElementById(id); if(!view) return;
  views.forEach(v=>v.classList.toggle('active',v.id===id));
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.view===id));
  title.textContent = view.dataset.title || id;
  subtitle.textContent = view.dataset.subtitle || '';
  history.replaceState(null,'','#'+id);
  window.scrollTo({top:0,behavior:'smooth'});
}

document.addEventListener('click', e=>{
  const viewBtn = e.target.closest('[data-view]');
  if(viewBtn){ switchView(viewBtn.dataset.view); return; }
  const actionBtn = e.target.closest('[data-action]');
  if(!actionBtn) return;
  const action = actionBtn.dataset.action;
  const actionMap = {
    help:['系统帮助','本原型用于课程展示。左侧导航可切换页面；地图页可模拟空间查询；模型页可查看演示模型审计。'],
    date:['时间范围','当前固定展示 2023-07-28 至 2023-08-03 极端降雨事件窗口。'],
    export:['导出提示','静态原型未连接后端，导出按钮仅用于展示交互效果。'],
    notice:['消息中心','暂无新的系统消息。'],
    profile:['用户信息','当前身份为演示用户，可在登录卡片中切换研究人员或管理员。'],
    forgot:['密码找回','课程原型不提供真实账号服务。'],
    captcha:['验证码刷新','验证码已刷新为 7G4X。'],
    workflow:['评价流程','流程为：数据准备 → 因子处理 → 模型训练 → 易发性计算 → 结果输出。'],
    uncertainty:['不确定性说明','不确定性来源包括滑坡清单完整性、因子空间分辨率、负样本采样策略和模型参数选择。'],
    spatialQuery:['空间查询完成','已框选平谷区并生成 6 条区域查询结果。'],
    clearSelection:['清除选择','地图选区已清除。再次点击“开始空间查询”可恢复演示结果。'],
    regionDetail:['区域详情','平谷区处于较高易发区，主要贡献因子为降雨因子、坡度因子和地形起伏度。'],
    attributeQuery:['属性查询','已打开选中区域的属性摘要。'],
    exportSelection:['导出选区','已模拟导出当前选区范围。'],
    bufferAnalysis:['缓冲区分析','已模拟生成 500 m 缓冲区分析结果。'],
    exportRegion:['导出结果','已模拟导出平谷区查询结果。'],
    exportTable:['导出表格','已模拟导出查询结果表格。'],
    clearTable:['清空结果','演示表格保留显示，不实际清空。'],
    modelDetail:['模型详情','RUN079R_B 为当前推荐展示模型，最终指标应以论文复核结果替换。'],
    exportAudit:['模型审计导出','已模拟导出模型运行审计表。'],
    upload:['数据校验','已完成模拟校验：字段完整、坐标系统一、缺失值比例可接受。'],
    refreshData:['刷新目录','数据资产目录已刷新。'],
    previewData:['数据预览','已打开静态数据预览窗口。'],
    downloadDoc:['报告导出','已模拟导出课程报告 DOCX。'],
    downloadMap:['地图导出','已模拟导出易发性分区图 PNG。'],
    downloadAudit:['审计表导出','已模拟导出模型审计表 CSV。'],
    downloadDict:['数据字典导出','已模拟导出数据字典 XLSX。']
  };
  if(action==='closeModal'){closeModal();return}
  if(action==='togglePassword'){
    const input = actionBtn.parentElement.querySelector('input');
    input.type = input.type === 'password' ? 'text' : 'password';
    showToast(input.type === 'text' ? '密码已显示' : '密码已隐藏'); return;
  }
  if(action==='collapseLegend'){
    const panel = actionBtn.closest('.legend-panel'); panel.classList.toggle('collapsed');
    panel.querySelectorAll('span').forEach(s=>s.style.display = panel.classList.contains('collapsed')?'none':'block');
    actionBtn.textContent = panel.classList.contains('collapsed')?'展开':'收起'; return;
  }
  if(action==='toggleFactors'){
    const labels = actionBtn.parentElement.querySelectorAll('label');
    labels.forEach(l=>l.style.display = l.style.display==='none'?'flex':'none');
    showToast('因子图层列表已切换'); return;
  }
  const content = actionMap[action];
  if(content) openModal(content[0], content[1]);
});

document.getElementById('loginForm').addEventListener('submit', e=>{
  e.preventDefault();
  roleText.textContent = document.querySelector('.role-tabs button.active').dataset.role;
  showToast('登录成功，正在进入数字大厅');
  setTimeout(()=>switchView('dashboard'),500);
});

document.querySelectorAll('.role-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.role-tabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`已切换为${btn.dataset.role}身份`);
}));

document.querySelectorAll('.tabbar button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`已切换到：${btn.textContent}`);
}));

document.getElementById('globalSearch').addEventListener('keydown', e=>{
  if(e.key==='Enter'){
    const q=e.currentTarget.value.trim();
    if(q.includes('地图')||q.includes('平谷')||q.includes('门头沟')) switchView('map');
    else if(q.includes('模型')||q.includes('XGBoost')) switchView('model');
    else if(q.includes('报告')) switchView('report');
    else showToast('未匹配到具体页面，可使用左侧导航切换。');
  }
});

document.getElementById('inventoryToggle')?.addEventListener('change',e=>{
  document.querySelectorAll('.inventory-points').forEach(g=>g.style.opacity=e.target.checked?'1':'.1');
  showToast(e.target.checked?'已显示历史滑坡点':'已隐藏历史滑坡点');
});
document.getElementById('uncertaintyToggle')?.addEventListener('change',e=>{
  document.querySelector('.selection-region').style.strokeDasharray=e.target.checked?'8 6':'none';
  showToast(e.target.checked?'已显示不确定性图层':'已隐藏不确定性图层');
});

modal.addEventListener('click',e=>{if(e.target===modal) closeModal()});
window.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal()});

const initial = location.hash.replace('#','');
if(initial && document.getElementById(initial)) switchView(initial);
