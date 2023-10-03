const matchVersion = (data: string): RegExpMatchArray | null =>
  data.match(/Version: (?<version>.*)(?=\r\n|\r|\n|\s)/);

const isValidVersion = (version: string): boolean => /^\d+\.\d+$/.test(version);

const hasValidPhoneDetail = (data: string): boolean => /Phone: \+1-\d{3}-\d{3}-\d{4}/.test(data);

export function change(data: string, program: string, version: string): string {
  const dataVersion = matchVersion(data)?.groups?.version;
  if (!dataVersion) throw new Error('Version missing from data');

  if (!isValidVersion(dataVersion) || !hasValidPhoneDetail(data)) return 'ERROR: VERSION or PHONE';
  const finalVersion = dataVersion === '2.0' ? dataVersion : version;

  return `Program: ${program} Author: g964 Phone: +1-503-555-0090 Date: 2019-01-01 Version: ${finalVersion}`;
}
