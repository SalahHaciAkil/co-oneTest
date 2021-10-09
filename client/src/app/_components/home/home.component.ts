import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileRecord } from 'src/app/_interfaces/FileRecord';
import { CrudService } from 'src/app/_services/crud.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filesRecoed: FileRecord[] = [];
  public imagePath;
  imgURL: any;
  public message: string;
  imageUploadFlag = false;
  constructor(private crudService: CrudService, private toast:ToastrService) {
  }

  ngOnInit(): void {
    this.getFiles();
  }




  uploadFile(files) {
    let photoFile = files[0];
    this.crudService.startUpload(photoFile).subscribe(data => {
      this.getFiles();
      this.imgURL = undefined;
      this.toast.success("Uploaded successfully");
      // this.getFile(data.ref.name);

    })




  }

  getFiles() {
    this.filesRecoed = [];
    this.crudService.getFiles().subscribe(actionArray => {

      this.filesRecoed = actionArray.map(file => {
        return {
          id: file.payload.doc.id,
          ...file.payload.doc.data() as {}
        } as FileRecord
      });

    })

  }

  deleteFile(id: string) {
    this.crudService.deleteFileFromStore(id).then(res => {
    }, error => {
      console.log(error);

    });


    this.crudService.deleteFileFromStorage(`uploads/${id}`).subscribe((res) => {

    }, error => {
      console.log(error);

    })

  }
  preview(files) {
    if (files.length === 0)
      return;


    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

    this.imageUploadFlag = true;
  }
}
