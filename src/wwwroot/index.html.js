import * as streams from "https://an-js-streams.pages.dev/mod.min.js"

(async () => {

  const txtCount = document.getElementById("txtCount")
  const tblPosts = document.getElementById("tblPosts")

  const url = new URL("/api/posts", location.href)
  const response = await fetch(url)
  if (!response.ok) {
    alert(`fetch(${url.href}) failed.`)
    return
  }

  const posts = response.body
    .pipeThrough(new streams.Utf8DecoderStream())
    .pipeThrough(new streams.JsonDeserializer().transform())
    .pipeThrough(new streams.PeekStream((_, i) => txtCount.textContent = `${(i + 1).toLocaleString()} (Fetching)`))

  for await (const post of streams.toAsyncIterableIterator(posts)) {
    const row = tblPosts.tBodies[0].insertRow(-1)
    row.insertCell(-1).textContent = post.userID
    row.insertCell(-1).textContent = post.id
    row.insertCell(-1).textContent = post.title
    row.insertCell(-1).textContent = post.body
  }

  txtCount.textContent = txtCount.textContent.slice(0, -"(Fetching)".length) + "(Done)"

})()