// ============================================================
// GROWSKILL CRM — Shared Data, Auth & Nav Builder
// Include this script in every page BEFORE page-specific JS
// ============================================================

// ── SEED DATA ────────────────────────────────────────────────
const CRM_USERS = [
  {id:1,name:"Rajesh Kumar",  email:"rajesh@growskill.in",role:"super_admin",avatar:"RK",color:"#00C8A0",password:"admin123"},
  {id:2,name:"Priya Sharma",  email:"priya@growskill.in", role:"admin",      avatar:"PS",color:"#8B5CF6",password:"admin123"},
  {id:3,name:"Amit Singh",    email:"amit@growskill.in",  role:"sales",      avatar:"AS",color:"#3B82F6",password:"sales123"},
  {id:4,name:"Neha Verma",    email:"neha@growskill.in",  role:"sales",      avatar:"NV",color:"#EC4899",password:"sales123"},
  {id:5,name:"Vikram Patel",  email:"vikram@growskill.in",role:"viewer",     avatar:"VP",color:"#F59E0B",password:"view123"},
];

const CRM_CONTACTS_KEY = "crm_contacts";
const CRM_USERS_KEY    = "crm_users_data";

const SEED_CONTACTS = [
  {id:1, name:"Suresh Mehta",     email:"suresh@techcorp.in",   phone:"+91 98765 43210",company:"TechCorp India",  status:"lead",      assignedTo:3,createdAt:"2024-01-15",comments:[]},
  {id:2, name:"Kavita Nair",      email:"kavita@innovate.co",   phone:"+91 87654 32109",company:"Innovate Co",    status:"contacted", assignedTo:3,createdAt:"2024-01-16",comments:[{text:"Called – very interested.",user:"Amit Singh",time:"2024-01-17 10:00"}]},
  {id:3, name:"Manish Gupta",     email:"manish@globaltech.com",phone:"+91 76543 21098",company:"Global Tech",    status:"qualified", assignedTo:4,createdAt:"2024-01-17",comments:[]},
  {id:4, name:"Deepa Joshi",      email:"deepa@startup.io",     phone:"+91 65432 10987",company:"StartUp.io",    status:"proposal",  assignedTo:4,createdAt:"2024-01-18",comments:[]},
  {id:5, name:"Ravi Shankar",     email:"ravi@bizplus.in",      phone:"+91 54321 09876",company:"BizPlus",       status:"won",       assignedTo:3,createdAt:"2024-01-19",comments:[{text:"Deal closed – ₹1.2L signed!",user:"Amit Singh",time:"2024-01-25 14:30"}]},
  {id:6, name:"Anita Desai",      email:"anita@ventures.co",    phone:"+91 43210 98765",company:"Ventures Co",   status:"lost",      assignedTo:4,createdAt:"2024-01-20",comments:[]},
  {id:7, name:"Sanjay Bose",      email:"sanjay@enterprise.in", phone:"+91 32109 87654",company:"Enterprise Ltd",status:"lead",      assignedTo:3,createdAt:"2024-01-21",comments:[]},
  {id:8, name:"Pooja Chatterjee", email:"pooja@digitalx.com",   phone:"+91 21098 76543",company:"DigitalX",     status:"contacted", assignedTo:4,createdAt:"2024-01-22",comments:[]},
  {id:9, name:"Arjun Reddy",      email:"arjun@cloud9.in",      phone:"+91 91234 56780",company:"Cloud9",       status:"qualified", assignedTo:3,createdAt:"2024-01-23",comments:[]},
  {id:10,name:"Meena Krishnan",   email:"meena@nexus.io",       phone:"+91 81234 56789",company:"Nexus IO",     status:"proposal",  assignedTo:4,createdAt:"2024-01-24",comments:[]},
  {id:11,name:"Rahul Ahuja",      email:"rahul@pixelworks.in",  phone:"+91 71234 56789",company:"PixelWorks",   status:"lead",      assignedTo:3,createdAt:"2024-01-25",comments:[]},
  {id:12,name:"Sunita Malhotra",  email:"sunita@datasys.com",   phone:"+91 61234 56789",company:"DataSys",      status:"won",       assignedTo:4,createdAt:"2024-01-26",comments:[]},
];

// ── Storage helpers ───────────────────────────────────────────
function getContacts(){ const d=sessionStorage.getItem(CRM_CONTACTS_KEY); return d?JSON.parse(d):[...SEED_CONTACTS]; }
function saveContacts(c){ sessionStorage.setItem(CRM_CONTACTS_KEY,JSON.stringify(c)); }
function getUsers(){ const d=sessionStorage.getItem(CRM_USERS_KEY); return d?JSON.parse(d):[...CRM_USERS]; }
function saveUsers(u){ sessionStorage.setItem(CRM_USERS_KEY,JSON.stringify(u)); }
function getCurrentUser(){ const d=sessionStorage.getItem('crm_user'); return d?JSON.parse(d):null; }

// ── Auth guard ────────────────────────────────────────────────
function requireAuth(){
  const u=getCurrentUser();
  if(!u){ window.location.href='login.html'; return null; }
  return u;
}
function isAdmin(u){ return ['super_admin','admin'].includes(u?.role); }
function canEdit(u){ return ['super_admin','admin','sales'].includes(u?.role); }

// ── Status/Role meta ──────────────────────────────────────────
const STATUS_META={
  lead:     {label:"Lead",     color:"#8B5CF6",bg:"rgba(139,92,246,.13)"},
  contacted:{label:"Contacted",color:"#3B82F6",bg:"rgba(59,130,246,.13)"},
  qualified:{label:"Qualified",color:"#F59E0B",bg:"rgba(245,158,11,.13)"},
  proposal: {label:"Proposal", color:"#EC4899",bg:"rgba(236,72,153,.13)"},
  won:      {label:"Won",      color:"#10B981",bg:"rgba(16,185,129,.13)"},
  lost:     {label:"Lost",     color:"#EF4444",bg:"rgba(239,68,68,.13)"},
};
const ROLE_META={
  super_admin:{label:"Super Admin",color:"#00C8A0"},
  admin:      {label:"Admin",      color:"#8B5CF6"},
  sales:      {label:"Sales",      color:"#3B82F6"},
  viewer:     {label:"Viewer",     color:"#64748B"},
};

function statusBadgeHTML(status){
  const m=STATUS_META[status]||{label:status,color:"#64748B",bg:"#f1f5f9"};
  return `<span class="badge" style="background:${m.bg};color:${m.color}"><span style="width:6px;height:6px;border-radius:50%;background:${m.color};display:inline-block"></span> ${m.label}</span>`;
}
function roleBadgeHTML(role){
  const m=ROLE_META[role]||{label:role,color:"#64748B"};
  return `<span class="badge" style="background:${m.color}18;color:${m.color}">${m.label}</span>`;
}
function avatarHTML(name,color,size=34){
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,${color},${color}88);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${Math.round(size*.3)}px;flex-shrink:0">${(name||'?').slice(0,2).toUpperCase()}</div>`;
}
function showToast(msg,type='success'){
  const t=document.createElement('div');
  t.className=`alert alert-${type}`;
  t.style.cssText='position:fixed;bottom:22px;right:22px;z-index:9999;min-width:250px;box-shadow:0 8px 28px rgba(0,0,0,.18);animation:slideUp .3s ease';
  const icons={success:'ri-checkbox-circle-line',error:'ri-error-warning-line',warning:'ri-alert-line',info:'ri-information-line'};
  t.innerHTML=`<i class="${icons[type]||icons.info}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

// ── Build Sidebar ─────────────────────────────────────────────
function buildSidebar(activePage){
  const user=getCurrentUser();
  if(!user) return;
  const admin=isAdmin(user);
  const NAV=[
    {page:'dashboard',     icon:'ri-dashboard-2-line',     label:'Dashboard',     section:'main'},
    {page:'contacts',      icon:'ri-contacts-book-2-line', label:'Contacts',      section:'main'},
    {page:'pipeline',      icon:'ri-kanban-view-line',      label:'Pipeline',      section:'main'},
    {page:'bulk-import',   icon:'ri-upload-cloud-2-line',  label:'Bulk Import',   section:'manage', adminOnly:true},
    {page:'user-management',icon:'ri-team-line',           label:'Users',         section:'manage', adminOnly:true},
    {page:'settings',      icon:'ri-settings-3-line',      label:'Settings',      section:'system', adminOnly:true},
  ];
  const contacts=getContacts();
  const secs=[['main','Main'],['manage','Management'],['system','System']];
  let html=`
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">GS</div>
      <div class="sidebar-logo-text"><strong>GrowSkill</strong><span>CRM Platform</span></div>
    </div>
    <nav class="sidebar-nav">`;
  secs.forEach(([sec,lbl])=>{
    const items=NAV.filter(n=>n.section===sec&&(admin||!n.adminOnly));
    if(!items.length) return;
    html+=`<div class="nav-section-label">${lbl}</div>`;
    items.forEach(n=>{
      const active=activePage===n.page;
      html+=`<a class="nav-item${active?' active':''}" href="${n.page}.html" data-page="${n.page}">
        <i class="${n.icon}"></i> ${n.label}
        ${n.page==='contacts'?`<span class="nav-badge">${contacts.length}</span>`:''}
      </a>`;
    });
  });
  html+=`</nav>
    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="handleLogout()">
        ${avatarHTML(user.name,user.color,34)}
        <div class="user-info">
          <strong>${user.name}</strong>
          <span>${ROLE_META[user.role]?.label||user.role}</span>
        </div>
        <i class="ri-logout-box-r-line user-menu-btn"></i>
      </div>
    </div>`;
  document.getElementById('sidebar').innerHTML=html;
}

function buildTopbar(title,subtitle){
  const user=getCurrentUser();
  document.getElementById('topbar-title').textContent=title;
  document.getElementById('topbar-sub').textContent=subtitle;
  if(user){
    const av=document.getElementById('topbar-avatar');
    if(av){av.textContent=user.avatar;av.style.background=`linear-gradient(135deg,${user.color},${user.color}88)`;}
  }
}

function handleLogout(){
  sessionStorage.removeItem('crm_user');
  window.location.href='login.html';
}

function exportContactsCSV(){
  const contacts=getContacts();
  const users=getUsers();
  const rows=[['Name','Email','Phone','Company','Status','Assigned To','Created']];
  contacts.forEach(c=>{
    const u=users.find(u=>u.id===c.assignedTo);
    rows.push([c.name,c.email,c.phone,c.company,c.status,u?u.name:'',c.createdAt]);
  });
  const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv,'+encodeURIComponent(csv);
  a.download='growskill_contacts.csv';
  a.click();
  showToast('Contacts exported as CSV');
}

// Add slide-up animation
const _s=document.createElement('style');
_s.textContent='@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}';
document.head.appendChild(_s);
