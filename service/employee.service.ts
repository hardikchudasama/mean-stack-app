import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public refreshEmployeeList = new BehaviorSubject<Boolean>(false);
  constructor(private http: HttpClient) { }

  public apiUrl = environment.apiBaseURL;
  // Get Employee
  getEmployees() {
    return this.http.get(`${this.apiUrl}`);
  }
  // Add employee
  addEmployee(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addEmployee`, body);
  }

  // To Updated Specific Employee
  updateEmployee(empid: any, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateEmployee/${empid}`, body);
  }

  // To Delete Any Employee
  deleteEmployee(empid: number) {
    return this.http.get(`${this.apiUrl}/deleteEmployee/${empid}`);
  }

}
