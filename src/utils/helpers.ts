export function isEmpty(str: any) {
  return (
    str === undefined ||
    str === null ||
    typeof str !== 'string' ||
    str.match(/^ *$/) !== null
  );
}

export function generateRandomHash(length: number): string {
  if (!length) {
    length = 20;
  }

  let result: string = '';
  const characters: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
