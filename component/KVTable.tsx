import {KVItem} from "../kv.ts"
import {Base} from "./Base.tsx"

export function KVTable({kv, title}: {title: string, kv: KVItem<any>[]}) {
  return (
    <Base title={title}>
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
                <a href={"/admin/kv?k=" + encodeURIComponent(k.join(":"))}>Delete</a>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </Base>
  )
}
