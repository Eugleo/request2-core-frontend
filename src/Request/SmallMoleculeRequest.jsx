export default function validateSMR(fields, getValidate) {
  return values => {
    const fs =
      values.Polarity === "Operator's Choice"
        ? {
            ...fields,
            'structure-or-gel-image/image-file': {
              ...fields['structure-or-gel-image/image-file'],
              required: true,
            },
          }
        : fields;
    return getValidate(fs)(values);
  };
}
