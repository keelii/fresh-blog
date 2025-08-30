export function HtmlResponse(html: string = "",
                             headers: Record<string, string> | Headers = {},
                             responseInit: ResponseInit = {}) {
  if (headers instanceof Headers) {
    headers.append("content-type", "text/html; charset=utf-8");
  } else {
    headers = new Headers({ "content-type": "text/html; charset=utf-8", ...headers })
  }
  return new Response(html, {
    headers,
    ...responseInit
  })
}
export function TextResponse(text: string, responseInit: ResponseInit = {}) {
  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
    ...responseInit
  })
}
export function XmlResponse(xml: string, responseInit: ResponseInit = {}) {
  return new Response(xml, {
    headers: {
      "content-type": "text/xml; charset=utf-8",
    },
    ...responseInit
  })
}

export function NotFound() {
 return new Response("<h3>Not Found</h3> <a href='/'>back</a> »", {
   status: 404,
   headers: {
     "content-type": "text/html; charset=utf-8",
   }
 });
}

export function ServerError() {
  return new Response("<h3>Internal Server Error</h3> <a href='/'>back</a> »", {
    status: 500,
    headers: {
      "content-type": "text/html; charset=utf-8",
    }
  })
}
