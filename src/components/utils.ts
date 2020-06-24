export const toMemoryString = (bytes: number, digits: number=2): [string, string] => {
  if(bytes === 0) {
    return ['0', ''];
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const power = Math.floor(Math.log(bytes) / Math.log(1000));
  return [`${(bytes / Math.pow(1000, power)).toFixed(digits)}`, units[Math.min(units.length - 1, power)]]
}

export const isSelected = (rowIndex: number, {from, to}: {from: number, to: number}): boolean => {
  if(from === -1 && to === -1)
    return false;
  return rowIndex >= Math.min(from, to) && rowIndex <= Math.max(from, to)
}