import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'service/employee.service';
import { DeleteEmployeeDialogComponent } from './delete-employee-dialog/delete-employee-dialog.component';

export interface PeriodicElement {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, firstName: 'Hardik', lastName: 'Chudasama', email: 'hardik@gmail.com', phone: 123456 },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phone', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  constructor(
    public dialog: MatDialog,
    public employeeService: EmployeeService,
    private toastr: ToastrService
  ) { }

  openAddUpdateDialog(editEmployeeData?: any) {
    var employeeData = editEmployeeData ? editEmployeeData : null;
    console.log('employeeData=>', employeeData);

    const dialogRef = this.dialog.open(AddEditEmployeeDialog, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      data: {
        employeeData: employeeData
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.employeeService.refreshEmployeeList.next(true);
      dialogRef.close();
    })
    // const dialogRef = this.dialog.open(AddEditEmployeeDialog);

    // dialogRef.afterClosed().subscribe(result => {
    //   this.employeeService.refreshEmployeeList.next(true);
    //   dialogRef.close();
    // });
  }

  ngOnInit() {
    this.getAllEmployeeList();
    this.employeeService.refreshEmployeeList.subscribe(res => {
      if (res) {
        this.getAllEmployeeList();
      }
    });
  }

  getAllEmployeeList() {
    this.employeeService.getEmployees().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteEmployee(empid: number) {
    const dialogRef = this.dialog.open(DeleteEmployeeDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      data: {
        employeeId: empid
      },
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}


@Component({
  selector: 'add-edit-emp-dialog-component',
  templateUrl: 'add-edit-emp-dialog-component.html',
})
export class AddEditEmployeeDialog implements OnInit {
  registrationForm: any = FormGroup;
  editEmployeeData: any;
  submitButton: any;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public employeeService: EmployeeService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddEditEmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public addEmployeeData: any) {
  }

  ngOnInit() {
    this.employeeFormValidation();
    this.updateUserdata();
  }

  updateUserdata() {
    this.editEmployeeData = this.addEmployeeData.employeeData;
    this.submitButton = !this.editEmployeeData ? 'Submit' : 'Update';
  }

  getAllEmployeeList() {
    this.employeeService.getEmployees().subscribe((data: any) => {
    });
  }

  closeDialog(flag: any): void {
    this.dialogRef.close({ data: flag });
  }

  employeeFormValidation() {
    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
    })
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      let data = this.registrationForm.value;
      if (this.editEmployeeData) {
        console.log('update');
        this.employeeService.updateEmployee(this.editEmployeeData._id, data).subscribe(() => {
          this.employeeService.refreshEmployeeList.next(true);
          this.closeDialog({ data: 0 });
          this.toastr.success('Employee Updated successfully!');
        });
      } else {
        console.log('add');
        this.employeeService.addEmployee(data).subscribe(() => {
          this.employeeService.refreshEmployeeList.next(true);
          this.closeDialog({ data: 0 });
          this.toastr.success('Employee Added successfully!');
        });
      }

    }
  }
}
