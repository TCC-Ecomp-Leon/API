const backtrackList = <T>(
  elements: T[],
  index: number,
  actualSolution: T[]
): T[][] => {
  if (index >= elements.length) return [actualSolution];

  const solutionsWith = backtrackList(elements, index + 1, [
    ...actualSolution,
    elements[index],
  ]);

  const solutionsWithout = backtrackList(elements, index + 1, actualSolution);

  return [...solutionsWith, ...solutionsWithout];
};

export const backtrackObject = (
  obj: any,
  considerEmpty: boolean,
  considerFull: boolean
): object[] => {
  const keys = Object.keys(obj);

  const fieldPossibilities = backtrackList(keys, 0, []);

  const ret: any[] = [];

  fieldPossibilities.forEach((possibility) => {
    if (possibility.length === 0) {
      if (considerEmpty) {
        ret.push({});
      }
    } else if (possibility.length === keys.length) {
      if (considerFull) {
        ret.push(obj);
      }
    } else {
      let mountObject: any = {};

      possibility.forEach((field) => {
        mountObject = {
          ...mountObject,
          [field]: obj[field],
        };
      });

      ret.push(mountObject);
    }
  });

  return ret;
};
