import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api-service/api.service';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GrowSkillAPIEndPointPath } from '../../../services/api-service/api.service.path';
import { BrowserModule } from '@angular/platform-browser';
import { ColorPickerDirective  } from 'ngx-color-picker';

 export class PipelineModel {
  id: number = 0;
  sub_id: string = '';
  user_id: string = '';
  caption: string = '';
  description: string = '';
  color_code: string = '';
  default_status: boolean = false;
  action_type: number = 0;
 }
@Component({
  selector: 'app-add-pipeline',
  imports: [CommonModule, FormsModule, ColorPickerDirective ],
  templateUrl: './add-pipeline.html',
  styleUrl: './add-pipeline.css',
})
export class AddPipeline implements OnInit {
    @Input() public data: string = '';
  pipelineModel : PipelineModel = new PipelineModel();
  headerText: string = 'Add New Pipeline';
  submitted = false;
  cookieUserData: any = {};
  constructor(
    private _apiService: ApiService,
    private tostr: ToastrService,
    private activeModal: NgbActiveModal,
    private _cookieService: CookieStorageService,
    private _toaster: ApplicationToasterService,
    private cdr: ChangeDetectorRef,
  ) {
   this.cookieUserData = this._cookieService.getUser();
  }
  ngOnInit(): void {
      this.setPipelineForm(this.data);
    }
    setPipelineForm(oModel: any) {
      let data = JSON.parse(oModel);
      let obj: PipelineModel = data?.pipipeLineData ?? {};
      this.cdr.markForCheck();
      this.pipelineModel = {
        id: obj?.id ?? 0,
        sub_id: this.cookieUserData?.subcriptionId,
        user_id: this.cookieUserData?.id,
        caption: obj?.caption ?? '',
        description: obj?.description ?? '',
        color_code: obj?.color_code ?? '',
        default_status: obj?.default_status ?? false,
        action_type: 0
      }
      this.headerText = this.pipelineModel.id == 0 ? 'Add New Pipeline' : 'Update Pipeline'
       this.cdr.markForCheck();
    }

    closeModel(data: any) {
    this.activeModal.dismiss(data);
  }
  onUpdatePipeline(form: NgForm) {
     this.submitted = true;

    if (form.invalid) {
      return;
    }
    this.ApiCallSavePipeline();
  }

  ApiCallSavePipeline() {
      this.pipelineModel.sub_id = this.cookieUserData?.subcriptionId;
      this.pipelineModel.user_id = this.cookieUserData?.id;
      this.pipelineModel.action_type = 0;
  
      this._apiService.Post$(GrowSkillAPIEndPointPath.UpdatePipeLine, this.pipelineModel, true).subscribe({
        next: (res: any) => {
          if (res.status) {
             this.cdr.markForCheck();
            const result = res?.response ?? {};
            if (result?.code == 'success') {
              this._toaster.success('Successfull', res?.response?.message ?? 'Pipeline saved successfully.');
              this.closeModel(result?.statusList ?? []);
                this.submitted = false;
               this.cdr.markForCheck();
            } else if (result?.code == 'duplicate') {
              this._toaster.error('', res?.response?.message ?? 'Pipeline already exists in system.');
            } else if (result?.code == 'error') {
              this._toaster.error('', res?.response?.message ?? 'Invalid Pipeline.');
            }
          } else {
            this._toaster.error('', res?.response?.message ?? 'Failed to save Pipeline.');
          }
          this.cdr.markForCheck();
        },
        error: () => {
        }
      });
    }

}
