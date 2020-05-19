export default function validateSMR(fields, getValidate) {
  return values => {
    console.log(values);
    const fs =
      values.Polarity === "Operator's Choice"
        ? { ...fields, 'Image file': { ...fields['Image file'], required: true } }
        : fields;
    return getValidate(fs)(values);
  };
}
