/* ================= PROGRAM CODING ================= */
LESSONS.push({id:'algo', tab:'prog', comp:'Program Coding', w:13.55, target:'I', min:60, title:'วิธีคิดโจทย์ coding + C# toolbox',
 blocks:[
 {p:'Program Coding มีน้ำหนักสูงสุด (<b>13.55%</b>) และในข้อสอบจริงอาจมีข้อเดียวระดับ Advance พร้อม performance test (เช่น 20,000 จุด / 60,000 เส้นทาง) คะแนนคิดตามจำนวน test case ที่ผ่าน ทั้ง edge case และความเร็ว'},
 {h:'ขั้นตอนทำโจทย์ (ใช้ทุกข้อ)'},
 {ol:['อ่าน <b>constraint</b> ก่อน → เลือก complexity: n ≤ 10³ → O(n²) ได้ · n ≤ 10⁵–10⁶ → ต้อง O(n log n) หรือ O(n)','เขียน edge case ลงกระดาษ: ว่าง, 1 ตัว, ค่าซ้ำ, ค่าลบ, ไปไม่ถึง, start = target','จับคู่กับ pattern (ตารางด้านล่าง)','เขียนโค้ดที่ถูกก่อน แล้วรันตัวอย่าง จากนั้นไล่ edge case','คิด worst case ด้วยข้อมูลใหญ่สุด']},
 {h:'สัญญาณในโจทย์ → Pattern'},
 {table:[['ถ้าโจทย์พูดถึง…','คิดถึง','Complexity'],['หาคู่/เคยเห็นแล้วหรือยัง/นับความถี่','Hash map / HashSet','O(n)'],['substring/subarray ต่อเนื่องที่ยาวสุด/สั้นสุด','Sliding window','O(n)'],['array เรียงแล้ว, จับคู่หัว-ท้าย','Two pointers','O(n) หลัง sort'],['วงเล็บ, undo, ค่าก่อนหน้าที่ใกล้สุด','Stack','O(n)'],['ช่วงเวลาทับกัน','Sort ตาม start + sweep','O(n log n)'],['"ค่าน้อยที่สุดที่ยังทำได้" และตรวจได้ว่าค่า x ทำได้ไหม','Binary search on answer','O(n log range)'],['grid/กราฟ ทุกเส้นน้ำหนักเท่ากัน หาก้าวน้อยสุด','BFS','O(V+E)'],['กราฟมีน้ำหนักบวก หาเส้นทางสั้นสุด','Dijkstra + priority queue','O(E log V)'],['เชื่อมกลุ่ม, นับกลุ่ม, ต้นทุนเชื่อมทุกจุดถูกสุด','Union-Find / Kruskal MST','≈ O(E log E)'],['ลำดับงานที่มี dependency, ตรวจวง','Topological sort (Kahn)','O(V+E)'],['Top K','Sort หรือ heap ขนาด k','O(n log k)'],['นับวิธี/ค่าต่ำสุดแบบแบ่งปัญหาย่อยซ้ำ','Dynamic programming','ขึ้นกับ state']]},
 {h:'C# toolbox ที่ต้องเขียนได้ไม่ต้องเปิดเอกสาร'},
 {code:`var map = new Dictionary<int, int>();
map[x] = map.GetValueOrDefault(x) + 1;           // นับความถี่
if (map.TryGetValue(key, out var idx)) { }
var seen = new HashSet<int>(); if (!seen.Add(x)) { /* ซ้ำ */ }

var st = new Stack<char>(); st.Push('('); var top = st.Pop();   // st.TryPeek(out var c)
var q = new Queue<(int r, int c)>(); q.Enqueue((0, 0)); var (r, c) = q.Dequeue();

var pq = new PriorityQueue<int, long>();          // .NET 6+ : min-heap ตาม priority
pq.Enqueue(node, dist); pq.TryDequeue(out var u, out var d);

Array.Sort(arr);                                  // in-place
var sorted = items.OrderBy(i => i[0]).ThenBy(i => i[1]).ToArray();
var topK = freq.OrderByDescending(kv => kv.Value).ThenBy(kv => kv.Key).Take(k).Select(kv => kv.Key);

var adj = Enumerable.Range(0, n).Select(_ => new List<(int to, int w)>()).ToArray();
var dist = new long[n]; Array.Fill(dist, long.MaxValue);
int[] dr = { 1, -1, 0, 0 }, dc = { 0, 0, 1, -1 };   // 4 ทิศใน grid`},
 {h:'JavaScript ที่ต้องระวัง (ตัวตรวจในหน้าเว็บใช้ JS)'},
 {ul:['arr.sort() เรียงแบบ string! ตัวเลขต้อง arr.sort((a, b) => a - b)','JS ไม่มี priority queue ในตัว — ต้องเขียน MinHeap เอง (มีตัวอย่างในเฉลย Dijkstra)','queue ด้วย arr.shift() เป็น O(n) — กราฟใหญ่ใช้ index pointer แทน','Map/Set ใช้ key เป็น number/string ได้; array เป็น key ไม่ได้ (ใช้ `${r},${c}` หรือ r * cols + c)']},
 {h:'Big-O ที่ควรจำ'},
 {table:[['Operation','Complexity'],['Dictionary/HashSet add/lookup','O(1) เฉลี่ย'],['Sort','O(n log n)'],['PriorityQueue enqueue/dequeue','O(log n)'],['List.Insert(0,…)/RemoveAt(0)','O(n)'],['LINQ Contains บน List','O(n) (ใช้ HashSet แทนถ้าเช็กบ่อย)']]}
 ],
 quiz:[
 {q:'n = 200,000 ควรใช้อัลกอริทึม complexity ประมาณใด',o:['O(n²)','O(n log n) หรือดีกว่า','O(n² log n) ก็ยังทันใน 1 วินาที','O(n³)'],a:1,e:'n² = 4×10¹⁰ ช้าเกินไป'},
 {q:'กราฟมีน้ำหนักเป็นบวก ต้องการระยะสั้นสุดจากจุดเดียว ใช้',o:['BFS','Dijkstra','DFS','Union-Find'],a:1,e:'BFS ใช้ได้เมื่อน้ำหนักทุกเส้นเท่ากัน'},
 {q:'[10, 9, 1].sort() ใน JavaScript ได้ผลใด',o:['[1, 9, 10]','[1, 10, 9]','[10, 9, 1]','error'],a:1,e:'default sort เทียบแบบ string'}
 ]});

const PROBLEMS = [
{id:'p1',title:'Two Sum',pattern:'Hash map',lv:'B',fn:'twoSum',
 desc:'คืน index สองตัว [i, j] (i < j) ที่ nums[i] + nums[j] = target รับประกันว่ามีคำตอบเดียว\nตัวอย่าง: twoSum([2,7,11,15], 9) → [0,1]',
 starter:'function twoSum(nums, target) {\n  \n}',
 tests:[{args:[[2,7,11,15],9],expected:[0,1]},{args:[[3,2,4],6],expected:[1,2]},{args:[[3,3],6],expected:[0,1]},{args:[[-1,-2,-3,-4,-5],-8],expected:[2,4]},{args:[[0,4,3,0],0],expected:[0,3]}],
 hint:'เก็บค่าที่เห็นแล้ว → index ใน Map ทุกตัวถามว่า "target − x" เคยเห็นไหม',
 sol:'function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}',
 cs:'public static int[] TwoSum(int[] nums, int target)\n{\n    var seen = new Dictionary<int, int>();\n    for (int i = 0; i < nums.Length; i++)\n    {\n        if (seen.TryGetValue(target - nums[i], out var j)) return new[] { j, i };\n        seen[nums[i]] = i;\n    }\n    return Array.Empty<int>();\n}',
 cx:'O(n) time, O(n) space'},
{id:'p2',title:'Longest Substring Without Repeating',pattern:'Sliding window',lv:'I',fn:'lengthOfLongestSubstring',
 desc:'คืนความยาวของ substring ที่ยาวที่สุดที่ไม่มีตัวอักษรซ้ำ\nตัวอย่าง: "abcabcbb" → 3 ("abc"), "pwwkew" → 3',
 starter:'function lengthOfLongestSubstring(s) {\n  \n}',
 tests:[{args:['abcabcbb'],expected:3},{args:['bbbbb'],expected:1},{args:['pwwkew'],expected:3},{args:[''],expected:0},{args:['dvdf'],expected:3},{args:['abba'],expected:2},{args:[' '],expected:1}],
 hint:'หน้าต่าง [left, i] จำตำแหน่งล่าสุดของแต่ละตัว ถ้าเจอซ้ำในหน้าต่างให้เลื่อน left ไปหลังตัวซ้ำ (ห้ามเลื่อนถอยหลัง — ดูเคส "abba")',
 sol:'function lengthOfLongestSubstring(s) {\n  const last = new Map();\n  let left = 0, best = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (last.has(s[i]) && last.get(s[i]) >= left) left = last.get(s[i]) + 1;\n    last.set(s[i], i);\n    best = Math.max(best, i - left + 1);\n  }\n  return best;\n}',
 cs:'public static int LengthOfLongestSubstring(string s)\n{\n    var last = new Dictionary<char, int>();\n    int left = 0, best = 0;\n    for (int i = 0; i < s.Length; i++)\n    {\n        if (last.TryGetValue(s[i], out var p) && p >= left) left = p + 1;\n        last[s[i]] = i;\n        best = Math.Max(best, i - left + 1);\n    }\n    return best;\n}',
 cx:'O(n)'},
{id:'p3',title:'Valid Brackets',pattern:'Stack',lv:'B',fn:'isValid',
 desc:'ข้อความประกอบด้วย ()[]{} เท่านั้น คืน true ถ้าวงเล็บเปิด-ปิดถูกคู่และถูกลำดับ ข้อความว่างถือว่าถูก',
 starter:'function isValid(s) {\n  \n}',
 tests:[{args:['()[]{}'],expected:true},{args:['(]'],expected:false},{args:['([)]'],expected:false},{args:['{[]}'],expected:true},{args:[''],expected:true},{args:['(('],expected:false},{args:['))'],expected:false}],
 hint:'เจอเปิด push เจอปิดต้อง pop แล้วตรงคู่ จบแล้ว stack ต้องว่าง',
 sol:'function isValid(s) {\n  const pair = { ")": "(", "]": "[", "}": "{" };\n  const st = [];\n  for (const ch of s) {\n    if (pair[ch]) { if (st.pop() !== pair[ch]) return false; }\n    else st.push(ch);\n  }\n  return st.length === 0;\n}',
 cs:'public static bool IsValid(string s)\n{\n    var pair = new Dictionary<char, char> { [\')\'] = \'(\', [\']\'] = \'[\', [\'}\'] = \'{\' };\n    var st = new Stack<char>();\n    foreach (var ch in s)\n    {\n        if (pair.TryGetValue(ch, out var open))\n        {\n            if (!st.TryPop(out var top) || top != open) return false;\n        }\n        else st.Push(ch);\n    }\n    return st.Count == 0;\n}',
 cx:'O(n)'},
{id:'p4',title:'Top K Frequent',pattern:'Hash map + sort',lv:'I',fn:'topKFrequent',
 desc:'คืนค่า k ตัวที่พบบ่อยที่สุด เรียงตามความถี่มากไปน้อย ถ้าความถี่เท่ากันเรียงค่าน้อยไปมาก',
 starter:'function topKFrequent(nums, k) {\n  \n}',
 tests:[{args:[[1,1,1,2,2,3],2],expected:[1,2]},{args:[[1],1],expected:[1]},{args:[[4,4,5,5,6],2],expected:[4,5]},{args:[[3,0,1,0],1],expected:[0]},{args:[[5,3,5,3,9,9,1],3],expected:[3,5,9]}],
 hint:'นับด้วย Map แล้ว sort ด้วย comparator สองระดับ (ความถี่ desc, ค่า asc)',
 sol:'function topKFrequent(nums, k) {\n  const freq = new Map();\n  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);\n  return [...freq.entries()]\n    .sort((a, b) => b[1] - a[1] || a[0] - b[0])\n    .slice(0, k)\n    .map(e => e[0]);\n}',
 cs:'public static int[] TopKFrequent(int[] nums, int k) =>\n    nums.GroupBy(x => x)\n        .OrderByDescending(g => g.Count())\n        .ThenBy(g => g.Key)\n        .Take(k)\n        .Select(g => g.Key)\n        .ToArray();',
 cx:'O(n log n) (ใช้ heap ขนาด k ได้ O(n log k))'},
{id:'p5',title:'Boats for People',pattern:'Two pointers + greedy',lv:'I',fn:'numBoats',
 desc:'people[i] = น้ำหนักแต่ละคน เรือแต่ละลำรับได้ไม่เกิน 2 คน และน้ำหนักรวมไม่เกิน limit (ทุกคน ≤ limit) คืนจำนวนเรือน้อยที่สุด',
 starter:'function numBoats(people, limit) {\n  \n}',
 tests:[{args:[[1,2],3],expected:1},{args:[[3,2,2,1],3],expected:3},{args:[[3,5,3,4],5],expected:4},{args:[[5,1,4,2],6],expected:2},{args:[[],3],expected:0}],
 hint:'เรียงน้ำหนัก ให้คนหนักสุดลงเรือเสมอ ถ้าคนเบาสุดขึ้นด้วยได้ก็พาไปด้วย',
 sol:'function numBoats(people, limit) {\n  const p = [...people].sort((a, b) => a - b);\n  let i = 0, j = p.length - 1, boats = 0;\n  while (i <= j) {\n    if (p[i] + p[j] <= limit) i++;\n    j--; boats++;\n  }\n  return boats;\n}',
 cs:'public static int NumBoats(int[] people, int limit)\n{\n    var p = people.OrderBy(x => x).ToArray();\n    int i = 0, j = p.Length - 1, boats = 0;\n    while (i <= j)\n    {\n        if (p[i] + p[j] <= limit) i++;\n        j--; boats++;\n    }\n    return boats;\n}',
 cx:'O(n log n)'},
{id:'p6',title:'Meeting Rooms Needed',pattern:'Sort + sweep',lv:'I',fn:'minMeetingRooms',
 desc:'intervals[i] = [start, end) คืนจำนวนห้องประชุมน้อยที่สุดที่ต้องใช้ (ประชุมที่จบเวลา 5 กับที่เริ่มเวลา 5 ใช้ห้องเดียวกันได้)',
 starter:'function minMeetingRooms(intervals) {\n  \n}',
 tests:[{args:[[[0,30],[5,10],[15,20]]],expected:2},{args:[[[7,10],[2,4]]],expected:1},{args:[[]],expected:0},{args:[[[1,5],[5,10]]],expected:1},{args:[[[1,10],[2,9],[3,8],[4,7]]],expected:4},{args:[[[1,3],[2,4],[3,5]]],expected:2}],
 hint:'แยก start และ end แล้วเรียงทั้งคู่ เดิน start ทีละตัว ถ้า start ≥ end ที่เล็กสุดที่ยังไม่ใช้ = มีห้องว่าง',
 sol:'function minMeetingRooms(intervals) {\n  const s = intervals.map(x => x[0]).sort((a, b) => a - b);\n  const e = intervals.map(x => x[1]).sort((a, b) => a - b);\n  let rooms = 0, j = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (s[i] >= e[j]) j++;\n    else rooms++;\n  }\n  return rooms;\n}',
 cs:'public static int MinMeetingRooms(int[][] intervals)\n{\n    var s = intervals.Select(x => x[0]).OrderBy(x => x).ToArray();\n    var e = intervals.Select(x => x[1]).OrderBy(x => x).ToArray();\n    int rooms = 0, j = 0;\n    for (int i = 0; i < s.Length; i++)\n    {\n        if (s[i] >= e[j]) j++;\n        else rooms++;\n    }\n    return rooms;\n}',
 cx:'O(n log n)'},
{id:'p7',title:'Ship Within Days',pattern:'Binary search on answer',lv:'A',fn:'shipWithinDays',
 desc:'weights คือน้ำหนักพัสดุตามลำดับ (ห้ามสลับ) แต่ละวันขนพัสดุต่อเนื่องได้ไม่เกินความจุรถ ต้องขนครบภายใน days วัน คืนความจุรถที่น้อยที่สุด',
 starter:'function shipWithinDays(weights, days) {\n  \n}',
 tests:[{args:[[1,2,3,4,5,6,7,8,9,10],5],expected:15},{args:[[3,2,2,4,1,4],3],expected:6},{args:[[1,2,3,1,1],4],expected:3},{args:[[10],1],expected:10},{args:[[1,1,1,1],4],expected:1}],
 hint:'คำตอบอยู่ระหว่าง max(weights) ถึง sum(weights) ถ้าความจุ x ทำได้ ความจุที่มากกว่าก็ทำได้ → binary search หา x น้อยสุดที่ทำได้',
 sol:'function shipWithinDays(weights, days) {\n  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);\n  const can = cap => {\n    let d = 1, load = 0;\n    for (const w of weights) {\n      if (load + w > cap) { d++; load = 0; }\n      load += w;\n    }\n    return d <= days;\n  };\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (can(mid)) hi = mid; else lo = mid + 1;\n  }\n  return lo;\n}',
 cs:'public static int ShipWithinDays(int[] weights, int days)\n{\n    int lo = weights.Max(), hi = weights.Sum();\n    bool Can(int cap)\n    {\n        int d = 1, load = 0;\n        foreach (var w in weights)\n        {\n            if (load + w > cap) { d++; load = 0; }\n            load += w;\n        }\n        return d <= days;\n    }\n    while (lo < hi)\n    {\n        int mid = lo + (hi - lo) / 2;\n        if (Can(mid)) hi = mid; else lo = mid + 1;\n    }\n    return lo;\n}',
 cx:'O(n log(sum))'},
{id:'p8',title:'Shortest Path in Grid',pattern:'BFS',lv:'I',fn:'shortestPathGrid',
 desc:'grid เป็น array ของ string: S = จุดเริ่ม, E = ปลายทาง, . = เดินได้, # = กำแพง เดินขึ้น/ลง/ซ้าย/ขวาได้ครั้งละ 1 ช่อง คืนจำนวนก้าวน้อยที่สุดจาก S ถึง E หรือ -1 ถ้าไปไม่ถึง',
 starter:'function shortestPathGrid(grid) {\n  \n}',
 tests:[{args:[['S.#','..#','#.E']],expected:4},{args:[['S#E']],expected:-1},{args:[['SE']],expected:1},{args:[['S...','###.','E...']],expected:8},{args:[['S.#.','....','#.#E']],expected:5}],
 hint:'BFS จาก S เก็บระยะทางต่อช่อง ช่องแรกที่เจอ E คือคำตอบ — อย่าลืม mark visited ตอน enqueue',
 sol:'function shortestPathGrid(grid) {\n  const R = grid.length, C = grid[0].length;\n  let sr = 0, sc = 0;\n  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r][c] === "S") { sr = r; sc = c; }\n  const dist = Array.from({ length: R }, () => new Array(C).fill(-1));\n  const q = [[sr, sc]]; dist[sr][sc] = 0;\n  for (let h = 0; h < q.length; h++) {\n    const [r, c] = q[h];\n    if (grid[r][c] === "E") return dist[r][c];\n    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n      const nr = r + dr, nc = c + dc;\n      if (nr < 0 || nc < 0 || nr >= R || nc >= C || grid[nr][nc] === "#" || dist[nr][nc] !== -1) continue;\n      dist[nr][nc] = dist[r][c] + 1;\n      q.push([nr, nc]);\n    }\n  }\n  return -1;\n}',
 cs:'public static int ShortestPathGrid(string[] grid)\n{\n    int R = grid.Length, C = grid[0].Length, sr = 0, sc = 0;\n    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (grid[r][c] == \'S\') (sr, sc) = (r, c);\n    var dist = new int[R, C];\n    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) dist[r, c] = -1;\n    var q = new Queue<(int r, int c)>();\n    q.Enqueue((sr, sc)); dist[sr, sc] = 0;\n    int[] dr = { 1, -1, 0, 0 }, dc = { 0, 0, 1, -1 };\n    while (q.Count > 0)\n    {\n        var (r, c) = q.Dequeue();\n        if (grid[r][c] == \'E\') return dist[r, c];\n        for (int k = 0; k < 4; k++)\n        {\n            int nr = r + dr[k], nc = c + dc[k];\n            if (nr < 0 || nc < 0 || nr >= R || nc >= C || grid[nr][nc] == \'#\' || dist[nr, nc] != -1) continue;\n            dist[nr, nc] = dist[r, c] + 1;\n            q.Enqueue((nr, nc));\n        }\n    }\n    return -1;\n}',
 cx:'O(R × C)'},
{id:'p9',title:'Count Groups',pattern:'Union-Find',lv:'I',fn:'countGroups',
 desc:'มีคน n คน (0..n−1) pairs[i] = [a, b] แปลว่า a กับ b รู้จักกัน (ถ่ายทอดกันได้) คืนจำนวนกลุ่ม',
 starter:'function countGroups(n, pairs) {\n  \n}',
 tests:[{args:[5,[[0,1],[1,2],[3,4]]],expected:2},{args:[3,[]],expected:3},{args:[4,[[0,1],[2,3],[1,2]]],expected:1},{args:[1,[]],expected:1},{args:[6,[[0,0],[1,2],[4,5],[2,1]]],expected:4}],
 hint:'เริ่มที่ n กลุ่ม union สำเร็จหนึ่งครั้ง = กลุ่มลดลง 1',
 sol:'function countGroups(n, pairs) {\n  const parent = Array.from({ length: n }, (_, i) => i);\n  const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };\n  let groups = n;\n  for (const [a, b] of pairs) {\n    const ra = find(a), rb = find(b);\n    if (ra !== rb) { parent[ra] = rb; groups--; }\n  }\n  return groups;\n}',
 cs:'public static int CountGroups(int n, int[][] pairs)\n{\n    var parent = Enumerable.Range(0, n).ToArray();\n    int Find(int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }\n    int groups = n;\n    foreach (var p in pairs)\n    {\n        int ra = Find(p[0]), rb = Find(p[1]);\n        if (ra != rb) { parent[ra] = rb; groups--; }\n    }\n    return groups;\n}',
 cx:'≈ O(n + m)'},
{id:'p10',title:'Fastest Route (Dijkstra)',pattern:'Dijkstra + MinHeap',lv:'A',fn:'fastestRoute',
 desc:'มีจุด n จุด roads[i] = [u, v, minutes] วิ่งได้สองทิศ (อาจมีหลายเส้นระหว่างคู่เดียวกัน) คืนเวลาน้อยที่สุดจาก start ไป target ถ้าไปไม่ถึงคืน -1 ถ้า start = target คืน 0\nข้อมูลอาจมีถึง 20,000 จุด / 60,000 ถนน (มี performance test ≤ 800 ms)',
 starter:'function fastestRoute(n, roads, start, target) {\n  \n}',
 tests:[{args:[5,[[0,1,10],[0,2,3],[2,1,4],[1,3,2],[2,3,8],[3,4,7]],0,4],expected:16},{args:[3,[[0,1,5],[1,2,5]],2,2],expected:0},{args:[4,[[0,1,1]],0,3],expected:-1},{args:[2,[[0,1,9],[1,0,3],[0,1,5]],0,1],expected:3},{args:[4,[[0,1,1],[1,2,1],[2,3,1],[0,3,10]],3,0],expected:3},{n:'Performance: 20,000 จุด / 60,000 ถนน',gen:'dijkstra-big',maxMs:800}],
 hint:'adjacency list + MinHeap ของ [dist, node] ดึงตัวน้อยสุดออก ถ้า dist ที่ดึงมามากกว่าที่บันทึกไว้ให้ข้าม (lazy deletion) — วิธี O(V²) จะไม่ผ่าน performance test',
 sol:'function fastestRoute(n, roads, start, target) {\n  if (start === target) return 0;\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v, w] of roads) { adj[u].push([v, w]); adj[v].push([u, w]); }\n  const dist = new Array(n).fill(Infinity);\n  const heap = [];   // binary min-heap of [d, node]\n  const push = item => {\n    heap.push(item);\n    let i = heap.length - 1;\n    while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }\n  };\n  const pop = () => {\n    const top = heap[0], last = heap.pop();\n    if (heap.length) {\n      heap[0] = last; let i = 0;\n      for (;;) {\n        const l = 2 * i + 1, r = l + 1; let m = i;\n        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;\n        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;\n        if (m === i) break;\n        [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;\n      }\n    }\n    return top;\n  };\n  dist[start] = 0; push([0, start]);\n  while (heap.length) {\n    const [d, u] = pop();\n    if (d > dist[u]) continue;\n    if (u === target) return d;\n    for (const [v, w] of adj[u]) {\n      if (d + w < dist[v]) { dist[v] = d + w; push([dist[v], v]); }\n    }\n  }\n  return -1;\n}',
 cs:'public static long FastestRoute(int n, int[][] roads, int start, int target)\n{\n    if (start == target) return 0;\n    var adj = Enumerable.Range(0, n).Select(_ => new List<(int to, int w)>()).ToArray();\n    foreach (var r in roads) { adj[r[0]].Add((r[1], r[2])); adj[r[1]].Add((r[0], r[2])); }\n    var dist = new long[n];\n    Array.Fill(dist, long.MaxValue);\n    var pq = new PriorityQueue<int, long>();\n    dist[start] = 0; pq.Enqueue(start, 0);\n    while (pq.TryDequeue(out var u, out var d))\n    {\n        if (d > dist[u]) continue;          // ข้อมูลเก่าใน heap\n        if (u == target) return d;\n        foreach (var (v, w) in adj[u])\n            if (d + w < dist[v]) { dist[v] = d + w; pq.Enqueue(v, dist[v]); }\n    }\n    return -1;\n}',
 cx:'O(E log V)'},
{id:'p11',title:'Build Order',pattern:'Topological sort (Kahn)',lv:'A',fn:'buildOrder',
 desc:'มีงาน n งาน (0..n−1) deps[i] = [a, b] แปลว่างาน a ต้องเสร็จก่อนงาน b คืนลำดับการทำงาน ถ้ามีหลายงานที่พร้อมทำให้เลือกหมายเลขน้อยสุดก่อน ถ้ามีวง (ทำไม่ได้) คืน []',
 starter:'function buildOrder(n, deps) {\n  \n}',
 tests:[{args:[4,[[0,1],[0,2],[1,3],[2,3]]],expected:[0,1,2,3]},{args:[2,[[1,0]]],expected:[1,0]},{args:[2,[[0,1],[1,0]]],expected:[]},{args:[3,[]],expected:[0,1,2]},{args:[5,[[3,0],[4,0],[2,1]]],expected:[2,1,3,4,0]}],
 hint:'นับ in-degree งานที่ in-degree = 0 พร้อมทำ เลือกตัวน้อยสุด ทำแล้วลด in-degree ของงานถัดไป ถ้าจบแล้วได้ไม่ครบ n = มีวง',
 sol:'function buildOrder(n, deps) {\n  const indeg = new Array(n).fill(0), next = Array.from({ length: n }, () => []);\n  for (const [a, b] of deps) { next[a].push(b); indeg[b]++; }\n  const ready = [];\n  for (let i = 0; i < n; i++) if (indeg[i] === 0) ready.push(i);\n  const order = [];\n  while (ready.length) {\n    ready.sort((a, b) => a - b);\n    const u = ready.shift();\n    order.push(u);\n    for (const v of next[u]) if (--indeg[v] === 0) ready.push(v);\n  }\n  return order.length === n ? order : [];\n}',
 cs:'public static int[] BuildOrder(int n, int[][] deps)\n{\n    var indeg = new int[n];\n    var next = Enumerable.Range(0, n).Select(_ => new List<int>()).ToArray();\n    foreach (var d in deps) { next[d[0]].Add(d[1]); indeg[d[1]]++; }\n    var ready = new PriorityQueue<int, int>();         // เลือกเลขน้อยสุดก่อน\n    for (int i = 0; i < n; i++) if (indeg[i] == 0) ready.Enqueue(i, i);\n    var order = new List<int>();\n    while (ready.TryDequeue(out var u, out _))\n    {\n        order.Add(u);\n        foreach (var v in next[u]) if (--indeg[v] == 0) ready.Enqueue(v, v);\n    }\n    return order.Count == n ? order.ToArray() : Array.Empty<int>();\n}',
 cx:'O((V + E) log V)'},
{id:'p12',title:'Minimum Coins',pattern:'Dynamic programming',lv:'A',fn:'minCoins',
 desc:'มีเหรียญชนิดต่าง ๆ (ใช้กี่เหรียญก็ได้) คืนจำนวนเหรียญน้อยที่สุดที่รวมได้ amount พอดี ถ้าทำไม่ได้คืน -1 (amount = 0 คืน 0)\nหมายเหตุ: greedy (หยิบเหรียญใหญ่สุดก่อน) ไม่ถูกเสมอไป',
 starter:'function minCoins(coins, amount) {\n  \n}',
 tests:[{args:[[1,2,5],11],expected:3},{args:[[2],3],expected:-1},{args:[[1],0],expected:0},{args:[[2,5,10,1],27],expected:4},{args:[[186,419,83,408],6249],expected:20},{args:[[3,7],5],expected:-1},{args:[[1,3,4],6],expected:2}],
 hint:'dp[x] = จำนวนเหรียญน้อยสุดที่รวมได้ x → dp[x] = min(dp[x − c] + 1) สำหรับทุกเหรียญ c ([1,3,4] กับ 6: greedy ได้ 4+1+1 = 3 เหรียญ แต่คำตอบคือ 3+3 = 2)',
 sol:'function minCoins(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let x = 1; x <= amount; x++)\n    for (const c of coins) if (c <= x && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
 cs:'public static int MinCoins(int[] coins, int amount)\n{\n    var dp = new int[amount + 1];\n    Array.Fill(dp, int.MaxValue);\n    dp[0] = 0;\n    for (int x = 1; x <= amount; x++)\n        foreach (var c in coins)\n            if (c <= x && dp[x - c] != int.MaxValue && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;\n    return dp[amount] == int.MaxValue ? -1 : dp[amount];\n}',
 cx:'O(amount × coins)'}
];

function lcg(seed){ let s = seed >>> 0; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const GEN = {
  'dijkstra-big': () => {
    const n = 20000, r = lcg(424242), roads = [];
    for (let i = 1; i < n - 1; i++) roads.push([i, Math.floor(r() * i), 1 + Math.floor(r() * 100)]);
    while (roads.length < 59998) roads.push([Math.floor(r() * (n - 1)), Math.floor(r() * (n - 1)), 1 + Math.floor(r() * 100)]);
    roads.push([n - 1, Math.floor(r() * (n - 1)), 500000], [Math.floor(r() * (n - 1)), n - 1, 400000]);
    return [n, roads, 0, n - 1];
  }
};
