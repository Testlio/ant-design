import React, { Component } from 'react';
import moment from 'moment';
import Calendar from 'rc-calendar';
import RcDatePicker from 'rc-calendar/lib/Picker';
import classNames from 'classnames';
import Icon from '../icon';
import { getLocaleCode } from '../_util/getLocale';

function formatValue(value: moment.Moment | undefined, format: string): string {
  return (value && value.format(format)) || '';
}

export default class WeekPicker extends Component<any, any> {
  static defaultProps = {
    format: 'YYYY-Wo',
    allowClear: true,
  };
  constructor(props) {
    super(props);
    const value = props.value || props.defaultValue;
    if (value && !moment.isMoment(value)) {
      throw new Error(
        'The value/defaultValue of DatePicker or MonthPicker must be ' +
        'a moment object after `antd@2.0`, see: https://u.ant.design/date-picker-value',
      );
    }
    this.state = {
      value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value });
    }
  }
  weekDateRender = (current) => {
    const selectedValue = this.state.value;
    const { prefixCls } = this.props;
    if (selectedValue &&
        current.year() === selectedValue.year() &&
        current.week() === selectedValue.week()) {
      return (
        <div className={`${prefixCls}-selected-day`}>
          <div className={`${prefixCls}-date`}>
            {current.date()}
          </div>
        </div>
      );
    }
    return (
      <div className={`${prefixCls}-calendar-date`}>
        {current.date()}
      </div>
    );
  }
  handleChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    this.props.onChange(value, formatValue(value, this.props.format));
  }
  clearSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.handleChange(null);
  }
  render() {
    const {
      prefixCls, className, disabled, pickerClass, popupStyle,
      pickerInputClass, format, allowClear, locale, disabledDate,
    } = this.props;

    const pickerValue = this.state.value;
    const localeCode = getLocaleCode(this.context);
    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode);
    }

    const placeholder = ('placeholder' in this.props)
      ? this.props.placeholder : locale.lang.placeholder;

    const calendar = (
      <Calendar
        showWeekNumber
        dateRender={this.weekDateRender}
        prefixCls={prefixCls}
        format={format}
        locale={locale.lang}
        showDateInput={false}
        showToday={false}
        disabledDate={disabledDate}
      />
    );
    const clearIcon = (!disabled && allowClear && this.state.value) ? (
      <Icon
        type="cross-circle"
        className={`${prefixCls}-picker-clear`}
        onClick={this.clearSelection}
      />
    ) : null;
    const input = ({ value }) => {
      return (
        <span>
          <input
            disabled={disabled}
            readOnly
            value={(value && value.format(format)) || ''}
            placeholder={placeholder}
            className={pickerInputClass}
          />
          {clearIcon}
          <span className={`${prefixCls}-picker-icon`} />
        </span>
      );
    };
    return (
      <span className={classNames(className, pickerClass)}>
        <RcDatePicker
          {...this.props}
          calendar={calendar}
          prefixCls={`${prefixCls}-picker-container`}
          value={pickerValue}
          onChange={this.handleChange}
          style={popupStyle}
        >
          {input}
        </RcDatePicker>
      </span>
    );
  }
}
