const brk = " '"

export function capitalize(str: string) {
  let res = ''
  for (let i = 0; i < str.length; i++) {
    if (i === 0 || (brk.includes(str[i - 1]) && !brk.includes(str[i + 1]))) {
      res += str[i].toUpperCase()
    } else {
      res += str[i]
    }
  }
  return res
}
