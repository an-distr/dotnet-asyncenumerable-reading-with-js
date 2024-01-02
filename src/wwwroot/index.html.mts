import { JsonDeserializerStream } from "./JsonDeserializerStream.mjs"
import { PeekStream } from "./PeekStream.mjs"
import { toAsyncIterableIterator } from "./toAsyncIterableIterator.mjs"

(async () => {

  const txtCount = document.getElementById("txtCount") as HTMLSpanElement
  const tblPosts = document.getElementById("tblPosts") as HTMLTableElement

  const url = new URL("/api/posts", location.href)
  const response = await fetch(url)
  const stream = response.body
  if (!stream) {
    alert(`fetch(${url.href}) failed.`)
    return
  }

  const posts = stream
    .pipeThrough(new TextDecoderStream)
    .pipeThrough(new JsonDeserializerStream())
    .pipeThrough(new PeekStream((_, i) => txtCount.textContent = `${(i + 1).toLocaleString()} (Fetching)`))

  for await (const post of toAsyncIterableIterator(posts)) {
    const row = tblPosts.tBodies[0].insertRow(-1)
    row.insertCell(-1).textContent = post.userID
    row.insertCell(-1).textContent = post.id
    row.insertCell(-1).textContent = post.title
    row.insertCell(-1).textContent = post.body
  }

  txtCount.textContent = txtCount.textContent!.slice(0, -"(Fetching)".length) + "(Done)"

})()