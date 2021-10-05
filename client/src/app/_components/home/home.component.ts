import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public imagePath;
  imgURL: any;
  public message: string;
  imageUploadFlag = false;

  constructor(private store: AngularFirestore) { }

  ngOnInit(): void {
  }


  preview(files) {
    if (files.length === 0)
      return;


    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    //append the image file
    // let fileToUpload = <File>files[0];
    // this.formData.append('photo', fileToUpload, fileToUpload.name);

    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

    this.imageUploadFlag = true;
  }

  uploadPhoto(){
    this.store.collection
    
  }
}
