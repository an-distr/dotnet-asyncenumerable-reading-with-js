using System.IO.Compression;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.ResponseCompression;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
  options.SerializerOptions.TypeInfoResolverChain.Insert(0, ApiJsonSerializerContext.Default);
});

builder.Services.AddHttpLogging(options =>
{
  options.CombineLogs = true;
  options.LoggingFields = HttpLoggingFields.RequestMethod |
                          HttpLoggingFields.RequestPath |
                          HttpLoggingFields.RequestQuery |
                          HttpLoggingFields.ResponseStatusCode |
                          HttpLoggingFields.Duration;
});

builder.Services.AddResponseCompression(options =>
{
  options.EnableForHttps = true;
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
  options.Level = CompressionLevel.Fastest;
});

builder.Services.AddResponseCaching();

var app = builder.Build();

app.UseHttpLogging();
app.UseStaticFiles();
app.UseResponseCompression();
app.UseResponseCaching();

var api = app.MapGroup("/api");
{
  api.MapGet("/posts", (CancellationToken cancellationToken) =>
  {
    return GetPosts(cancellationToken);
    static async IAsyncEnumerable<Post> GetPosts([EnumeratorCancellation] CancellationToken cancellationToken)
    {
      IEnumerable<Post> posts = Enumerable.Range(1, 10000).Select(n => new Post(n, n, $"Title {n}", $"Body {n}"));
      foreach (Post post in posts)
      {
        yield return post;
      }
      await Task.Yield();
    }
  });
}

await app.RunAsync();

record class Post(int? UserID, int? ID, string? Title, string? Body);

[JsonSerializable(typeof(IAsyncEnumerable<Post>))]
partial class ApiJsonSerializerContext : JsonSerializerContext { }