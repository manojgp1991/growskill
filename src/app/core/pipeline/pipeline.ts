import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { ApiService } from '../../services/api-service/api.service';
import { InitialsPipe } from '../../services/pipe/initials-pipe';

export interface MstStatus {
  id: number;
  caption: string;
  description: string;
  color_code: string;
  sort_order: number;
  default_status: number;
}

export interface MstContact {
  id: number;
  status_id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_date: string;
}

export interface MstUserContact {
  id: number;
  assigned_to: number;
  contact_id: number;
}

export interface MstUser {
  id: number;
  name: string;
  color_code: string;
  avatar: string;
}

export interface PipelineContact {
  id: number;
  name: string;
  company: string;
  status_id: number;
  statusKey: string;       
  assignedTo: number | null;
  assignedName: string;
  createdAt: string;
}
@Component({
  selector: 'app-pipeline',
  imports: [CommonModule, InitialsPipe],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css',
})
export class Pipeline implements OnInit {
  cookieUserData: any = {};
  statusList:      MstStatus[]     = [];
  contactList:     MstContact[]    = [];
  userContactList: MstUserContact[]= [];
  userList:        MstUser[]       = [];
  pipelineContacts: PipelineContact[] = [];
  canEdit:  boolean      = true;
  dragId:   number | null = null;

  private apiSub?: Subscription;
  statusOrder: { key: string; label: string; color_code: string }[] = [];
    avatarGradients: string[] = [
    'linear-gradient(135deg,#00C8A0,#0099CC)',
    'linear-gradient(135deg,#F59E0B,#D97706)',
    'linear-gradient(135deg,#3B82F6,#1D4ED8)',
    'linear-gradient(135deg,#EC4899,#BE185D)'
  ];
  constructor(
        private _cookieService: CookieStorageService,
        private router: Router,
        private cdr: ChangeDetectorRef,
         private _apiService: ApiService,
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Pipeline');
  }
  ngOnInit(): void {
    this.loadFromApi();
    this.buildBoard();
  }
  getAvatarStyle(index: number) {
    return {
      width: '20px',
      height: '20px',
      fontSize: '.55rem',
      color:'#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: this.avatarGradients[index % this.avatarGradients.length]
    };
  }
  ngOnDestroy(): void {
    this.apiSub?.unsubscribe();
  }

  loadFromApi(): void {
    const payload = { 
      user_id: this.cookieUserData?.id,
      sub_id: this.cookieUserData?.subcriptionId 
    };
    this.apiSub = this._apiService.Post$(GrowSkillAPIEndPointPath.GetPipelineData, payload, true).subscribe({
      next: (res: any) => {
        this.cdr.markForCheck();
        if (res.status && res?.response?.ContactList?.length > 0) {
          this.statusList      = res.response?.StatusList      ?? [];
          this.contactList     = res.response?.ContactList     ?? [];
          this.userContactList = res.response?.UserContactList ?? [];
          this.userList        = res.response?.UserList        ?? [];
          this.buildBoard();
          this.cdr.markForCheck();
        }
      },
      error: () => this.cdr.markForCheck()
    });
  }

  buildBoard(): void {debugger
    this.cdr.markForCheck()
    this.statusOrder = [...this.statusList]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(s => ({
        key:   s.caption.toLowerCase(),
        label: s.caption,
        color_code: s.color_code
      }));

    this.pipelineContacts = this.contactList.map(c => {
      const status     = this.statusList.find(s => s.id === c.status_id);
      const userCont   = this.userContactList.find(uc => uc.contact_id === c.id);
      const assignedId = userCont?.assigned_to ?? null;
      const user       = assignedId ? this.userList.find(u => u.id === assignedId) : null;

      return {
        id:           c.id,
        name:         c.name,
        company:      c.company,
        status_id:    c.status_id,
        statusKey:    status?.caption.toLowerCase() ?? '',
        assignedTo:   assignedId,
        assignedName: user?.name ?? 'Unassigned',
        createdAt:    c.created_date
      } as PipelineContact;
    });

    this.cdr.markForCheck();
  }

  getContactsByStatus(statusKey: string): PipelineContact[] {
    return this.pipelineContacts.filter(c => c.statusKey === statusKey);
  }

  getUser(id: number | null): MstUser | undefined {
    if (!id) return undefined;
    return this.userList.find(u => u.id === id);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/contact-detail', id]);
  }

  // ── Drag & Drop ───────────────────────────────────────────
  onDragStart(event: DragEvent, id: number): void {
    this.dragId = id;
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.querySelector(`.pipeline-card[data-id="${id}"]`) as HTMLElement;
      if (el) el.style.opacity = '0.4';
    }, 0);
  }

  onDragEnd(event: DragEvent): void {
    (event.target as HTMLElement).style.opacity = '1';
  }

  onDragOver(event: DragEvent, statusKey: string): void {
    event.preventDefault();
    const col  = document.getElementById('col-' + statusKey);
    const meta = this.statusOrder.find(s => s.key === statusKey);
    if (col && meta) col.style.border = `2px dashed ${meta.color_code}`;
  }

  onDragLeave(statusKey: string): void {
    const col = document.getElementById('col-' + statusKey);
    if (col) col.style.border = '';
  }

  onDrop(event: DragEvent, newStatusKey: string): void {
    event.preventDefault();
    const col = document.getElementById('col-' + newStatusKey);
    if (col) col.style.border = '';
    if (this.dragId === null) return;

    const idx = this.pipelineContacts.findIndex(c => c.id === this.dragId);
    if (idx < 0) { this.dragId = null; return; }

    const oldStatusKey = this.pipelineContacts[idx].statusKey;
    if (oldStatusKey === newStatusKey) { this.dragId = null; return; }

    const newStatus = this.statusList.find(s => s.caption.toLowerCase() === newStatusKey);
    if (!newStatus) { this.dragId = null; return; }

    // Update local state
    this.pipelineContacts[idx] = {
      ...this.pipelineContacts[idx],
      statusKey: newStatusKey,
      status_id: newStatus.id
    };

    // TODO: call API to persist
    // this._apiService.Post$(GrowSkillAPIEndPointPath.UpdateContactStatus, {
    //   user_id:    this.cookieUserData?.userId,
    //   sub_id:     this.cookieUserData?.subcriptionId,
    //   contact_id: this.dragId,
    //   status_id:  newStatus.id
    // }, false).subscribe();

    this.dragId = null;
    this.cdr.markForCheck();
  }


}

