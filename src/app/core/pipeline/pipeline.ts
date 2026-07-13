import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { NavigationExtras, Router } from '@angular/router';
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
  internal_code: string;
  status_id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_date: string;
  sort_order: number;
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
  internal_code: string;
  name: string;
  company: string;
  status_id: number;
  statusKey: string;
  assignedTo: number | null;
  assignedName: string;
  createdAt: string;
  sort_order: number;
}
@Component({
  selector: 'app-pipeline',
  imports: [CommonModule, InitialsPipe],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css',
})
export class Pipeline implements OnInit {
  cookieUserData: any = {};
  statusList: MstStatus[] = [];
  contactList: MstContact[] = [];
  userContactList: MstUserContact[] = [];
  userList: MstUser[] = [];
  pipelineContacts: PipelineContact[] = [];
  canEdit: boolean = true;
  dragId: number | null = null;

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
    private cdr: ChangeDetectorRef,
    private _apiService: ApiService,
    private _router: Router
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
      color: '#fff',
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
          this.statusList = res.response?.StatusList ?? [];
          this.contactList = res.response?.ContactList ?? [];
          this.userContactList = res.response?.UserContactList ?? [];
          this.userList = res.response?.UserList ?? [];
          this.buildBoard();
          this.cdr.markForCheck();
        }
      },
      error: () => this.cdr.markForCheck()
    });
  }

  // buildBoard(): void {
  //   this.cdr.markForCheck()
  //   this.statusOrder = [...this.statusList]
  //     .sort((a, b) => a.sort_order - b.sort_order)
  //     .map(s => ({
  //       key: s.caption.toLowerCase(),
  //       label: s.caption,
  //       color_code: s.color_code
  //     }));

  //   this.pipelineContacts = this.contactList.map(c => {
  //     const status = this.statusList.find(s => s.id === c.status_id);
  //     const userCont = this.userContactList.find(uc => uc.contact_id === c.id);
  //     const assignedId = userCont?.assigned_to ?? null;
  //     const user = assignedId ? this.userList.find(u => u.id === assignedId) : null;

  //     if(user?.id) {
        
  //     }
  //     return {
  //       id: c.id,
  //       internal_code: c.internal_code,
  //       name: c.name,
  //       company: c.company,
  //       status_id: c.status_id,
  //       statusKey: status?.caption.toLowerCase() ?? '',
  //       assignedTo: assignedId,
  //       assignedName: user?.name ?? 'Unassigned',
  //       createdAt: c.created_date,
  //       sort_order: c.sort_order
  //     } as PipelineContact;
  //   });

  //   this.cdr.markForCheck();
  // }
buildBoard(): void {
  this.cdr.markForCheck()
  this.statusOrder = [...this.statusList]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(s => ({
      key: s.caption.toLowerCase(),
      label: s.caption,
      color_code: s.color_code
    }));

  this.pipelineContacts = this.contactList
    .filter(c => {
      // Admins (role_id === 2) see everything; others only see contacts assigned to them
      if (this.cookieUserData?.roleId === 2) return true;

      const userCont = this.userContactList.find(uc => uc.contact_id === c.id);
      return userCont?.assigned_to === this.cookieUserData?.id;
    })
    .map(c => {
      const status = this.statusList.find(s => s.id === c.status_id);
      const userCont = this.userContactList.find(uc => uc.contact_id === c.id);
      const assignedId = userCont?.assigned_to ?? null;
      const user = assignedId ? this.userList.find(u => u.id === assignedId) : null;

      return {
        id: c.id,
        internal_code: c.internal_code,
        name: c.name,
        company: c.company,
        status_id: c.status_id,
        statusKey: status?.caption.toLowerCase() ?? '',
        assignedTo: assignedId,
        assignedName: user?.name ?? 'Unassigned',
        createdAt: c.created_date,
        sort_order: c.sort_order
      } as PipelineContact;
    });

  this.cdr.markForCheck();
}
  getContactsByStatus(statusKey: string): PipelineContact[] {
    return this.pipelineContacts
      .filter(c => c.statusKey === statusKey)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  getUser(id: number | null): MstUser | undefined {
    if (!id) return undefined;
    return this.userList.find(u => u.id === id);
  }

  openContactDetail($event: any) {debugger
    var clickedContact: any = $event;
    let pdata = {
      internal_code: clickedContact.internal_code
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "pdata": JSON.stringify(pdata)
      }
    };
    this._router.navigate(['contacts-details'], navigationExtras);
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
    const col = document.getElementById('col-' + statusKey);
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

    const newStatus = this.statusList.find(s => s.caption.toLowerCase() === newStatusKey);
    if (!newStatus) { this.dragId = null; return; }

    // Move dragged card to new status
    this.pipelineContacts[idx] = {
      ...this.pipelineContacts[idx],
      statusKey: newStatusKey,
      status_id: newStatus.id
    };

    // Recalculate sort_order for the entire target column
    const reorderedColumn = this.pipelineContacts
      .filter(c => c.statusKey === newStatusKey)
      .map((c, i) => ({ ...c, sort_order: i + 1 }));

    // Update sort_order in pipelineContacts
    reorderedColumn.forEach(updated => {
      const i = this.pipelineContacts.findIndex(c => c.id === updated.id);
      if (i > -1) this.pipelineContacts[i] = updated;
    });

    const payload = {
      user_id: this.cookieUserData?.id,
      sub_id: this.cookieUserData?.subcriptionId,
      contacts: reorderedColumn.map(c => ({
        contact_id: c.id,
        status_id: c.status_id,
        sort_order: c.sort_order
      }))
    };

    this._apiService.Post$(GrowSkillAPIEndPointPath.GetUpdatePipelineStatusByDrag, payload, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          if (res?.response?.status=='success') {
              this.loadFromApi();
              this.cdr.markForCheck();
          } else {  }
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
    this.dragId = null;
    this.cdr.markForCheck();
  }

}

