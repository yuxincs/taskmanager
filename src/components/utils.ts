export const toMemoryString = (bytes: number, digits: number=2): [string, string] => {
  if(bytes === 0) {
    return ['0', ''];
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const power = Math.floor(Math.log(bytes) / Math.log(1024));
  return [`${(bytes / Math.pow(1024, power)).toFixed(digits)}`, units[Math.min(units.length - 1, power)]]
}

export const toLevel = (percentage: number, maxLevel: number=8): number =>
  Math.min(Math.ceil(maxLevel * percentage / 100), maxLevel);
