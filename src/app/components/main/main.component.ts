import './main.loader';
import { Component, ViewEncapsulation,
         OnInit, OnChanges, OnDestroy,
         AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService, SessionService } from 'app/services';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { IAppState } from 'stores';
import * as _ from 'lodash';

const domready = require('domready');
// const normalize = '../../../assets/styles/normalize.css';
// const style = './app.component.scss';

@Component({
  selector: 'bcs-root',
  templateUrl: './main.component.html',
  styleUrls: [
    './main.component.scss'
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class MainComponent implements OnInit,
                                      OnChanges,
                                      OnDestroy,
                                      AfterViewInit {

  private sessionSubscription: Subscription;
  /**
   * App constructor
   * @param {Router}         private router     Default router
   * @param {ActivatedRoute} private route      Current route
   * @param {LogService}     private logService Logging service
   * @param {SessionService} private sessionService Session service
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private logService: LogService,
              private sessionService: SessionService) {
  }

  public ngOnInit() {
    this.logService.logEx(`App initialized.`, 'Main');
  }

  public ngOnDestroy() {
    this.destroySubscriptions();
  }

  public ngAfterViewInit() {
    domready(() => {
      this.initSubscriptions();
    });
  }

  // tslint:disable-next-line:no-empty
  public ngOnChanges(changes: any) {

  }

  private initSubscriptions() {
    // this.sessionSubscription = this.sessionService.getSessionStatus().subscribe((state) => {
    //   if (_.isNil(state) ||
    //       _.isNil(state.UserData)) {
    //         this.logService.logEx('Session reset.', 'Main');
    //         try {
    //           this.router.navigate(['logon']);
    //         } catch (error) {
    //           this.logService.logJson(error, 'Main');
    //         }
    //       }
    // });
  }

  private destroySubscriptions() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

}
