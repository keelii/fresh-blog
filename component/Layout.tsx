import { Fragment } from "preact";
import type { ComponentChildren } from "preact";
import {
  BLOG_AUTHOR,
  BLOG_DESCRIPTION,
  BLOG_KEYWORDS,
  BLOG_URL
} from "../config.ts";

interface LayoutProps {
  title: string;
  canonical?: string;
  children: ComponentChildren;
}

const gaScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-79264835-1');
`;

const resetCSS = "html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}ul{list-style:none}button,input,select{margin:0}html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}img,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}"
const wysiwygCSS = `/*! wysiwyg.css v0.0.3 | MIT License | github.com/jgthms/wysiwyg.css */
.wysiwyg{line-height:1.6;font-family:"Source Serif Pro","Crimson Text","Noto Serif SC","Noto Serif CJK SC","Noto Serif CJK","Source Han Serif SC","Source Han Serif CN","Source Han Serif",source-han-serif-sc,-apple-system,serif}.wysiwyg a{text-decoration:none}.wysiwyg a:hover{border-bottom:1px solid}.wysiwyg abbr{border-bottom:1px dotted;cursor:help}.wysiwyg cite{font-style:italic}.wysiwyg hr{background:#e6e6e6;border:none;display:block;height:1px;margin-bottom:1.4em;margin-top:1.4em}.wysiwyg img{vertical-align:text-bottom}.wysiwyg ins{background-color:lime;text-decoration:none}.wysiwyg mark{background-color:#ff0}.wysiwyg small{font-size:.8em}.wysiwyg strong{font-weight:600}.wysiwyg sub,.wysiwyg sup{font-size:.8em}.wysiwyg sub{vertical-align:sub}.wysiwyg sup{vertical-align:super}.wysiwyg p,.wysiwyg dl,.wysiwyg ol,.wysiwyg ul,.wysiwyg blockquote,.wysiwyg pre,.wysiwyg table{margin-bottom:1.4em}.wysiwyg p:last-child,.wysiwyg dl:last-child,.wysiwyg ol:last-child,.wysiwyg ul:last-child,.wysiwyg blockquote:last-child,.wysiwyg pre:last-child,.wysiwyg table:last-child{margin-bottom:0}.wysiwyg p:empty{display:none}.wysiwyg h1,.wysiwyg h2,.wysiwyg h3,.wysiwyg h4,.wysiwyg h5,.wysiwyg h6{font-weight:600;line-height:1.2}.wysiwyg h1:first-child,.wysiwyg h2:first-child,.wysiwyg h3:first-child,.wysiwyg h4:first-child,.wysiwyg h5:first-child,.wysiwyg h6:first-child{margin-top:0}.wysiwyg h1{font-size:2.4em;margin-bottom:.5833333333em;margin-top:.5833333333em;line-height:1}.wysiwyg h2{font-size:1.6em;margin-bottom:.875em;margin-top:1.75em;line-height:1.1}.wysiwyg h3{font-size:1.3em;margin-bottom:1.0769230769em;margin-top:1.0769230769em}.wysiwyg h4{font-size:1.2em;margin-bottom:1.1666666667em;margin-top:1.1666666667em}.wysiwyg h5{font-size:1.1em;margin-bottom:1.2727272727em;margin-top:1.2727272727em}.wysiwyg h6{font-size:1em;margin-bottom:1.4em;margin-top:1.4em}.wysiwyg dd{margin-left:1.4em}.wysiwyg ol,.wysiwyg ul{list-style-position:outside;margin-left:1.4em}.wysiwyg ol{list-style-type:decimal}.wysiwyg ol ol{list-style-type:lower-alpha}.wysiwyg ol ol ol{list-style-type:lower-roman}.wysiwyg ol ol ol ol{list-style-type:lower-greek}.wysiwyg ol ol ol ol ol{list-style-type:decimal}.wysiwyg ol ol ol ol ol ol{list-style-type:lower-alpha}.wysiwyg ul{list-style-type:disc}.wysiwyg ul ul{list-style-type:circle}.wysiwyg ul ul ul{list-style-type:square}.wysiwyg ul ul ul ul{list-style-type:circle}.wysiwyg ul ul ul ul ul{list-style-type:disc}.wysiwyg ul ul ul ul ul ul{list-style-type:circle}.wysiwyg blockquote{border-left:4px solid #e6e6e6;padding:.6em 1.2em;font-family:"Crimson Text",STKaiti,KaiTi,serif}.wysiwyg blockquote p{margin-bottom:0}.wysiwyg code,.wysiwyg kbd,.wysiwyg samp,.wysiwyg pre{-moz-osx-font-smoothing:auto;-webkit-font-smoothing:auto;background-color:rgba(242,242,242,.5);color:#333;font-size:.9em;font-family:"Latin Modern Mono","SF Mono",monaco,Consolas,"Noto Serif SC","Noto Serif CJK SC","Noto Serif CJK","Source Han Serif SC","Source Han Serif CN","Source Han Serif",source-han-serif-sc}.wysiwyg code,.wysiwyg kbd,.wysiwyg samp{border-radius:3px;line-height:1.7777777778;padding:.1em .4em .2em;vertical-align:baseline}.wysiwyg pre{overflow:auto;padding:1em 1.2em}.wysiwyg pre code{background:none;font-size:1em;line-height:1em}.wysiwyg figure{margin-bottom:2.8em;text-align:center}.wysiwyg figure:first-child{margin-top:0}.wysiwyg figure:last-child{margin-bottom:0}.wysiwyg figcaption{font-size:.8em;margin-top:.875em}.wysiwyg table{width:100%}.wysiwyg table pre{white-space:pre-wrap}.wysiwyg th,.wysiwyg td{font-size:1em;padding:.7em;border:1px solid #e6e6e6;line-height:1.4}.wysiwyg thead tr,.wysiwyg tfoot tr{background-color:#f5f5f5}.wysiwyg thead th,.wysiwyg thead td,.wysiwyg tfoot th,.wysiwyg tfoot td{font-size:0.9em;padding:.7777777778em}.wysiwyg thead th code,.wysiwyg thead td code,.wysiwyg tfoot th code,.wysiwyg tfoot td code{background-color:#fff}.wysiwyg tbody tr{background-color:#fff} `
const customCSS = `
  header { margin-bottom: 40px; }
  .wysiwyg iframe { margin-bottom: 1.4em; aspect-ratio: 4/3; }
  #toc .toggle {
    position: absolute;
    width: 1em;
    height: 2em;
    line-height: 2em;
    cursor: pointer;
    background: #f1f1f1;
    left: -1em;
    top: 50%;
    margin-top: -1em;
    text-align: center;
  }
  #toc a { color: #5f4b32; }
  #toc.show { right: 0; }
  #toc {
      position: fixed;
      right: -19.5em;
      top: 0;
      height: 100%;
      width: 20em;
      background: #f1f1f1;
  }
  #toc nav { height: 100%; overflow-x: hidden; overflow-y: auto; }
  #toc nav>ol { padding: 1em; }
  .wysiwyg a:hover { border: none }
  .container article a:hover, .container .posts a:hover { border-bottom: 1px solid; }
  .meta { color: #666; font-size: 0.875em; }
  .highlight { margin-bottom: 1.4em; }
  .comment { margin-top: 40px; margin-bottom: 40px; }
  .container .anchor {
    user-select: none;
    color: #666;
    display: inline-block;
    width: 26px;
    text-align: center;
    margin-left: -26px;
    visibility: hidden;
  }
  .container { max-width: 42em; margin: 0 auto; padding: 40px 0; word-break: break-word; }
  @media screen and (max-width: 768px) {
    .container { width: 100%; padding: 40px 2em; font-size: 16px }
    .posts li { padding: 0.2em 0; margin-left: -1.4em; }
  }
  .container header h1 { font-size: 1.8em; font-weight: 600; margin-bottom: 0; }
  .container .anchor:hover { border: none; }
  .container .utterances { max-width: none; }
  .wysiwyg pre>code { padding: 0; }
  h2:hover>.anchor,
  h3:hover>.anchor,
  h4:hover>.anchor,
  h5:hover>.anchor,
  h6:hover>.anchor { visibility: visible; }
  footer p { color: #666; font-size: 0.875em; display: flex; align-items: center }
  footer a { margin: 0 5px; text-decoration: none; }
  footer span { margin: 0 5px; text-decoration: none; }
  .eof {
    margin: 2.4em 0;
    border: none;
    height: 2.8em;
    background: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' width='1' height='1' fill='%23D9D9D9'/%3E%3Crect x='4' y='1' width='1' height='1' fill='%23D9D9D9'/%3E%3Crect x='3' y='2' width='1' height='1' fill='%23D9D9D9'/%3E%3Crect x='2' y='3' width='1' height='1' fill='%23D9D9D9'/%3E%3Crect x='1' y='4' width='1' height='1' fill='%23D9D9D9'/%3E%3Crect y='5' width='1' height='1' fill='%23D9D9D9'/%3E%3C/svg%3E") repeat-x center left;
  }
`
const codeCSS = `
  .token.comment, .token.prolog, .token.doctype, .token.cdata { color: slategray; }
  .token.punctuation { color: #999; }
  .token.namespace { opacity: .7; }
  .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #905; }
  .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #690; }
  .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #9a6e3a; }
  .token.atrule, .token.attr-value, .token.keyword { color: #07a; }
  .token.function, .token.class-name { color: #DD4A68; }
  .token.regex, .token.important, .token.variable { color: #e90; }
  .token.important, .token.bold { font-weight: bold; }
  .token.italic { font-style: italic; }
  .token.entity { cursor: help; }
`
const ALL_CSS = [resetCSS, wysiwygCSS, customCSS, codeCSS]

export function Layout(props: LayoutProps) {
  return (
    <Fragment>
      <head>
        <title>{props.title}</title>

        <meta name="description" content={BLOG_DESCRIPTION} />
        <meta name="keywords" content={BLOG_KEYWORDS} />
        <meta name="author" content={BLOG_AUTHOR} />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
        <link
          rel="canonical"
          href={BLOG_URL + (props.canonical || "")}
        />

        <meta name="msvalidate.01" content="5A15ECDE419A3094963BBE769402AFF3" />
        <meta
          name="360-site-verification"
          content="4b136227b95b65dac3fb4c4648b3f768"
        />
        <meta name="sogou_site_verification" content="O1Cfr1TQve" />
        <meta name="baidu-site-verification" content="eLbyQls8CF" />

        <style type={"text/css"}
               dangerouslySetInnerHTML={{__html: ALL_CSS.join("\n")}}></style>

        <script
          async={true}
          src="https://www.googletagmanager.com/gtag/js?id=UA-79264835-1"
        >
        </script>
        <script dangerouslySetInnerHTML={{ __html: gaScript }}></script>
      </head>
      <body>
      {props.children}
      </body>
    </Fragment>
  );
}
