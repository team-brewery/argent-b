const argentColorsArray = [
  "02BBA8",
  "29C5FF",
  "0078A4",
  "FFBF3D",
  "FFA85C",
  "FF875B",
  "FF675C",
  "FF5C72",
]

export const getColor = (name: string) => {
  return argentColorsArray[Math.floor(Math.random() * argentColorsArray.length)];
}

export const getAccountTypeImageUrl = (name: string) => {
  const color = getColor(name)
  return `https://eu.ui-avatars.com/api?name=${name}&background=${color}&color=fff`
}
