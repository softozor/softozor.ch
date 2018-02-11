export function objectifyForm(
  array: JQuery.NameValuePair[]
): { [key: string]: string } {
  let returnArray: { [key: string]: string } = {};
  for (var i = 0; i < array.length; i++) {
    returnArray[array[i]['name']] = array[i]['value'];
  }
  return returnArray;
}
