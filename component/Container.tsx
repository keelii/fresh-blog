/** @jsx h */
import { h } from "preact";

// const site360Script = "!function(e){function t(e){for(var t=location.href,n=t.split(\"\").reverse(),r=e.split(\"\"),i=[],s=0,o=16;o>s;s++)i.push(r[s]+(n[s]||\"\"));return i.join(\"\")}var n=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi,r=e.location.href;if(r&&!n.test(r)&&window.navigator.appName){var i=\"//s.360.cn/so/zz.gif\",o=\"0cbb5a2bef902d89e9dc9bb5f742b91c\",u=t(o),a=new Image;r&&(i+=\"?url=\"+encodeURIComponent(r)),o&&(i+=\"&sid=\"+o),u&&(i+=\"&token=\"+u),o&&(a.src=i)}}(window);"

export function Container(props: any) {
  return (
    <div className="container">
      {props.children}
      <footer id="footer">
        <p style={{ color: "#999", fontSize: 12 }}>
          Copyright &copy; 2022 keelii, Powered by <a href="https://deno.com/deploy">Deno Deploy</a>
        </p>
      </footer>
      {/*<script dangerouslySetInnerHTML={{ __html: site360Script }} />*/}
    </div>
  );
}
