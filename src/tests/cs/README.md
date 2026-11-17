# ตรวจเฉลย C#

```bash
node src/tests/cs/gen_cs.js
cd src/tests/cs && dotnet run -c Release
```

สร้าง Solution.cs + tests.json จาก prog*.js แล้วรันทุก test (รวม performance) เทียบผลแบบ JSON
