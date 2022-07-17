/** @jsx h */
import { h } from "preact";
import {BLOG_CONFIG} from "../config.ts"

// const site360Script = "!function(e){function t(e){for(var t=location.href,n=t.split(\"\").reverse(),r=e.split(\"\"),i=[],s=0,o=16;o>s;s++)i.push(r[s]+(n[s]||\"\"));return i.join(\"\")}var n=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,r=e.location.href;if(r&&!n.test(r)&&window.navigator.appName){var i=\"//s.360.cn/so/zz.gif\",o=\"0cbb5a2bef902d89e9dc9bb5f742b91c\",u=t(o),a=new Image;r&&(i+=\"?url=\"+encodeURIComponent(r)),o&&(i+=\"&sid=\"+o),u&&(i+=\"&token=\"+u),o&&(a.src=i)}}(window);"

export function Container(props: any) {
  return (
    <div className="container">
      {props.children}
      <footer id="footer">
        <p style={{ color: "#999", fontSize: 12, display: "flex", alignItems: "center" }}>
          Copyright &copy; {new Date().getFullYear()} keelii, Powered by
          <a style={{margin: "0 0.5em"}} href="https://deno.com/deploy">Deno Deploy</a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3c9.941 0 18 8.059 18 18h-3c0-8.284-6.716-15-15-15V3zm0 7c6.075 0 11 4.925 11 11h-3a8 8 0 0 0-8-8v-3zm0 7a4 4 0 0 1 4 4H3v-4z"/></svg>
          <a href={`${BLOG_CONFIG.url}/${BLOG_CONFIG.rss}`}>RSS</a>
        </p>
      </footer>
      {/*<script dangerouslySetInnerHTML={{ __html: site360Script }} />*/}
    </div>
  );
}
