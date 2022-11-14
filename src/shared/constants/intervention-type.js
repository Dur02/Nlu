export const DM = 1;
export const NLU = 2;

export const interventionTypeOptions = [{
  label: 'DM',
  value: DM,
}, {
  label: 'NLU',
  value: NLU,
}];

export const getInterventionTypeText = (inventionType) => {
  if (inventionType === DM) {
    return 'DM';
  }
  return 'NLU';
};
