import { Directive, ElementRef,
         Input, Output, OnInit,
         Renderer, ViewContainerRef,
         HostBinding } from '@angular/core';

import { ISkinnable, IStyleConfig,
        IStyleConfigItem, IStyleConfigItemMap } from 'app/interfaces';

import { LogService, ThemingService } from 'app/services';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
let domready = require('domready');
import * as _ from 'lodash';

@Directive({
  selector: '[bcsThemeSupport]'
})
export class ThemeSupport implements OnInit {
  @Input() public themePath: string | undefined = undefined;
  @Input() public themeBlock: string[] | string | undefined = undefined;
  @Input() public theme: string | undefined;
  private themingServiceSubscription: Subscription;

  constructor(private el: ElementRef,
              private renderer: Renderer,
              private elementRef: ElementRef,
              private viewContainerRef: ViewContainerRef,
              private themingService: ThemingService,
              private logService: LogService) {
  }

  public ngOnInit() {
    this.themingServiceSubscription = this.themingService.getStyles().subscribe((themePromise) => {
        if (_.isNil(themePromise) ||
           _.isNil(themePromise.then))return;
        themePromise.then((theme) => {
        // this.logService.logJson(theme, 'ThemeSupport');
        this.theme = theme.activeTheme;
        const hasTheme = !_.isNil(theme) && !_.isNil(theme[this.theme]);
        if (!hasTheme) {
            if (this.theme) {
                this.logService.logEx(`Could not load theme ${this.theme}.`,
                                                            'ThemeSupport');
            }
            return;
        }
        // this.logService.logJson(style, 'ThemeSupport');
        this.theme = this.theme !== undefined ? this.theme : 'default';
        this.themePath = undefined;
        this.themeBlock = theme[this.theme].block;

        let block = [];
        if (this.themeBlock) {
            // this.logService.logJson(this.themeBlock, 'ThemeSupport');
            const _theme = this.themeBlock;
            if (typeof(_theme) === 'object' && _theme instanceof Array) {
                block = block.concat(_theme);
            } else if (typeof(_theme) === 'string') {
                block.push(_theme);
            }
            // this.setStyleBlock(this.styleBlock);
            }
        if (block.length) {
                this.setThemeBlock(block);
                // this.logService.logEx(`Setting theme block: ${JSON.stringify(block)}`,
                //                                                     'ThemeSupport');
            }
        });
    });
  }

  public ngOnDestroy() {
    if (this.themingServiceSubscription) {
        this.themingServiceSubscription.unsubscribe();
    }
  }

  public ngOnChanges(changes: any) {
    if (!changes) return;
    // if (changes.themeBlock.previousValue === changes.themeBlock.currentValue) return;
    // this.logService.logEx(`Got changes!`, 'ThemeSupport');
    // this.logService.logJson(changes, 'ThemeSupport');
  }

  public ngAfterViewInit() {
    // this.logService.logEx(`ngAfterViewInit`, 'ThemeSupport');
    // original code
    domready(() => {
        this.applyStylesEx();
    });
  }

  private setThemeBlock(style: any) {
      if (typeof(style) === 'string') {
          this.setStyleForElement(style);
      }
      if (typeof(style) === 'object' && style instanceof Array) {
          this.setStyleForElement(style);
      }
  }

  private getIdentityAttribute() {
      for (let attr of this.elementRef.nativeElement.attributes) {
          if (/^_nghost/.test(attr.name) ||
            /^_ngcontent/.test(attr.name) ||
            /^_styled/.test(attr.name)) {
              // this.logService.logEx(`Got identity attribute: ${attr.name}`, 'ThemeSupport');
              return attr.name;
          }
      }
      return false;
  }

  private applyStylesEx() {}

  private setArrayStylesForElement(styles: string[]) {
      for (let style of styles) {
          this.setStyleForElement(style);
      }
  }

  private setStyleForElement(styles: string | string[]) {
      // get styling encapsulation attribute
      let idAttr = this.getIdentityAttribute();
      // create own encapsulation attribute, if not exist
      if (!idAttr) {
          idAttr = '_styled-' + Math.random().toString(36).slice(2, 6);
          this.elementRef.nativeElement.setAttribute(idAttr, '');
      }

      // get or create <style id="styled-directive-block"> element
      let styleElList = document.querySelectorAll('style#styled-directive-block');
      let styleEl: any = undefined;
      if (!styleElList.length) {
          styleEl = document.createElement('style');
          styleEl.type = 'text/css';
          styleEl.id = 'styled-directive-block';
      } else {
          styleEl = styleElList[0];
      }

      // creating css style block for current element
      let stylesArray = (typeof(styles) === 'string') ? [styles] : styles;
      let styleString = '';
      for (let style of stylesArray) {
          if (!style) continue;
          if (styleString !== '') styleString += `  \n`;
          if (style[0] === '<') {
              style = style.slice(1);
          } else {
              style = ' ' + style;
          }
          styleString += `[${idAttr}]${style}`;
      }
      // add style to <style> element
      if (styleString) styleEl.innerHTML += `  \n` + styleString;
      let head  = document.getElementsByTagName('head')[0];
      head.appendChild(styleEl);
    //   this.logService.logEx(`Appended style element: ${JSON.stringify(styleString)}`,
    //                                                                     'ThemeSupport');
    }

    private setThemePath(stylePath: string) {
      // checking stylePath for existing
      for (let i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].href === stylePath) {
              return;
          }
      }

      // fix
      if (document.querySelectorAll(`head link[href="${stylePath}"]`).length) return;

      let link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = `${stylePath}`;
      let head  = document.getElementsByTagName('head')[0];
      head.appendChild(link);
    }
}
