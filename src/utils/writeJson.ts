export const writeJson = (path: string, data: any) => {
  const stringData = JSON.stringify(data, null, 2);

  Deno.writeTextFileSync(path, stringData);
}
