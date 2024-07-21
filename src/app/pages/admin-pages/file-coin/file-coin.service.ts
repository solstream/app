import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Web3Storage} from 'web3.storage/dist/bundle.esm.min.js';

@Injectable({
    providedIn: 'root'
})
export class FileCoinService {

    constructor(private client: HttpClient) {
    }

    upload(file: File, token: string): Observable<any> {

        const basicCredentials = 'Bearer ' + token;
        const headers = new HttpHeaders({
            Authorization: basicCredentials,
            'x-name': file.name
        });

        return this.client.post<any>('https://api.web3.storage/car', file, {headers});
    }

    getMetadataFile(imageFile: File, caption: string, user: string): File {
        return this.jsonFile('metadata.json', {
            path: imageFile.name,
            caption,
            user
        });
    }

    async storeFiles(file: File, username): Promise<void> {
        const client = this.makeStorageClient();
        const files: File[] = [];
        files.push(file);
        const uploadName = [username, files[0].name, Date.now()].join('|');
        const metafile = this.getMetadataFile(files[0], uploadName, username);
        files.push(metafile);
        const cid = await client.put(files, {name: uploadName});
        console.log('stored files with cid:', cid);
        return cid;
    }

    async getVideoGateWayUrl(cid): Promise<string> {
        const url = this.makeGatewayURL(cid, 'metadata.json');
        const obj = await this.client.get<any>(url).toPromise();
        const gatewayURL = this.makeGatewayURL(cid, obj.path);
        return gatewayURL;
        // const uri = `ipfs://${cid}/${metadata.path}`
        // return { ...metadata, cid, gatewayURL, uri }
    }

    private jsonFile(filename, obj): File {
        return new File([JSON.stringify(obj)], filename);
    }

    makeGatewayURL(cid: string, path: string): string {
        return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
    }

    private makeStorageClient(): Web3Storage {
        return new Web3Storage({token: this.getAccessToken()});
    }

    getAccessToken(): string {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwODBhRmQ1MTg4QjcxOUI1Mjg1MjEyYmUyODlkRDUxOENkNUVmQ2UiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDc2MTI1OTQxODgsIm5hbWUiOiJ0ZXN0LXVwbG9hZC0xIn0.K0vzyKZsjRuhCez_MHJmQhsKgHi38EOgaMn6ig22hSo';
    }


}


