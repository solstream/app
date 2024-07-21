import { Component, OnInit } from '@angular/core';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import {FileCoinService} from './file-coin.service';

@Component({
  selector: 'app-file-coin',
  templateUrl: './file-coin.component.html',
  styleUrls: ['./file-coin.component.scss']
})
export class FileCoinComponent implements OnInit {

  username = 'username';


  cid = 'bafybeicawavoyatoub6igqcugcmmvvinjp75injeb5ewrobbqc3a4gjlyy';

  file: File;
  uploading = false;

  fileName = '';
  uploadNames: string[] = [];

  constructor(private fileCoinService: FileCoinService) { }

  async ngOnInit(): Promise<void> {
    const client = this.makeStorageClient();
    const uploadNames = [];
    for await (const item of client.list({ maxResults: 10 })) {
      const gatewayurl = await this.fileCoinService.getVideoGateWayUrl(item.cid);
      uploadNames.push(gatewayurl);
    }
    this.uploadNames = uploadNames;
  }

  fileSelected($event): void {
    const file: File = $event.target.files[0];
    this.file = file;
  }

  async upload(): Promise<void> {
    const files = [this.file];
    await this.storeFiles(files);
  }

  private makeStorageClient(): Web3Storage {
    return new Web3Storage({ token: this.getAccessToken() });
  }

  getAccessToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwODBhRmQ1MTg4QjcxOUI1Mjg1MjEyYmUyODlkRDUxOENkNUVmQ2UiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDc2MTI1OTQxODgsIm5hbWUiOiJ0ZXN0LXVwbG9hZC0xIn0.K0vzyKZsjRuhCez_MHJmQhsKgHi38EOgaMn6ig22hSo'
  }

  async storeFiles(files: File[]): Promise<void> {
    this.uploading = true;
    const client = this.makeStorageClient();
    const uploadName = [this.username, files[0].name, Date.now()].join('|');
    const metafile = this.fileCoinService.getMetadataFile(files[0], uploadName, this.username);
    files.push(metafile);
    const cid = await client.put(files, {name: uploadName});
    console.log('stored files with cid:', cid);
    this.uploading = false;
    return cid;
  }

}
