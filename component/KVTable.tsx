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
              <th>Op</th>
            </tr>
          </thead>
          {kv.map(({k, v}) => (
            <tr key={k.join(":")}>
              <td>{k.join(":")}</td>
              <td>{Array.isArray(v) ? `${v.join(",")}` : v}</td>
              <td>
                <a href={"/kv?k=" + encodeURIComponent(k.join(":"))}>Delete</a>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </Base>
  )
}
