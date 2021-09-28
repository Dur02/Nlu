/* eslint-disable global-require */

import React, { PureComponent } from 'react';
import { object, number, string } from 'prop-types';

export default class Chart extends PureComponent {
  componentDidMount() {
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    require('echarts/lib/component/title');

    const { options } = this.props;
    this.chart = echarts.init(this.chartElement);
    this.chart.setOption(options);
  }

  componentDidUpdate() {
    const { options } = this.props;
    this.chart.setOption(options);
  }

  render() {
    const { width, height, className, style } = this.props;

    return (
      <div
        ref={(element) => {
          this.chartElement = element;
        }}
        style={{ height, width, ...style }}
        className={className}
      />
    );
  }
}

Chart.displayName = __filename;
Chart.propTypes = {
  options: object.isRequired,
  width: number,
  height: number.isRequired,
  className: string,
  style: object,
};
Chart.defaultProps = {
  width: null,
  className: null,
  style: null,
};
