import { WidgetProvider, WidgetType } from 'app/enums';
import { IWidgetConfig } from './IWidgetConfig';

export interface IWidgetDescriptor {
    id: string;
    name?: string;
    description?: string;
    provider: WidgetProvider;
    type: WidgetType;
    config: IWidgetConfig;
};
