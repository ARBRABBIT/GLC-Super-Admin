export const transformTable = <T>(table: any[][]): T[] => {
  if (!table || table.length < 2) return [];
  const [headers, ...rows] = table;
  return rows.map((row) => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj as T;
  });
};
