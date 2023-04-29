import { FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useController } from "react-hook-form";

interface RHFDateTimePickerProps {
  name: string;
  control: any;
  label: string;
}

const RHFDateTimePicker: FC<RHFDateTimePickerProps> = ({
  name,
  control,
  label,
}) => {
  const {
    field: { ref, onChange, value },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    defaultValue: new Date(),
  });

  return (
    <DatePicker
      selected={value || null}
      onChange={(date: any) => onChange(date)}
      withPortal
      showTimeSelect
      timeIntervals={1}
      timeFormat="HH:mm:ss"
      dateFormat="yyyy-MM-dd HH:mm:ss"
      customInput={<input type="text" />}
      placeholderText={label}
      shouldCloseOnSelect
      isClearable
      autoComplete="off"
      popperClassName="date-time-picker-popper"
      wrapperClassName="date-time-picker-wrapper"
      className="date-time-picker-input"
    />
  );
};

export default RHFDateTimePicker;
