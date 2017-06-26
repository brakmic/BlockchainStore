import { Injectable } from '@angular/core';
import { ColorHelper } from './theme.constants';
import * as _ from 'lodash';

@Injectable()
export class ThemeConfigProvider {

  public retail = {
    work_area: '#ffffff',
    module_area: '#ffffff'
  };

  public basic = {
    default: '#ffffff',
    defaultText: '#ffffff',
    border: '#dddddd',
    borderDark: '#aaaaaa'
  };

  // main functional color scheme
  public colorScheme = {
    primary: '#00abff',
    info: '#40daf1',
    success: '#8bd22f',
    warning: '#e7ba08',
    danger: '#f95372'
  };

  // dashboard colors for charts
  public dashboardColors = {
    blueStone: '#40daf1',
    surfieGreen: '#00abff',
    silverTree: '#1b70ef',
    gossip: '#3c4eb9',
    white: '#ffffff'
  };

  public conf = {
    theme: {
      name: 'default'
    },
    colors: {
      default: this.basic.default,
      defaultText: this.basic.defaultText,
      border: this.basic.border,
      borderDark: this.basic.borderDark,

      primary: this.colorScheme.primary,
      info: this.colorScheme.info,
      success: this.colorScheme.success,
      warning: this.colorScheme.warning,
      danger: this.colorScheme.danger,

      primaryLight: ColorHelper.tint(this.colorScheme.primary, 30),
      infoLight: ColorHelper.tint(this.colorScheme.info, 30),
      successLight: ColorHelper.tint(this.colorScheme.success, 30),
      warningLight: ColorHelper.tint(this.colorScheme.warning, 30),
      dangerLight: ColorHelper.tint(this.colorScheme.danger, 30),

      primaryDark: ColorHelper.shade(this.colorScheme.primary, 15),
      infoDark: ColorHelper.shade(this.colorScheme.info, 15),
      successDark: ColorHelper.shade(this.colorScheme.success, 15),
      warningDark: ColorHelper.shade(this.colorScheme.warning, 15),
      dangerDark: ColorHelper.shade(this.colorScheme.danger, 15),

      dashboard: {
        blueStone: this.dashboardColors.blueStone,
        surfieGreen: this.dashboardColors.surfieGreen,
        silverTree: this.dashboardColors.silverTree,
        gossip: this.dashboardColors.gossip,
        white: this.dashboardColors.white
      },

      custom: {
        dashboardLineChart: this.basic.defaultText,
        dashboardPieChart: ColorHelper.hexToRgbA(this.basic.defaultText, 0.8)
      },

      retail: this.retail
    }
  };

  constructor() {}

  public get() {
    return this.conf;
  }

  public changeTheme (theme) {
    _.merge(this.get().theme, theme);
  }

  public changeColors (colors) {
    _.merge(this.get().colors, colors);
  }
}
