import { Injectable } from '@angular/core';
import { IpfsClient } from '../client/ipfs.client';

@Injectable({
  providedIn: 'root'
})
export class PicturesService {

  constructor(private ipfsClient: IpfsClient) {
  }

  updatedBackgroundPicture() {

  }
}
