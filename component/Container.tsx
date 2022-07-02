/** @jsx h */
import { h } from "preact";

export function Container(props: any) {
    return (
        <div className="container">{props.children}</div>
    )
}