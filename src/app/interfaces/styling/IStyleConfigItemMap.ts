import { IStyleConfigItem } from './IStyleConfigItem';

export interface IStyleConfigItemMap {
    name: string;
    configItem: IStyleConfigItem;
    isActive?: boolean;
}
