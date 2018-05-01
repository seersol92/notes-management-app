import { Component, Pipe, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { JsonPipe} from '@angular/common';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { User } from './entities/user';
import { Note } from './entities/note';
import { Category } from './entities/category';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public user: User;
  public note: Note;
  public category: Category;
  public userId: number = null;
  public noteId: number = null;
  public categoryId: number = null;
  users = [];
  notes = [];
  categories = [];
  isEditUser: Boolean = false;
  isEditNote: Boolean = false;
  isEditCategory: Boolean = false;
  messageClass: string = null;
  message: string = null;
  closeResult: string;
  userModelBtn: string = null;
  userModelText: string = null;
  categoryModalText: string = null;
  categoryModalBtn: string = null;
  noteModalText: string = null;
  noteModalBtn: string = null;
  private modalRef: NgbModalRef;
  constructor(
    private api: ApiService,
    private modalService: NgbModal
  ) {
    this.fetchCategories();
    this.fetchNotes();
    this.fetchUsers();
  }

  fetchNotes () {
    this.api.getRequest('/notes').subscribe(res => {
      this.notes = res;
    });
  }

  fetchUsers() {
    this.api.getRequest('/users').subscribe(res => {
      this.users = res;
    });
  }

  fetchCategories() {
    this.api.getRequest('/categories').subscribe(res => {
      this.categories = res;
    });
  }

  ngOnInit() {
     this.user = new User();
     this.note = new Note ();
     this.category = new Category();
  }

  hideMessage(): void {
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
  }
  noteModal(content): void {
    this.note = new Note();
    this.noteModalText = 'Add New Note';
    this.noteModalBtn = 'Submit';
    this.modalRef =  this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  submitNote(): void {
    const data = this.note;
    if (!this.isEditNote) { // new user
      this.api.postRequest('/notes', data).subscribe(res => {
        this.modalRef.close();
        if (res) {
          this.fetchNotes();
          this.notes.push(data);
          this.messageClass = 'alert alert-success';
          this.message = 'Note Has Been Added!';
        } else {
          this.messageClass = 'alert alert-danger';
          this.message = 'Operation Failed!';
        }
      });
    } else { // update user
      this.api.updateRequest('/notes/' + this.noteId, data).subscribe(res => {
          this.modalRef.close();
          this.fetchNotes();
          this.messageClass = 'alert alert-success';
          this.message = 'Note Has Been Updated!';
      });
    }
    this.hideMessage();
  }

  editNote (index: number, id: number, content) {
    this.isEditNote = true;
    this.noteId = id;
    this.note = this.notes[index];
    this.noteModalText = 'Edit Note';
    this.noteModalBtn = 'Update';
    this.modalRef =  this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  removeNote(index: number, id: number) {
    if (confirm('Are you sure to delete this note?') ) {
      this.api.deleteRequest('/notes/' + id).subscribe(res => {
        if (res) {
          this.notes.splice(index, 1);
          this.messageClass = 'alert alert-success';
          this.message = 'Note Has Been Deleted!';
        } else {
          this.messageClass = 'alert alert-danger';
          this.message = 'Delete Operation Failed!';
        }
        setTimeout(() => {
          this.messageClass = '';
          this.message = '';
        }, 10000);
      });
    }
  }

  userModal(content) {
    this.user = new User();
    this.userModelText = 'Add New User';
    this.userModelBtn = 'Submit';
    this.modalRef =  this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  submitUser() {
    const data = this.user;
    if (!this.isEditUser) { // new user
      this.api.postRequest('/users', data).subscribe(res => {
        this.modalRef.close();
        if (res) {
          this.users.push(data);
          this.fetchUsers();
          this.messageClass = 'alert alert-success';
          this.message = 'User Has Been Added!';
        } else {
          this.messageClass = 'alert alert-danger';
          this.message = 'Operation Failed!';
        }
      });
    } else { // update user
      this.api.updateRequest('/users/' + this.userId, data).subscribe(res => {
          this.modalRef.close();
          this.fetchUsers();
          this.messageClass = 'alert alert-success';
          this.message = 'User Has Been Updated!';
      });
    }
    this.hideMessage();
  }

  editUser (index: number, id: number, content) {
    this.isEditUser = true;
    this.userId = id;
    this.user = this.users[index];
    this.userModelText = 'Edit User';
    this.userModelBtn = 'Update';
    this.modalRef =  this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  removeUser(index: number, id: number) {
    if (confirm('Are you sure to delete this user?') ) {
      this.api.deleteRequest('/users/' + id).subscribe(res => {
        if (res) {
          this.users.splice(index, 1);
          this.messageClass = 'alert alert-success';
          this.message = 'User Has Been Deleted!';
        } else {
          this.messageClass = 'alert alert-danger';
          this.message = 'Delete Operation Failed!';
        }
        setTimeout(() => {
          this.messageClass = '';
          this.message = '';
        }, 10000);
      });
    }
  }


  categoryModal(content): void {
    this.category = new Category();
    this.categoryModalText = 'Add New Category';
    this.categoryModalBtn = 'Submit';
    this.modalRef =  this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editCategory (index: number, id: number, content) {
    this.isEditCategory = true;
    this.categoryId = id;
    this.category = this.categories[index];
    this.categoryModalText = 'Edit Category';
    this.categoryModalBtn = 'Update';
    this.modalRef =  this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  removeCategory(index: number, id: number) {
    if (confirm('Are you sure to delete this category?') ) {
      this.api.deleteRequest('/categories/' + id).subscribe(res => {
        if (res) {
          this.categories.splice(index, 1);
          this.messageClass = 'alert alert-success';
          this.message = 'Category Has Been Deleted!';
        } else {
          this.messageClass = 'alert alert-danger';
          this.message = 'Delete Operation Failed!';
        }
        setTimeout(() => {
          this.messageClass = '';
          this.message = '';
        }, 10000);
      });
    }
  }

  submitCategory(): void {
    const data = this.category;
    if (!this.isEditCategory) { // new user
      this.api.postRequest('/categories', data).subscribe(res => {
        this.modalRef.close();
        if (res) {
          this.fetchCategories();
          this.categories.push(data);
          this.messageClass = 'alert alert-success';
          this.message = 'Category Has Been Added!';
        } else {
          this.messageClass = 'alert alert-danger';
          this.message = 'Operation Failed!';
        }
      });
    } else { // update user
      this.api.updateRequest('/categories/' + this.categoryId, data).subscribe(res => {
          this.modalRef.close();
          this.fetchCategories();
          this.messageClass = 'alert alert-success';
          this.message = 'Category Has Been Updated!';
      });
    }
    this.hideMessage();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
