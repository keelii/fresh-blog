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

        <meta name="description" content="__ you don&#39;t know yet" />
        <meta
          name="keywords"
          content="前端开发,编程,javascript,typescript,css,html,nodejs,python,java"
        />
        <meta name="author" content="keelii" />
        <meta name="msvalidate.01" content="5A15ECDE419A3094963BBE769402AFF3" />
        <meta
          name="360-site-verification"
          content="4b136227b95b65dac3fb4c4648b3f768"
        />
        <meta name="sogou_site_verification" content="O1Cfr1TQve" />
        <meta name="baidu-site-verification" content="eLbyQls8CF" />
      </Head>
      {props.children}
    </Fragment>
  );
}
