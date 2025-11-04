import { Controller } from 'react-hook-form';
import {
  FormGroup,
  Input,
  Label
} from 'reactstrap';

const RequiredMark = () => {
  return (
    <span style={{ color: "red", marginLeft: 4, fontSize: 12 }}>*</span>
  )
}

const FormInput = ({ control, labelId, name, rules, errors, intl , isRequired }) => {
  return (
    <FormGroup>
      <Label for={name} className='text-small align-items-center d-flex'>
        <div>
          {intl.formatMessage({ id: labelId })}
        </div>
        {isRequired && <RequiredMark />}
      </Label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={field => <Input id={name} {...field} className={errors[name] ? 'is-invalid' : ''} />}
      />
      {errors[name] && <div className="text-danger">{errors[name].message}</div>}
    </FormGroup>
  );
};

export default FormInput;