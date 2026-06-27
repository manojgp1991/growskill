import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-new-email-template',
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
  templateUrl: './new-email-template.html',
  styleUrl: './new-email-template.css',
})
export class NewEmailTemplate implements OnInit, OnDestroy  {
  html = '';
  editor!: Editor;
  ngOnInit(): void {
     this.editor = new Editor();
  }
    ngOnDestroy(): void {
    this.editor.destroy();
  }
}
