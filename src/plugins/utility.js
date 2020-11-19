export function getSetArray(data) {
  if (data && data['@set']) {
    return data['@set'];
  }
  return [];
}
