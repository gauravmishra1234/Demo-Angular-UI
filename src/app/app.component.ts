import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  allUser: User[] = [];
  message = null;
  dataSaved = false;
  pageNumber = 1;
  p: number = 1;
  menuUser: any;
  updateuserForm: any;
  mailErrorMessage = null;
  userIdUpdate = null;
  isValid: boolean = true;
  editUserDetails: boolean = false;
  updateuserForm_validation_messages = {
    'firstName': [
      { type: 'required', message: 'First Name is required' }
    ],
    'lastName': [
      { type: 'required', message: 'Last Name is required' }
    ],
    'cell': [
      { type: 'required', message: 'Cell Number is required' },
      { type: 'pattern', message: 'Enter a valid Cell Number like XXX-XXX-1234' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]
  }
  errorMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.updateuserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ]), ,],
      phoneNumber: ['', Validators.compose([
        Validators.required,
        //Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$')
      ]),]
    });
  }

  ngOnInit() {
    this.loadAllUser(this.pageNumber);
  }

  loadAllUser(pageNumber) {
    this.allUser = [];
    this.userService.getAll(pageNumber).subscribe(user => {
      this.allUser = this.allUser.concat(user);
    });
  }
  loadUserToEdit(userId: number) {
    this.userService.getById(userId).subscribe(user => {
      this.message = null;
      this.dataSaved = false;
      this.editUserDetails = true;
      this.userIdUpdate = user.UserId;
      this.updateuserForm.controls['firstName'].setValue(user.FirstName);
      this.updateuserForm.controls['lastName'].setValue(user.LastName);
      this.updateuserForm.controls['email'].setValue(user.Email);
      this.updateuserForm.controls['phoneNumber'].setValue(user.PhoneNumber);
      //this.updateuserForm.controls['isActive'].setValue(user.IsActive);
    });
  }
  onSubmit() {
    this.mailErrorMessage = null;
    setTimeout(() => {
      if (this.dataSaved === true) {
        this.editUserDetails = false;
      }
    }, 1300);
    const user = this.updateuserForm.value;
    if (this.userIdUpdate == null) {
      this.createUser(user);
    }
    else {
      this.EditUser(user);
    }
  }
  createUser(user: User) {
    this.message = null;
    this.userService.insertUser(user).subscribe(
      result => {
        if (result === 1) {
          this.dataSaved = true;
          this.loadAllUser(this.pageNumber);
          this.message = 'Record Saved Successfully';
          this.updateuserForm.reset();
          this.closeMessage();
        }
        else if (result === 2) {
          this.dataSaved = false;
          this.message = 'Email Id already exists';
          this.closeMessage();
        }
        else if (result === 3) {
          this.dataSaved = false;
          this.message = 'User Name or Email already exists';
        }
        else {
          this.dataSaved = true;
          this.message = 'Error Occured';
        }
      },
      error => {
        this.dataSaved = false;
        if (error.error.message === undefined)
          this.message = 'Something went wrong in service';
        else {
          this.message = error.error.message;
          this.closeMessage();
        }
      }
    );
  }
  EditUser(user: User) {
    user.UserId = this.userIdUpdate;
    user.UpdatedBy = user.UserId;
    this.userService.updateUser(user).subscribe(
      result => {
        if (result === 1) {
          this.dataSaved = true;
          this.message = "Record has been updated successfully";
          this.loadAllUser(this.pageNumber);
          this.userIdUpdate = null;
          this.updateuserForm.reset();
        }
        else if (result === 2) {
          this.dataSaved = false;
          this.errorMessage = 'Email Id already exists';
          this.closeMessage();
        }
        else {
          this.dataSaved = false;
          this.errorMessage = 'Error Occured';
        }
      },
      error => {
        this.dataSaved = false;
        if (error.error.message === undefined)
          this.errorMessage = 'Something went wrong in service';
        else {
          this.errorMessage = error.error.message;
          this.closeMessage();
        }
      }
    );
  }
  deleteUser(id: number, username: string) {
    if (confirm("Are you sure you want to delete:=> " + username)) {
      this.userService.deleteUserById(id).subscribe(() => {
        this.dataSaved = true;
        this.message = 'Record Deleted Succefully';
        this.allUser = [];
        this.loadAllUser(1);
      });
    }
  }
  resetForm() {
    this.updateuserForm.reset();
    this.userIdUpdate = null;
    this.message = null;
    this.errorMessage=null;
    this.dataSaved = false;
    this.editUserDetails = false;
  }
  closeMessage() {
    setTimeout(() => {
      this.dataSaved = false;
      this.errorMessage = false;
    }, 3000);
  }
}
