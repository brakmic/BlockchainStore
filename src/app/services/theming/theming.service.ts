/**
 * Provides styling services.
 * @type {Injectable}
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { IStyleConfig, IStyleConfigItem,
         IStyleConfigItemMap } from 'app/interfaces';
import { LogService } from '../log';
import { BCS } from 'app/helpers';
import * as _ from 'lodash';

@Injectable()
export class ThemingService extends Subject<IStyleConfigItemMap | string> {
  constructor(private logService: LogService) {
    super();
  }
  public getStyles(): Observable<Promise<IStyleConfig>> {
    return this.asObservable().map((data) => {
      const dat = typeof(data) !== 'string' ? data as IStyleConfigItemMap : undefined;
      if (!_.isNil(dat)) {
        const cfg = {
            [dat.name] : {
             block: dat.configItem.block
            } as IStyleConfigItem,
            activeTheme: dat.isActive ? dat.name : undefined
        } as IStyleConfig;
        return Promise.resolve(cfg);
      } else {
        if (_.isNil(data)) return undefined;
        const _theme = data as string;
        const _name = '/assets/themes/' + data + '.json';
        return Promise.resolve($.getJSON(_name).then((config) => {
          const cfg = {
            [_theme] : {
             block: config.block
            } as IStyleConfigItem,
            activeTheme: _theme
          } as IStyleConfig;
          return cfg;
        }));
      }
    });
  }
}
