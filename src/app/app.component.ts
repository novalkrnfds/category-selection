import { Component } from '@angular/core';
import { CategoryService } from './services/category.service';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface Category {
  children: Array<any>;
  display_name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'category-selection';
  categories: Array<any> = [];
  categoriesGroup: FormGroup;
  
  constructor(
    private categoryService : CategoryService,
    private formBuilder: FormBuilder
  ) {
    this.categoriesGroup = this.formBuilder.group({
      form1: [''],
      form2: [''],
      form3: ['']
    })
  }

  async ngOnInit() {
    const list = await this.categoryService.getCategory().toPromise();
    this.categories = list.filter(item => item.parent_id === 0).map(item => ({
      ...item,
      children: this.recursive(list, item.id)
    }));
  }

  recursive(array, id) {
    return array.filter(item => item.parent_id === id).map(item => ({
      ...item,
      children: this.recursive(array, item.id)
    }));
  }

  onChange(formControl) {
    if (formControl === 'form1') {
      this.categoriesGroup.get('form2').setValue('');
      this.categoriesGroup.get('form3').setValue('');
    } else if (formControl === 'form2') {
      this.categoriesGroup.get('form3').setValue('');
    }
  }
}
