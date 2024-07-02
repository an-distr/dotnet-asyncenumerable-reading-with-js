# dotnet-asyncenumerable-reading-with-js
Example for reading the AsyncEnumerable with JavaScript.

* **I don't understand English very well. I use a translation tool. I'm sorry if the sentence is wrong.**

## Build requirement
* [NET8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
  * **AsyncEnumerable itself also works in .NET 6. However, the sample code is written for .NET8. (Because using Native AOT.)**

## Other dependencies
* [an-distr/js-streams (MIT-0)](https://github.com/an-distr/js-streams)

## Process flow
1. On the server side, we will implement an API that allows you to get a JSON array with AsyncEnumerable. (e.g. [/api/posts](src/Program.cs#L45))

1. On the client side, [fetch](src/wwwroot/index.html.js#L7) retrieves the JSON array from the API.

1. [Converting response stream to text stream.](src/wwwroot/index.html.js#L13)

1. [Converting text stream to JSON array stream.](src/wwwroot/index.html.js#L14)<br>
  [JsonDeserializer](https://github.com/an-distr/js-streams/blob/latest/dist/JsonDeserializer/README.md) is accumulating and converting a character stream to a JSON array.<br>
  You don't necessarily need to use "JsonDeserializer". But  "AsyncEnumerable" returns a partial response, but it is not necessarily separated by a delimited as JSON. So, if you want to process it yourself, be careful about character separation.

1. It's not required, but I'm [counting the number of converted JSON objects](src/wwwroot/index.html.js#L15).

1. [Iterating JSON array stream.](src/wwwroot/index.html.js#L17)<br>
  [ReadableStream.asyncIterator](https://github.com/an-distr/js-streams/blob/latest/dist/polyfill/ReadableStream.asyncIterator/README.md) is polyfill Symbol.asyncIterator to ReadableStream.<br>
  You don't necessarily need to use "ReadableStream.asyncIterator". You can use "WritableStream" instead.

1. Use to [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) statement.

## License
As for the sample code, it is [Unlicense](LICENSE).
