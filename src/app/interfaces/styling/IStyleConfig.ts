import { IStyleConfigItem } from './IStyleConfigItem';

export interface IStyleConfig {
    activeTheme?: any;
    [index: string]: IStyleConfigItem;
}
