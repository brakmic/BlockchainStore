import { Pipe, PipeTransform } from '@angular/core';
import { layoutPaths } from '../../theme.constants';

@Pipe({name: 'myBcsAppPicture'})
export class BcsAppPicturePipe implements PipeTransform {

  public transform(input: string): string {
    return layoutPaths.images.root + input;
  }
}
