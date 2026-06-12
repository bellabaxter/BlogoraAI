// import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-rich-text-editor',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './rich-text-editor.component.html',
//   styleUrls: ['./rich-text-editor.component.css'],
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => RichTextEditorComponent),
//       multi: true
//     }
//   ]
// })
// export class RichTextEditorComponent implements ControlValueAccessor {
//   @ViewChild('editorArea', { static: true }) editorArea!: ElementRef;

//   content: string = '';
//   isDisabled: boolean = false;

//   private onChange: (value: string) => void = () => {};
//   private onTouched: () => void = () => {};

//   writeValue(value: string): void {
//     this.content = value || '';
//     if (this.editorArea) {
//       this.editorArea.nativeElement.innerHTML = this.content;
//     }
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.isDisabled = isDisabled;
//     if (this.editorArea) {
//       this.editorArea.nativeElement.contentEditable = !isDisabled;
//     }
//   }

//   onInput(): void {
//     const value = this.editorArea.nativeElement.innerHTML;
//     this.content = value;
//     this.onChange(value);
//   }

//   onBlur(): void {
//     this.onTouched();
//   }
  
//   format(command: string, value: string = ''): void {
//     document.execCommand(command, false, value);
//     this.editorArea.nativeElement.focus();
//     this.onInput();
//   }

//   formatBlock(tag: string): void {
//     document.execCommand('formatBlock', false, tag);
//     this.editorArea.nativeElement.focus();
//     this.onInput();
//   }
// }


import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent implements ControlValueAccessor {

  @ViewChild('editorArea', { static: true }) editorArea!: ElementRef;

  content: string = '';
  isDisabled: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ✅ Write value from form → editor
  writeValue(value: string): void {
    this.content = value || '';
    if (this.editorArea) {
      this.editorArea.nativeElement.innerHTML = this.content;
    }
  }

  // ✅ Register change
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // ✅ Register touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // ✅ Disable support
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.editorArea) {
      this.editorArea.nativeElement.contentEditable = !isDisabled;
    }
  }

  // 🔥 MAIN FIX HERE
  onInput(): void {
    const html = this.editorArea.nativeElement.innerHTML;

    // Remove all HTML tags → get actual text
    const text = html.replace(/<[^>]*>/g, '').trim();

    // If empty → send empty string (IMPORTANT)
    const value = text.length === 0 ? '' : html;

    this.content = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // Toolbar formatting
  format(command: string, value: string = ''): void {
    document.execCommand(command, false, value);
    this.editorArea.nativeElement.focus();
    this.onInput();
  }

  formatBlock(tag: string): void {
    document.execCommand('formatBlock', false, tag);
    this.editorArea.nativeElement.focus();
    this.onInput();
  }
}