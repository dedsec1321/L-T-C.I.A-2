// ======================= IMPORTS =======================
import { NgModule, Component, Injectable, Pipe, PipeTransform, Directive, ElementRef, Input, HostListener } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// ======================= MODELS =======================
export interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
}

export interface Course {
  id: number;
  title: string;
  department: string;
  seats: number;
  fee: number;
}

export interface Enrollment {
  studentId: number;
  courseId: number;
  date: Date;
}

// ======================= SERVICES =======================
@Injectable({ providedIn: 'root' })
export class StudentService {
  private students: Student[] = [
    { id: 1, name: 'John', email: 'john@gmail.com', department: 'CSE' },
    { id: 2, name: 'Mary', email: 'mary@gmail.com', department: 'ECE' }
  ];

  getStudents(): Observable<Student[]> {
    return of(this.students);
  }

  addStudent(student: Student) {
    this.students.push(student);
  }
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private courses: Course[] = [
    { id: 101, title: 'Angular', department: 'CSE', seats: 3, fee: 45000 },
    { id: 102, title: 'Data Science', department: 'CSE', seats: 1, fee: 60000 }
  ];

  getCourses(): Observable<Course[]> {
    return of(this.courses);
  }
}

// ======================= ROUTE GUARD =======================
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return true; // simulated authentication
  }
}

// ======================= PIPE =======================
@Pipe({ name: 'filterByDept' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], dept: string) {
    return dept ? items.filter(i => i.department === dept) : items;
  }
}

// ======================= DIRECTIVE =======================
@Directive({ selector: '[highlightSeats]' })
export class HighlightDirective {
  @Input('highlightSeats') seats!: number;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.seats <= 1) {
      this.el.nativeElement.style.backgroundColor = 'lightcoral';
    }
  }
}

// ======================= COMPONENTS =======================
@Component({
  selector: 'navbar',
  template: `
    <nav>
      <a routerLink="/students">Students</a> |
      <a routerLink="/courses">Courses</a> |
      <a routerLink="/enroll">Enroll</a>
    </nav>
    <hr/>
  `
})
export class NavbarComponent {}

@Component({
  selector: 'student-list',
  template: `
    <h2>Students</h2>
    <ul>
      <li *ngFor="let s of students">
        {{s.name}} - {{s.department}}
      </li>
    </ul>
  `
})
export class StudentListComponent {
  students: Student[] = [];
  constructor(private service: StudentService) {
    this.service.getStudents().subscribe(data => this.students = data);
  }
}

@Component({
  selector: 'course-list',
  template: `
    <h2>Courses</h2>
    <ul>
      <li *ngFor="let c of courses" [highlightSeats]="c.seats">
        {{c.title}} | ₹{{c.fee}}
      </li>
    </ul>
  `
})
export class CourseListComponent {
  courses: Course[] = [];
  constructor(private service: CourseService) {
    this.service.getCourses().subscribe(data => this.courses = data);
  }
}

@Component({
  selector: 'enroll-student',
  template: `
    <h2>Enroll Student</h2>
    <form [formGroup]="form" (ngSubmit)="enroll()">
      <input formControlName="studentId" placeholder="Student ID">
      <input formControlName="courseId" placeholder="Course ID">
      <button type="submit">Enroll</button>
    </form>
  `
})
export class EnrollStudentComponent {
  form = this.fb.group({
    studentId: ['', Validators.required],
    courseId: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  enroll() {
    console.log('Enrollment Done', this.form.value);
  }
}

// ======================= ROUTES =======================
const routes: Routes = [
  { path: 'students', component: StudentListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'enroll', component: EnrollStudentComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'students', pathMatch: 'full' }
];

// ======================= ROOT COMPONENT =======================
@Component({
  selector: 'app-root',
  template: `
    <navbar></navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}

// ======================= MODULE =======================
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StudentListComponent,
    CourseListComponent,
    EnrollStudentComponent,
    FilterPipe,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
