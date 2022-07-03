/** @jsx h */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import type { ComponentChildren } from "preact";

interface LayoutProps {
  title: string;
  children: ComponentChildren;
}

export function Layout(props: LayoutProps) {
  return (
    <Fragment>
      <Head>
        <title>{props.title}</title>
      </Head>
      {props.children}
    </Fragment>
  );
}
