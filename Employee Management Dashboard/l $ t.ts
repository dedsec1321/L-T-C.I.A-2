
/* ============================================
   EMPLOYEE MANAGEMENT DASHBOARD
   Angular 17 + TypeScript
   ONLY TYPESCRIPT CODE
============================================ */

/* ========= employee.model.ts ========= */
export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  joiningDate: Date;
}

/* ========= employee.service.ts ========= */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      role: 'Developer',
      department: 'IT',
      salary: 60000,
      joiningDate: new Date('2022-01-10')
    }
  ];

  private employeeSubject = new BehaviorSubject<Employee[]>(this.employees);

  getEmployees(): Observable<Employee[]> {
    return this.employeeSubject.asObservable();
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  addEmployee(employee: Employee): void {
    employee.id = Date.now();
    this.employees.push(employee);
    this.employeeSubject.next(this.employees);
  }

  updateEmployee(employee: Employee): void {
    const index = this.employees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      this.employees[index] = employee;
      this.employeeSubject.next(this.employees);
    }
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter(emp => emp.id !== id);
    this.employeeSubject.next(this.employees);
  }
}

/* ========= navbar.component.ts ========= */
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: ''
})
export class NavbarComponent {}

/* ========= employee-list.component.ts ========= */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-list',
  template: ''
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'role', 'department', 'salary', 'actions'];

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.empService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  deleteEmployee(id: number): void {
    this.empService.deleteEmployee(id);
  }
}

/* ========= employee-form.component.ts ========= */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  template: ''
})
export class EmployeeFormComponent {
  empForm: FormGroup;

  constructor(private fb: FormBuilder, private empService: EmployeeService) {
    this.empForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, Validators.required]
    });
  }

  submit(): void {
    if (this.empForm.valid) {
      this.empService.addEmployee(this.empForm.value as Employee);
      this.empForm.reset();
    }
  }
}

/* ========= department-filter.pipe.ts ========= */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'departmentFilter'
})
export class DepartmentFilterPipe implements PipeTransform {
  transform(employees: Employee[], department: string): Employee[] {
    if (!department) return employees;
    return employees.filter(emp => emp.department === department);
  }
}

/* ========= highlight-salary.directive.ts ========= */
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlightSalary]'
})
export class HighlightSalaryDirective {
  constructor(private el: ElementRef) {
    const salary = Number(this.el.nativeElement.innerText.replace(/[^0-9]/g, ''));
    if (salary > 50000) {
      this.el.nativeElement.style.color = 'green';
      this.el.nativeElement.style.fontWeight = 'bold';
    }
  }
}

/* ========= app-routing.module.ts ========= */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add', component: EmployeeFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

/* ========= app.module.ts ========= */
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    NavbarComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    DepartmentFilterPipe,
    HighlightSalaryDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
