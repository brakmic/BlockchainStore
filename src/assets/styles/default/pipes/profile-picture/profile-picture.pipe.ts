import { Pipe, PipeTransform } from '@angular/core';
import { layoutPaths } from '../../theme.constants';

@Pipe({ name: 'myBcsProfilePicture' })
export class BcsProfilePicturePipe implements PipeTransform {

  public transform(input: string, ext = 'png'): string {
    return layoutPaths.images.profile + input + '.' + ext;
  }
}
