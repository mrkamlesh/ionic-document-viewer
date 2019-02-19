import { Component, NgZone } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  progress: any = -1;
  constructor(
    public navCtrl: NavController,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    private platform: Platform,
    private fileOpener: FileOpener,
    private toastController: ToastController,
    private zone: NgZone
  ) {

  }

  downloadAndOpenPdf() {
    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }

    const options: DocumentViewerOptions = {
      title: 'Document PDF'
    }
    const transfer = this.transfer.create();
    transfer.download('https://test-qa.net/test.pdf', path + 'myPdfFile.pdf').then(entry => {
      let url = entry.toURL();
      console.log("Mypdf url: ", url);
      this.document.viewDocument(url, 'application/pdf', options);
    });
  }

  downloadAndOpenRtf() {
    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }

    const options: DocumentViewerOptions = {
      title: 'Document RTF'
    }
    const transfer = this.transfer.create();
    transfer.download('https://test-qa.net/test.rtf', path + 'myRtfFile.rtf').then(entry => {
      let url = entry.toURL();
      this.document.viewDocument(url, 'application/rtf', options);
    });
  }

  openWithFileOpener() {
    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }

    const transfer = this.transfer.create();
    transfer.download('https://test-qa.net/test.rtf', path + 'myRtfFile.rtf').then(entry => {
      let url = entry.toURL();
      console.log("Downloaded file URL: ", url);

      let file_name = 'test.rtf';
      let fileExtn = file_name.split('.').reverse()[0];
      console.log("File extention: ", fileExtn);

      let fileMIMEType = this.getMIMEtype(fileExtn);
      console.log("File MIMEType: ", fileMIMEType);

      this.fileOpener.open(url, fileMIMEType)
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error openening file', JSON.stringify(e)));
    });
  }

  openPDFWithFileOpener() {

    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }

    const transfer = this.transfer.create();
    transfer.download('https://test-qa.net/test.pdf', path + 'test.pdf').then(entry => {
      let url = entry.toURL();
      console.log("Downloaded file URL: ", url);

      let file_name = 'test.pdf';
      let fileExtn = file_name.split('.').reverse()[0];
      console.log("File extention: ", fileExtn);

      let fileMIMEType = this.getMIMEtype(fileExtn);
      console.log("File MIMEType: ", fileMIMEType);

      this.fileOpener.open(url, fileMIMEType)
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error openening file', JSON.stringify(e)));
    });

  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }


  downloadMyPDF() {
    let url = "https://test-qa.net/test.pdf";
    const fileTransfer: FileTransferObject = this.transfer.create();

    //whereDownload = cordova.file.dataDirectory, but you can set it to cordova.file.externalCacheDirectory as well
    let whereDownload = null;

    if (this.platform.is('ios')) {
      whereDownload = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      whereDownload = this.file.dataDirectory;
    }

    let extension = url.split('.').reverse()[0];
    console.log("mime Type extension: ", extension);
    let name = 'test.pdf';

    console.log("mime Type mimeTypeArray: ", this.getMIMEtype(extension));

    fileTransfer.download(url, whereDownload + name, false, {
      // headers: {
      //   'Content-Type': this.getMIMEtype(extension),
      //   'Authorization': 'Bearer SDFGHXCVBN12345ZXCVBNM'
      // }
    }).then(
      (entry) => {
        let entryBis = entry.toURL();
        let mime = this.getMIMEtype(extension);
        let tempFileOpener = this.fileOpener;
        let tempToast = this.toastController;
        // let isAndroid = true;

        console.log("toURL: ", entryBis);
        console.log("mime type: ", mime);
        // this.file.resolveLocalFilesystemUrl(entryBis).then((fileEntry: any) => {

        //   //I use cordova.file.documentsDirectory for iOS
        //   let whereToMove = (isAndroid) ? this.file.dataDirectory : this.file.documentsDirectory;

        //   this.file.resolveLocalFilesystemUrl(whereToMove).then((dirEntry: any) => {
        //find the files, and then copy to another directory
        // fileEntry.copyTo(dirEntry, name, (newFileEntry) => {

        tempFileOpener.open(entryBis, mime).then(
          (a) => {
            console.log(a);
          },
          (err) => {
            console.log("Error: ", err);
            let message = (err ? err : "Something went wrong");

            let toaster = tempToast.create({
              message: message,
              position: "bottom",
              duration: 3000
            });
            toaster.present();
          }
        ).catch((error) => {
          console.log(error);
        })
      });
    //   }).catch((error) => {
    //     console.log(error);
    //   })
    // });
    // },
    // (error) => {
    //   // handle error
    //   console.log("Error =", error);
    //   let message = (error ? error : "Something went wrong");

    //   let toaster = this.toastController.create({
    //     message: message,
    //     position: "bottom",
    //     duration: 3000
    //   });
    //   toaster.present();

    // });
  }


  downloadWithToken() {
    let url = "https://test-qa.net/api/documents/7188";
    const fileTransfer: FileTransferObject = this.transfer.create();

    //whereDownload = cordova.file.dataDirectory, but you can set it to cordova.file.externalCacheDirectory as well
    let whereDownload = null;

    if (this.platform.is('ios')) {
      whereDownload = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      whereDownload = this.file.dataDirectory;
    }

    // let extension = url.split('.').reverse()[0];
    let extension = 'rtf';
    console.log("mime Type extension: ", extension);
    let name = 'test.rtf';

    console.log("mime Type mimeTypeArray: ", this.getMIMEtype(extension));

    fileTransfer.download(url, whereDownload + name, false, {
      headers: {
        'Content-Type': this.getMIMEtype(extension),
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjEwMDAvIiwiYXVkIjoiQW55Iiwic3ViIjoia2FtbGVzaC5rdW1hckBhZ3JlZXlhLmxvY2FsIiwiaWF0IjoxNTM3NDI2MDEyLCJleHAiOjE1Mzc1MTI0MTIsImRpc3BsYXlOYW1lIjoia2FtbGVzaCBLdW1hciIsInNlcmlhbE51bWJlciI6IjE2Iiwicm9sZXMiOlsiU3lzdGVtIEFkbWluaXN0cmF0b3IiLCJBdHRvcm5leSIsIlN5cyBBZG1pbiJdfQ.Xl4Ailni83qIOgW2fjrxM_1UPMY9BIFqvbVCnb4_jHQhEdctyoTBNMmnToitNLqSS4uGZRjk5V7trAJQ_9pZsg'
      }
    }).then(
      (entry) => {
        let entryBis = entry.toURL();
        let mime = this.getMIMEtype(extension);
        let tempFileOpener = this.fileOpener;
        let tempToast = this.toastController;

        console.log("toURL: ", entryBis);
        console.log("mime type: ", mime);
        // this.file.resolveLocalFilesystemUrl(entryBis).then((fileEntry: any) => {

        //   //I use cordova.file.documentsDirectory for iOS
        //   let whereToMove = (isAndroid) ? this.file.dataDirectory : this.file.documentsDirectory;

        //   this.file.resolveLocalFilesystemUrl(whereToMove).then((dirEntry: any) => {
        //find the files, and then copy to another directory
        // fileEntry.copyTo(dirEntry, name, (newFileEntry) => {

        tempFileOpener.open(entryBis, mime).then(
          (a) => {
            console.log(a);
          },
          (err) => {
            console.log("Error: ", err);
            let message = (err ? err : "Something went wrong");

            let toaster = tempToast.create({
              message: message,
              position: "bottom",
              duration: 3000
            });
            toaster.present();
          }
        ).catch((error) => {
          console.log(error);
        });
      });
    //   }).catch((error) => {
    //     console.log(error);
    //   })
    // });
    // },
    // (error) => {
    //   // handle error
    //   console.log("Error =", error);
    //   let message = (error ? error : "Something went wrong");

    //   let toaster = this.toastController.create({
    //     message: message,
    //     position: "bottom",
    //     duration: 3000
    //   });
    //   toaster.present();

    // });

    fileTransfer.onProgress((progressEvent) => {
      // console.log(progressEvent);

      this.zone.run(() => {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.progress = perc;
        console.log(this.progress);
      }, 100);
    });
  }
}
