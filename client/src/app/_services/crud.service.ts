import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  task: AngularFireUploadTask;     
  snapshot: Observable<any>;
  downloadURL: string;


  constructor(private store: AngularFirestore, private storage: AngularFireStorage) { }

  getFiles() {
    return this.store.collection("files").snapshotChanges();
  }

  deleteFileFromStore(id: string) {
    return this.store.collection("files").doc(id).delete();
  }
  deleteFileFromStorage(path: string) {
    return this.storage.ref(path).delete()
  }

  startUpload(file) {
    let safeName = file.name.replace(/([^a-z0-9.]+)/gi, '');   // file name stripped of spaces and special chars
    let timestamp = Date.now();                                     // ex: '1598066351161'
    const uniqueSafeName = timestamp + '_' + safeName;
    const path = 'uploads/' + uniqueSafeName;                       // Firebase storage path
    const ref = this.storage.ref(path);                             // reference to storage bucket
    this.task = this.storage.upload(path, file);
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.store.collection('files').doc(uniqueSafeName).set({
          storagePath: path,
          downloadURL: this.downloadURL,
          originalName: file.name,
          timestamp: timestamp
        })
      })
    )
    return this.snapshot;
  }
}
