export type FieldProps = { path: string; description?: string; label?: string; hint?: string };

export type StyledFieldProps = FieldProps & { className?: string };

export type ChoicesFieldProps = FieldProps & { choices: string[] };
