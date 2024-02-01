









import { useState } from 'react';
import { TextInput } from '@mantine/core';
import classes from './input.module.css';
import db from '@yusuf-yeniceri/easy-storage'


export function FloatingLabelInput({label, placeholder, width, type, path}:{label:string, placeholder:string, width: string, type: string|null, path: string}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      required
      type = {(type != null) ? 'password' : 'text'}
      classNames={classes}
      value={value}
      onChange={(event) =>{ setValue(event.currentTarget.value); db.ref(`uigpt/${path}`).set({value:event.currentTarget.value})}}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
      width={width}
    />
  );
}