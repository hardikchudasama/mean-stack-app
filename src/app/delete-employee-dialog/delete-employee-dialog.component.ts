import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'service/employee.service';

@Component({
    selector: 'delete-employee-dialog',
    templateUrl: './delete-employee-dialog.component.html'
})
export class DeleteEmployeeDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public deleteEmployeeData: any,
        private toastr: ToastrService,
        public employeeService: EmployeeService
    ) { }

    ngOnInit() {
    }

    deleteEmployee(empId: any) {
        this.employeeService.deleteEmployee(empId).subscribe(() => {
            this.employeeService.refreshEmployeeList.next(true);
            this.toastr.success('Employee deleted successfully!');
            this.dialogRef.close();
        });
    }
}