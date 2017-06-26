import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Observable';
import { ITranslation, IConfig } from '../../interfaces';
const config: IConfig = require('config.json');
import 'rxjs/Rx';
import * as _ from 'lodash';

export class TranslationProvider implements TranslateLoader {
    private config: IConfig;
    constructor() {
    }
    public getTranslation(language: string): Observable<any> {

      return Observable.fromPromise(window.fetch(config.translationApi + `api/translator?language=${language}`).then((response) => {
          return response.json();
        }).then((json: Object) => {
          const translation: ITranslation[] = json as ITranslation[];
          console.log(`Retrieved ${translation.length} translation entries for language: ${language}.`);
          // this.languages.set(language, translation);
          // return translation;
          // console.log(translation);
          const mapped = _.map(translation, (all: ITranslation) => {
            const key = all.Key;
            let obj = {};
            obj[key] = all.Content;
            return obj;
          });
          let trans = {};
          _.each(mapped, (obj) => {
            trans = Object.assign({}, trans, obj);
          });
          // console.log(trans);
          return trans;
      }));
    }
}
