import { WidgetProvider, WidgetType } from 'app/enums';

export interface IWidget {
    id: string;
    name?: string;
    description?: string;
    provider: WidgetProvider;
    type: WidgetType;
    instance: any;
    destroy(): void;
}
