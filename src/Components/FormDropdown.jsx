import Select from 'react-select';

export default function FormDropDown(props) {
  const {
    name,
    options,
    onChange,
    value,
    classnm,
    multiselect
  } = props;

  const handleChange = (selectedOption) => {
    if (multiselect) {
      const values = selectedOption ? selectedOption.map(opt => opt.value) : [];
      onChange({ target: { name, value: values } });
    } else {
      onChange({ target: { name, value: selectedOption ? selectedOption.value : "" } });
    }
  };

  const getSelectedOptions = () => {
    if (multiselect) {
      return options.filter(option => value.includes(option.value));
    } else {
      return options.find(option => option.value === value) || null;
    }
  };

  return (
    <Select
      isMulti={multiselect}
      options={options}
      value={getSelectedOptions()}
      onChange={handleChange}
      name={name}
      className={classnm}
      classNamePrefix="react-select"
    />
  );
}
