import { IStyleConfigItem } from './IStyleConfigItem';

export interface IStyleConfig {
    activeTheme?: string;
    [index: string]: IStyleConfigItem;
}
