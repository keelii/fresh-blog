import {KVItem} from "../kv.ts"
import {Base} from "./Base.tsx"

export function KVTable({kv}: {kv: KVItem}) {
  return (
    <Base>
      <div style={{fontSize: "14px"}}>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          {kv.map(({k, v}) => (
            <tr>
              <td>{k.join(":")}</td>
              <td>{Array.isArray(v) ? `${v.join(",")}` : v}</td>
            </tr>
          ))}
        </table>
      </div>
    </Base>
  )
}
