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

const Items = [
  { value: '1', label: 'Admin' },
  { value: '2', label: 'SuperAdmin' },
  { value: '3', label: 'User' }
];


const { values, touched, errors, handleBlur, handleChange, setFieldValue, handleSubmit } = useFormik({
  initialValues: {
    name: "",
    // category: []  for multiselect
    //  category: Items[0].value  for multiselect
  },
  validationSchema: '', // Add schema if needed
  onSubmit
});

// const dropDownChange = (e) => {
//   const { name, value } = e.target;
//   setFieldValue(name, value);
// };

// // In your JSX
// <div className="mb-2">
//   <label className="form-label">Category</label>
//   <FormDropDown
//     onChange={dropDownChange}
//     name="category"
//     options={Items}
//     multiselect={true}
//     value={values.category}
//     classnm="fs-13 mb-3 form-control length_count"
//   />
// </div>
