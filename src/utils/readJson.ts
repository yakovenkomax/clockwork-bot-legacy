export const readJson = (path: string) => {
  const sourceData = Deno.readTextFileSync(path);
  const data = JSON.parse(sourceData);

  return data;
}
