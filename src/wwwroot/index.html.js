import * as streams from "https://an-js-streams.pages.dev/mod.min.js"

const txtCount = document.getElementById("txtCount")
const tblPosts = document.getElementById("tblPosts")

const url = new URL("/api/posts", location.href)
const response = await fetch(url)
if (!response.ok) {
  alert(`fetch(${url.href}) failed.`)
}
else {
  const posts = response.body
    .pipeThrough(new streams.Utf8DecoderStream())
    .pipeThrough(new streams.JsonDeserializer().transformable())
    .pipeThrough(new streams.PeekStream((_, i) => txtCount.textContent = `${(i + 1).toLocaleString()} (Fetching)`))

  for await (const post of posts) {
    const row = tblPosts.tBodies[0].insertRow()
    row.insertCell().textContent = post.userID
    row.insertCell().textContent = post.id
    row.insertCell().textContent = post.title
    row.insertCell().textContent = post.body
  }

  txtCount.textContent = txtCount.textContent.slice(0, -"(Fetching)".length) + "(Done)"
}