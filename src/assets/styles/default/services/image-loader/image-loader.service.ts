import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderService {

  public load(src: any): Promise<any> {

    return new Promise((resolve, reject): void => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        resolve(`Image with src ${img.src} loaded successfully.`);
      };
    });
  }
}
