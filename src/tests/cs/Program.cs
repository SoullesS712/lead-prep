using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;

// รันเฉลย C# ทุกข้อกับ test case จาก tests.json แล้วเทียบผลแบบ JSON
var tests = JsonNode.Parse(File.ReadAllText("tests.json"))!.AsArray();
int pass = 0, fail = 0;
foreach (var t in tests)
{
    var name = t!["method"]!.GetValue<string>();
    var mi = typeof(Solution).GetMethod(name, BindingFlags.Public | BindingFlags.Static);
    if (mi == null) { Console.WriteLine($"✗ {t["id"]} ไม่พบ method {name}"); fail++; continue; }
    var ps = mi.GetParameters();
    var targs = t["args"]!.AsArray();
    var callArgs = ps.Select((p, i) => ConvertArg(targs[i]!, p.ParameterType)).ToArray();
    var sw = Stopwatch.StartNew();
    object? result;
    try { result = mi.Invoke(null, callArgs); }
    catch (TargetInvocationException ex) { Console.WriteLine($"✗ {t["id"]} {t["name"]}: {ex.InnerException?.Message}"); fail++; continue; }
    sw.Stop();
    var got = JsonSerializer.Serialize(result);
    var exp = t["expected"]!.ToJsonString();
    int maxMs = t["maxMs"]!.GetValue<int>();
    bool ok = Norm(got) == Norm(exp) && (maxMs == 0 || sw.ElapsedMilliseconds <= maxMs);
    if (ok) pass++; else { fail++; Console.WriteLine($"✗ {t["id"]} {t["name"]}: got {Trunc(got)} expected {Trunc(exp)} ({sw.ElapsedMilliseconds} ms)"); }
    if (maxMs > 0) Console.WriteLine($"  {t["id"]} {t["name"]}: {sw.ElapsedMilliseconds} ms (limit {maxMs})");
}
Console.WriteLine($"C#: pass {pass}, fail {fail}");
return fail == 0 ? 0 : 1;

static string Norm(string json) => JsonNode.Parse(json)!.ToJsonString();
static string Trunc(string s) => s.Length > 120 ? s[..120] + "…" : s;

// แปลง JSON เป็นชนิดของพารามิเตอร์ — object[][] แปลงเป็น string/long ตามจริง (ไม่ปล่อยเป็น JsonElement)
static object? ConvertArg(JsonNode node, Type type)
{
    if (type == typeof(object[][]))
        return node.AsArray().Select(row => row!.AsArray().Select(Prim).ToArray()).ToArray();
    return node.Deserialize(type);
}
static object? Prim(JsonNode? n)
{
    var v = n!.AsValue();
    if (v.TryGetValue<string>(out var s)) return s;
    if (v.TryGetValue<long>(out var l)) return l;
    return v.GetValue<double>();
}
