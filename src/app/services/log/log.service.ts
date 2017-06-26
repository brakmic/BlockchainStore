/**
 * Provides simple logging services
 * @type {Injectable}
 */
import { Injectable, OnInit } from '@angular/core';
import { ILogEntry } from 'app/interfaces';
import * as _ from 'lodash';
const circularJson = require('circular-json');
const bows = require('platform/helpers/bows-alt');

@Injectable()
export class LogService {
  constructor() {
    if (window) {
      (<any> window.localStorage).debug = true;
    }
  }
  public log(entry: ILogEntry): void {
    if (!entry || !entry.content) return;
    let log = undefined;
    if (entry.component) {
      log = bows(entry.component);
    } else {
      log = bows('LogService');
    }
    log(entry.content);
  }

  public logEx(content: any, component?: string): void {
    this.log({
      content,
      component
    });
  }

  public logJson(content: any, component?: string): void {
    this.log({
      content: circularJson.stringify(content, undefined, 4),
      component
    });
  }

  public logTable(content: any, propkeys?: string[], component?: string): void {
    component ? console.log(component) : _.noop();
    !_.isNil(propkeys) ? (<any> console).table(content, propkeys) : (<any> console).table(content);
  }
}
