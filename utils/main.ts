export function getTomlString(content: string) {
    const lines = content.split("\n")
    const toml: string[] = []

    let count = 0
    let i

    for (i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("+++")) {
        count++;
        continue;
      } else {
        toml.push(lines[i])
      }
      if (count === 2) {
        break
      }
    }

    return [toml.join("\n").trim(), lines.slice(i).join("\n").trim()]
  }