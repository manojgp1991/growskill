import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
interface Subscription {
  co: string;
  plan: string;
  users: number;
  start: Date;
  end: Date;
  bg: string;
}
@Component({
  selector: 'app-supper-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './supper-admin-dashboard.html',
  styleUrl: './supper-admin-dashboard.css',
})
export class SupperAdminDashboard implements OnInit {
  @ViewChild('barChart')   barChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart')  lineChartRef!:  ElementRef<HTMLCanvasElement>;

  today = new Date();

  subs: Subscription[] = [];
  cookieUserData: any = {};
  constructor( 
    private _cookieService: CookieStorageService
  ) {
    this.cookieUserData = this._cookieService.getUser();
   }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.buildSubs();
  }
 ngAfterViewInit(): void {
    this.drawDonut();
    this.drawBar();
    this.drawLine();
  }

  // ── Helpers ───────────────────────────────────────────────
  addDays(d: Date, n: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  fmtD(d: Date): string {
    const p = d.toISOString().split('T')[0].split('-');
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${p[2]} ${m[+p[1] - 1]} ${p[0]}`;
  }

  dLeft(d: Date): number {
    const e = new Date(d); e.setHours(0, 0, 0, 0);
    return Math.round((e.getTime() - this.today.getTime()) / 86400000);
  }

  dLabel(d: Date): { text: string; color: string } {
    const days = this.dLeft(d);
    if (days < 0)   return { text: `${Math.abs(days)}d ago`, color: '#F87171' };
    if (days <= 30) return { text: `${days}d`,               color: '#FCD34D' };
    return               { text: `${days}d`,                 color: '#34D399' };
  }

  statusPill(d: Date): { label: string; cls: string } {
    const days = this.dLeft(d);
    if (days < 0)   return { label: 'Expired',   cls: 'pill-expired'  };
    if (days <= 30) return { label: 'Expiring',  cls: 'pill-expiring' };
    return               { label: 'Active',    cls: 'pill-active'   };
  }

  planCls(plan: string): string {
    if (plan === 'Enterprise') return 'plan-tag ent';
    if (plan === 'Pro')        return 'plan-tag pro';
    return 'plan-tag';
  }

  avatar(co: string): string {
    return co.slice(0, 2).toUpperCase();
  }

  // ── Build Data ────────────────────────────────────────────
  buildSubs(): void {
    this.subs = [
      { co: 'Innovate Technologies', plan: 'Pro',        users: 10, start: this.addDays(this.today, -60),  end: this.addDays(this.today, 305), bg: '#8B5CF6' },
      { co: 'Shah Enterprises',      plan: 'Starter',    users: 3,  start: this.addDays(this.today, -10),  end: this.addDays(this.today, 20),  bg: '#3B82F6' },
      { co: 'Global Realty Group',   plan: 'Enterprise', users: 50, start: this.addDays(this.today, -200), end: this.addDays(this.today, -10), bg: '#EF4444' },
      { co: 'BizPlus Solutions',     plan: 'Pro',        users: 8,  start: this.addDays(this.today, -90),  end: this.addDays(this.today, 275), bg: '#00C8A0' },
      { co: 'Nexus Technologies',    plan: 'Pro',        users: 12, start: this.addDays(this.today, -5),   end: this.addDays(this.today, 24),  bg: '#F59E0B' },
      { co: 'DataSoft India',        plan: 'Enterprise', users: 25, start: this.addDays(this.today, -30),  end: this.addDays(this.today, 28),  bg: '#EC4899' },
      { co: 'PixelWave Studios',     plan: 'Starter',    users: 3,  start: this.addDays(this.today, -120), end: this.addDays(this.today, 245), bg: '#10B981' },
      { co: 'Apex Ventures',         plan: 'Starter',    users: 2,  start: this.addDays(this.today, -370), end: this.addDays(this.today, -3),  bg: '#EF4444' },
    ];
  }

  // ── Donut Chart ───────────────────────────────────────────
  drawDonut(): void {
    const c   = this.donutChartRef.nativeElement;
    const cx  = c.getContext('2d')!;
    const cx_ = c.width / 2, cy_ = c.height / 2, r = 42, iR = 26;
    const data = [{ v: 18, col: '#00C8A0' }, { v: 4, col: '#F59E0B' }, { v: 2, col: '#EF4444' }];
    const total = data.reduce((a, b) => a + b.v, 0);
    let start = -Math.PI / 2;

    data.forEach(d => {
      const sweep = (d.v / total) * Math.PI * 2;
      cx.beginPath();
      cx.moveTo(cx_, cy_);
      cx.arc(cx_, cy_, r, start, start + sweep);
      cx.closePath();
      cx.fillStyle = d.col;
      cx.fill();
      start += sweep;
    });

    cx.beginPath();
    cx.arc(cx_, cy_, iR, 0, Math.PI * 2);
    cx.fillStyle = '#0F1E35';
    cx.fill();

    cx.fillStyle = '#fff';
    cx.font = 'bold 18px Syne,sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText('24', cx_, cy_ - 6);
    cx.font = '10px Space Grotesk,sans-serif';
    cx.fillStyle = 'rgba(255,255,255,.35)';
    cx.fillText('clients', cx_, cy_ + 9);
  }

  // ── Bar Chart ─────────────────────────────────────────────
  drawBar(): void {
    const canvas = this.barChartRef.nativeElement;
    const dpr    = window.devicePixelRatio || 1;
    const rect   = { width: canvas.parentElement!.offsetWidth || 400, height: 200 };
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;

    const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];
    const newSubs = [2,3,4,2,5,3,4];
    const renewed = [1,2,1,3,2,4,3];
    const pad     = { t: 12, b: 32, l: 30, r: 16 };
    const chartH  = H - pad.t - pad.b;
    const chartW  = W - pad.l - pad.r;
    const maxVal  = 10;
    const grpW    = chartW / months.length;
    const barW    = grpW * 0.3;

    for (let i = 0; i <= 4; i++) {
      const y = pad.t + chartH - (i / 4) * chartH;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,.05)';
      ctx.lineWidth = 1;
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.font = '9px Space Grotesk,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.round((i / 4) * maxVal)), pad.l - 5, y + 3);
    }

    months.forEach((m, i) => {
      const x    = pad.l + i * grpW + grpW / 2;
      const n    = newSubs[i], re = renewed[i];
      const hN   = (n / maxVal) * chartH, hR = (re / maxVal) * chartH;
      const x1   = x - barW - 2, x2 = x + 2;
      const yBase = pad.t + chartH;

      const gN = ctx.createLinearGradient(0, yBase - hN, 0, yBase);
      gN.addColorStop(0, '#00C8A0'); gN.addColorStop(1, 'rgba(0,200,160,.3)');
      ctx.fillStyle = gN;
      ctx.beginPath();
      ctx.roundRect(x1, yBase - hN, barW, hN, 3);
      ctx.fill();

      const gR = ctx.createLinearGradient(0, yBase - hR, 0, yBase);
      gR.addColorStop(0, '#3B82F6'); gR.addColorStop(1, 'rgba(59,130,246,.3)');
      ctx.fillStyle = gR;
      ctx.beginPath();
      ctx.roundRect(x2, yBase - hR, barW, hR, 3);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.font = '10px Space Grotesk,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m, x, H - pad.b + 14);
    });

    ctx.fillStyle = '#00C8A0'; ctx.fillRect(W - pad.r - 90, 8, 10, 8);
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '10px Space Grotesk,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('New', W - pad.r - 76, 16);
    ctx.fillStyle = '#3B82F6'; ctx.fillRect(W - pad.r - 45, 8, 10, 8);
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.fillText('Renewed', W - pad.r - 31, 16);
  }

  // ── Line Chart ────────────────────────────────────────────
  drawLine(): void {
    const canvas = this.lineChartRef.nativeElement;
    const dpr    = window.devicePixelRatio || 1;
    const rect   = { width: canvas.parentElement!.offsetWidth || 800, height: 170 };
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;

    const labels = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'];
    const data   = [95000,108000,115000,122000,140000,132000,148000,155000,162000,170000,175000,182000];
    const pad    = { t: 14, b: 30, l: 54, r: 20 };
    const cH = H - pad.t - pad.b, cW = W - pad.l - pad.r;
    const maxV = 200000;
    const step = cW / (labels.length - 1);

    for (let i = 0; i <= 4; i++) {
      const y = pad.t + cH - (i / 4) * cH;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,.05)';
      ctx.lineWidth = 1;
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.font = '9px Space Grotesk,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${i * 50}K`, pad.l - 6, y + 3);
    }

    const pts = data.map((v, i) => ({
      x: pad.l + i * step,
      y: pad.t + cH - (v / maxV) * cH
    }));

    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + cH);
    grad.addColorStop(0, 'rgba(0,200,160,.25)');
    grad.addColorStop(1, 'rgba(0,200,160,0)');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      if (i === 0) return;
      const prev = pts[i - 1];
      const cpx  = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
    });
    ctx.lineTo(pts[pts.length - 1].x, pad.t + cH);
    ctx.lineTo(pts[0].x, pad.t + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#00C8A0';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      if (i === 0) return;
      const prev = pts[i - 1];
      const cpx  = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
    });
    ctx.stroke();

    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00C8A0'; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#0F1E35'; ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.font = '9px Space Grotesk,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], p.x, H - pad.b + 14);
    });
  }
  
}
