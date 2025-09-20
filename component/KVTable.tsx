import {KVItem} from "../kv.ts"
import {Base} from "./Base.tsx"
import {UVItem} from "../couch_db.ts"

function JsonTable({json}: { json: UVItem[] }) {
  return (
    <table>
      <thead>
        <tr>
          {Object.keys(json[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {json.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value, i) => (
              <td key={i}>{String(value)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export function KVTable({kv, title, items}: {title: string, kv: KVItem<any>[], items: UVItem[]}) {
  return (
    <Base title={title}>
      <div style={{fontSize: "14px"}}>
        <h2>UVItem</h2>
        <JsonTable json={items}  />
        <h2>PVItem</h2>
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
