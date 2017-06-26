import { MissingTranslationHandler, MissingTranslationHandlerParams } from 'ng2-translate';

export class BcsMissingTranslationHandler implements MissingTranslationHandler {
    public handle(params: MissingTranslationHandlerParams) {
        return `XX${params.key}`;
        // return 'UNKNOWN';
    }
}
