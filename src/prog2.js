/* ================= PROGRAM CODING — โจทย์เพิ่ม (p13–p21) ================= */
PROBLEMS.push(
{id:'p13',title:'Group Anagrams',pattern:'Hash map + canonical key',lv:'I',fn:'groupAnagrams',
 desc:'จัดกลุ่มคำที่เป็น anagram กัน (ตัวอักษรชุดเดียวกัน)\nผลลัพธ์: แต่ละกลุ่มเรียงคำจากน้อยไปมาก และเรียงกลุ่มตามคำแรกของกลุ่ม\nตัวอย่าง: ["eat","tea","tan","ate","nat","bat"] → [["ate","eat","tea"],["bat"],["nat","tan"]]',
 starter:'function groupAnagrams(words) {\n  \n}',
 tests:[{args:[['eat','tea','tan','ate','nat','bat']],expected:[['ate','eat','tea'],['bat'],['nat','tan']]},{args:[['']],expected:[['']]},{args:[['a']],expected:[['a']]},{args:[['ab','ba','abc','cab','bca','x']],expected:[['ab','ba'],['abc','bca','cab'],['x']]},{args:[[]],expected:[]}],
 hint:'key = ตัวอักษรของคำที่เรียงแล้ว (เช่น "aet") เก็บใน Map<key, string[]> แล้วค่อยเรียงตามที่โจทย์กำหนด',
 sol:'function groupAnagrams(words) {\n  const groups = new Map();\n  for (const w of words) {\n    const key = [...w].sort().join("");\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(w);\n  }\n  const out = [...groups.values()].map(g => g.sort());\n  return out.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));\n}',
 cs:'public static List<List<string>> GroupAnagrams(string[] words)\n{\n    var groups = new Dictionary<string, List<string>>();\n    foreach (var w in words)\n    {\n        var chars = w.ToCharArray(); Array.Sort(chars);\n        var key = new string(chars);\n        if (!groups.TryGetValue(key, out var list)) groups[key] = list = new List<string>();\n        list.Add(w);\n    }\n    return groups.Values\n        .Select(g => g.OrderBy(x => x, StringComparer.Ordinal).ToList())\n        .OrderBy(g => g[0], StringComparer.Ordinal)\n        .ToList();\n}',
 cx:'O(n · k log k) เมื่อ k = ความยาวคำ'},

{id:'p14',title:'Product Except Self',pattern:'Prefix / suffix',lv:'I',fn:'productExceptSelf',
 desc:'คืน array ที่ตำแหน่ง i = ผลคูณของทุกตัวยกเว้น nums[i] ห้ามใช้การหาร และต้องเป็น O(n)\nตัวอย่าง: [1,2,3,4] → [24,12,8,6]',
 starter:'function productExceptSelf(nums) {\n  \n}',
 tests:[{args:[[1,2,3,4]],expected:[24,12,8,6]},{args:[[2,3]],expected:[3,2]},{args:[[1,0,3]],expected:[0,3,0]},{args:[[0,0,2]],expected:[0,0,0]},{args:[[-1,2,-3]],expected:[-6,3,-2]},{args:[[5]],expected:[1]}],
 hint:'ผลลัพธ์ = (ผลคูณทุกตัวทางซ้าย) × (ผลคูณทุกตัวทางขวา) เดินสองรอบ ซ้าย→ขวา แล้วขวา→ซ้าย',
 sol:'function productExceptSelf(nums) {\n  const n = nums.length, out = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i]; }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }\n  return out.map(x => x + 0);\n}',
 cs:'public static int[] ProductExceptSelf(int[] nums)\n{\n    int n = nums.Length;\n    var res = new int[n];\n    int left = 1;\n    for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }\n    int right = 1;\n    for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }\n    return res;\n}',
 cx:'O(n) เวลา, O(1) พื้นที่เพิ่ม (ไม่นับ output)'},

{id:'p15',title:'Merge K Sorted Arrays',pattern:'Min-heap',lv:'A',fn:'mergeKSorted',
 desc:'รวม k array ที่เรียงจากน้อยไปมากแล้ว ให้เป็น array เดียวที่เรียงแล้ว\nข้อจำกัด: รวมสูงสุด 200,000 ตัว จาก k สูงสุด 2,000 array — การต่อทั้งหมดแล้ว sort ก็ผ่าน แต่ให้ฝึกแบบ min-heap ซึ่งเป็นแนวที่ข้อสอบชอบถาม (merge ทีละคู่แบบเรียงลำดับจะช้าเกิน)\nตัวอย่าง: [[1,4,5],[1,3,4],[2,6]] → [1,1,2,3,4,4,5,6]',
 starter:'function mergeKSorted(arrays) {\n  \n}',
 tests:[{args:[[[1,4,5],[1,3,4],[2,6]]],expected:[1,1,2,3,4,4,5,6]},{args:[[]],expected:[]},{args:[[[],[]]],expected:[]},{args:[[[-3,-1],[],[-2,0,9]]],expected:[-3,-2,-1,0,9]},{args:[[[5]]],expected:[5]},{n:'Performance: 2,000 arrays รวม 200,000 ตัว',gen:'mergek-big',maxMs:1500}],
 hint:'ใส่ตัวแรกของทุก array ลง min-heap (ค่า, array ไหน, ตำแหน่ง) ดึงตัวเล็กสุดออก แล้วใส่ตัวถัดไปของ array เดียวกันกลับเข้า heap',
 sol:'function mergeKSorted(arrays) {\n  const heap = [];\n  const less = (a, b) => a[0] < b[0];\n  const push = x => { heap.push(x); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (!less(heap[i], heap[p])) break; [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } };\n  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && less(heap[l], heap[m])) m = l; if (r < heap.length && less(heap[r], heap[m])) m = r; if (m === i) break; [heap[i], heap[m]] = [heap[m], heap[i]]; i = m; } } return top; };\n  arrays.forEach((a, k) => { if (a.length) push([a[0], k, 0]); });\n  const out = [];\n  while (heap.length) {\n    const [v, k, i] = pop();\n    out.push(v);\n    if (i + 1 < arrays[k].length) push([arrays[k][i + 1], k, i + 1]);\n  }\n  return out;\n}',
 cs:'public static int[] MergeKSorted(int[][] arrays)\n{\n    var pq = new PriorityQueue<(int k, int i), int>();\n    for (int k = 0; k < arrays.Length; k++)\n        if (arrays[k].Length > 0) pq.Enqueue((k, 0), arrays[k][0]);\n    var res = new List<int>();\n    while (pq.TryDequeue(out var cur, out var v))\n    {\n        res.Add(v);\n        if (cur.i + 1 < arrays[cur.k].Length) pq.Enqueue((cur.k, cur.i + 1), arrays[cur.k][cur.i + 1]);\n    }\n    return res.ToArray();\n}',
 cx:'O(N log k) เมื่อ N = จำนวนตัวทั้งหมด'},

{id:'p16',title:'LRU Cache Simulator',pattern:'Map (insertion order) / Hash + linked list',lv:'I',fn:'lruCache',
 desc:'จำลอง LRU cache ความจุ capacity รับคำสั่งเป็น array:\n["put", key, value] — ใส่/อัปเดตค่า ถ้าเต็มให้ลบ key ที่ไม่ได้ใช้นานที่สุดก่อน\n["get", key] — คืนค่า ถ้าไม่มีคืน -1 (การ get นับว่าเป็นการใช้งาน)\nคืน array ของผลลัพธ์จากทุก "get" ตามลำดับ\nตัวอย่าง: capacity 2, put(1,1) put(2,2) get(1)=1 put(3,3) [ลบ 2] get(2)=-1 → [1,-1]',
 starter:'function lruCache(capacity, ops) {\n  \n}',
 tests:[{args:[2,[['put',1,1],['put',2,2],['get',1],['put',3,3],['get',2],['put',4,4],['get',1],['get',3],['get',4]]],expected:[1,-1,-1,3,4]},{args:[1,[['put',1,10],['get',1],['put',2,20],['get',1],['get',2]]],expected:[10,-1,20]},{args:[2,[['put',1,1],['put',1,5],['put',2,2],['get',1],['put',3,3],['get',2],['get',1]]],expected:[5,-1,5]},{args:[3,[['get',9]]],expected:[-1]}],
 hint:'Map ใน JS จำลำดับการใส่ — ตอน get/put ให้ delete แล้ว set ใหม่ (ย้ายไปท้าย) ตัวที่ใช้นานสุดคือ key แรกของ Map',
 sol:'function lruCache(capacity, ops) {\n  const m = new Map(), out = [];\n  for (const [op, k, v] of ops) {\n    if (op === "get") {\n      if (!m.has(k)) { out.push(-1); continue; }\n      const val = m.get(k); m.delete(k); m.set(k, val); out.push(val);\n    } else {\n      if (m.has(k)) m.delete(k);\n      else if (m.size >= capacity) m.delete(m.keys().next().value);\n      m.set(k, v);\n    }\n  }\n  return out;\n}',
 cs:'public static int[] LruCache(int capacity, object[][] ops)\n{\n    var map = new Dictionary<int, LinkedListNode<(int key, int val)>>();\n    var order = new LinkedList<(int key, int val)>();   // หัว = ใช้ล่าสุด\n    var res = new List<int>();\n    foreach (var op in ops)\n    {\n        int key = Convert.ToInt32(op[1]);\n        if ((string)op[0] == "get")\n        {\n            if (!map.TryGetValue(key, out var node)) { res.Add(-1); continue; }\n            order.Remove(node); order.AddFirst(node); res.Add(node.Value.val);\n        }\n        else\n        {\n            int val = Convert.ToInt32(op[2]);\n            if (map.TryGetValue(key, out var node)) order.Remove(node);\n            else if (map.Count >= capacity) { map.Remove(order.Last!.Value.key); order.RemoveLast(); }\n            map[key] = order.AddFirst((key, val));\n        }\n    }\n    return res.ToArray();\n}',
 cx:'O(1) ต่อคำสั่ง'},

{id:'p17',title:'Longest Increasing Subsequence',pattern:'DP + binary search (patience)',lv:'A',fn:'lisLength',
 desc:'คืนความยาวของ subsequence ที่เพิ่มขึ้นแบบเคร่งครัด (strictly increasing) ที่ยาวที่สุด\nข้อจำกัด: n สูงสุด 100,000 — วิธี O(n²) จะไม่ผ่าน performance test\nตัวอย่าง: [10,9,2,5,3,7,101,18] → 4 (2,3,7,18)',
 starter:'function lisLength(nums) {\n  \n}',
 tests:[{args:[[10,9,2,5,3,7,101,18]],expected:4},{args:[[0,1,0,3,2,3]],expected:4},{args:[[7,7,7,7]],expected:1},{args:[[]],expected:0},{args:[[5,4,3,2,1]],expected:1},{args:[[1,2,3,4,5]],expected:5},{n:'Performance: n = 100,000',gen:'lis-big',maxMs:800}],
 hint:'tails[len] = ค่าท้ายที่เล็กที่สุดของ subsequence ยาว len+1 สำหรับแต่ละ x ใช้ binary search หาตำแหน่งแรกที่ tails >= x แล้วแทนที่ (หรือต่อท้าย)',
 sol:'function lisLength(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let lo = 0, hi = tails.length;\n    while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < x) lo = mid + 1; else hi = mid; }\n    tails[lo] = x;\n  }\n  return tails.length;\n}',
 cs:'public static int LisLength(int[] nums)\n{\n    var tails = new List<int>();\n    foreach (var x in nums)\n    {\n        int i = tails.BinarySearch(x);\n        if (i < 0) i = ~i;          // ตำแหน่งแรกที่ >= x\n        if (i == tails.Count) tails.Add(x); else tails[i] = x;\n    }\n    return tails.Count;\n}',
 cx:'O(n log n)'},

{id:'p18',title:'Number of Islands',pattern:'Grid DFS/BFS',lv:'I',fn:'numIslands',
 desc:'grid เป็น array ของ string ประกอบด้วย "1" (แผ่นดิน) และ "0" (น้ำ) นับจำนวนเกาะ (แผ่นดินที่ติดกันแนวบน/ล่าง/ซ้าย/ขวา)\nตัวอย่าง: ["11000","11000","00100","00011"] → 3',
 starter:'function numIslands(grid) {\n  \n}',
 tests:[{args:[['11000','11000','00100','00011']],expected:3},{args:[['11110','11010','11000','00000']],expected:1},{args:[['0']],expected:0},{args:[['1']],expected:1},{args:[['101','010','101']],expected:5},{args:[[]],expected:0}],
 hint:'วนทุกช่อง เจอ "1" ที่ยังไม่เคยไป = เกาะใหม่ แล้ว flood fill (BFS ด้วย queue/stack เพื่อไม่ให้ recursion ลึกเกิน) ทำเครื่องหมายว่าไปแล้ว',
 sol:'function numIslands(grid) {\n  const R = grid.length, C = R ? grid[0].length : 0;\n  const seen = Array.from({length: R}, () => new Array(C).fill(false));\n  let count = 0;\n  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {\n    if (grid[r][c] !== "1" || seen[r][c]) continue;\n    count++;\n    const stack = [[r, c]]; seen[r][c] = true;\n    while (stack.length) {\n      const [y, x] = stack.pop();\n      for (const [dy, dx] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n        const ny = y + dy, nx = x + dx;\n        if (ny >= 0 && ny < R && nx >= 0 && nx < C && grid[ny][nx] === "1" && !seen[ny][nx]) { seen[ny][nx] = true; stack.push([ny, nx]); }\n      }\n    }\n  }\n  return count;\n}',
 cs:'public static int NumIslands(string[] grid)\n{\n    int R = grid.Length, C = R > 0 ? grid[0].Length : 0, count = 0;\n    var seen = new bool[R, C];\n    int[] dy = { 1, -1, 0, 0 }, dx = { 0, 0, 1, -1 };\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++)\n        {\n            if (grid[r][c] != \'1\' || seen[r, c]) continue;\n            count++;\n            var stack = new Stack<(int y, int x)>();\n            stack.Push((r, c)); seen[r, c] = true;\n            while (stack.Count > 0)\n            {\n                var (y, x) = stack.Pop();\n                for (int d = 0; d < 4; d++)\n                {\n                    int ny = y + dy[d], nx = x + dx[d];\n                    if (ny >= 0 && ny < R && nx >= 0 && nx < C && grid[ny][nx] == \'1\' && !seen[ny, nx])\n                    { seen[ny, nx] = true; stack.Push((ny, nx)); }\n                }\n            }\n        }\n    return count;\n}',
 cx:'O(R × C)'},

{id:'p19',title:'Max Non-overlapping Meetings',pattern:'Greedy (sort by end)',lv:'I',fn:'maxMeetings',
 desc:'มีห้องประชุมห้องเดียว และคำขอจอง [start, end) จำนวนมาก เลือกจองให้ได้จำนวนการประชุมมากที่สุดโดยไม่ทับกัน (ประชุมที่จบเวลา 10 กับที่เริ่ม 10 ไม่ทับกัน)\nตัวอย่าง: [[1,3],[2,4],[3,5],[0,7],[5,9],[8,10]] → 3',
 starter:'function maxMeetings(meetings) {\n  \n}',
 tests:[{args:[[[1,3],[2,4],[3,5],[0,7],[5,9],[8,10]]],expected:3},{args:[[]],expected:0},{args:[[[1,2],[2,3],[3,4]]],expected:3},{args:[[[1,10],[2,3],[4,5],[6,7]]],expected:3},{args:[[[1,5],[1,5],[1,5]]],expected:1},{args:[[[5,6],[1,2],[3,4],[0,10]]],expected:3}],
 hint:'เรียงตามเวลาจบจากน้อยไปมาก แล้วเลือกการประชุมที่เริ่ม >= เวลาจบของตัวที่เลือกล่าสุด (เลือกตัวที่จบเร็วที่สุดเสมอ)',
 sol:'function maxMeetings(meetings) {\n  const sorted = meetings.slice().sort((a, b) => a[1] - b[1]);\n  let count = 0, lastEnd = -Infinity;\n  for (const [s, e] of sorted) if (s >= lastEnd) { count++; lastEnd = e; }\n  return count;\n}',
 cs:'public static int MaxMeetings(int[][] meetings)\n{\n    int count = 0; long lastEnd = long.MinValue;\n    foreach (var m in meetings.OrderBy(m => m[1]))\n        if (m[0] >= lastEnd) { count++; lastEnd = m[1]; }\n    return count;\n}',
 cx:'O(n log n)'},

{id:'p20',title:'Sliding Window Rate Limiter',pattern:'Queue / sliding window',lv:'I',fn:'rateLimit',
 desc:'API อนุญาตให้แต่ละ client เรียกได้ไม่เกิน limit ครั้ง ภายในหน้าต่าง windowMs มิลลิวินาที (นับย้อนหลังจากเวลาปัจจุบัน: เวลา t อยู่ในหน้าต่างของ now ถ้า now - t < windowMs)\nrequests = [[timestampMs, clientId], ...] เรียงตามเวลาแล้ว คืน array ของ true/false ว่าแต่ละ request ได้รับอนุญาตหรือไม่ (request ที่ถูกปฏิเสธไม่นับรวมในโควตา)\nตัวอย่าง: limit 2, window 1000: [[0,"a"],[100,"a"],[200,"a"],[1000,"a"]] → [true,true,false,true]',
 starter:'function rateLimit(limit, windowMs, requests) {\n  \n}',
 tests:[{args:[2,1000,[[0,'a'],[100,'a'],[200,'a'],[1000,'a']]],expected:[true,true,false,true]},{args:[1,500,[[0,'a'],[0,'b'],[499,'a'],[500,'a']]],expected:[true,true,false,true]},{args:[3,1000,[]],expected:[]},{args:[2,100,[[0,'x'],[50,'x'],[99,'x'],[100,'x'],[149,'x'],[150,'x']]],expected:[true,true,false,true,false,true]}],
 hint:'เก็บ queue ของเวลาที่ "ได้รับอนุญาต" ต่อ client ก่อนตัดสิน ให้ดึงเวลาที่ now - t >= windowMs ออกจากหัว queue แล้วดูว่าจำนวนที่เหลือ < limit หรือไม่',
 sol:'function rateLimit(limit, windowMs, requests) {\n  const q = new Map(), out = [];\n  for (const [t, id] of requests) {\n    if (!q.has(id)) q.set(id, []);\n    const times = q.get(id);\n    while (times.length && t - times[0] >= windowMs) times.shift();\n    if (times.length < limit) { times.push(t); out.push(true); } else out.push(false);\n  }\n  return out;\n}',
 cs:'public static bool[] RateLimit(int limit, int windowMs, object[][] requests)\n{\n    var q = new Dictionary<string, Queue<long>>();\n    var res = new List<bool>();\n    foreach (var r in requests)\n    {\n        long t = Convert.ToInt64(r[0]); string id = (string)r[1];\n        if (!q.TryGetValue(id, out var times)) q[id] = times = new Queue<long>();\n        while (times.Count > 0 && t - times.Peek() >= windowMs) times.Dequeue();\n        if (times.Count < limit) { times.Enqueue(t); res.Add(true); } else res.Add(false);\n    }\n    return res.ToArray();\n}',
 cx:'O(n) รวม (แต่ละเวลาเข้า/ออก queue ครั้งเดียว)'},

{id:'p21',title:'Sliding Window Maximum',pattern:'Monotonic deque',lv:'A',fn:'maxSlidingWindow',
 desc:'คืนค่าสูงสุดของทุกหน้าต่างขนาด k ที่เลื่อนจากซ้ายไปขวา\nข้อจำกัด: n สูงสุด 200,000 และ k สูงสุด n — วิธี O(n·k) จะไม่ผ่าน performance test\nตัวอย่าง: nums=[1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7]',
 starter:'function maxSlidingWindow(nums, k) {\n  \n}',
 tests:[{args:[[1,3,-1,-3,5,3,6,7],3],expected:[3,3,5,5,6,7]},{args:[[1],1],expected:[1]},{args:[[9,8,7,6],2],expected:[9,8,7]},{args:[[1,2,3,4],4],expected:[4]},{args:[[4,4,4],2],expected:[4,4]},{n:'Performance: n = 200,000, k = 50,000',gen:'slide-big',maxMs:800}],
 hint:'เก็บ "index" ใน deque ให้ค่าลดลงจากหัวไปท้าย: ก่อนใส่ i ให้เอาตัวท้ายที่ค่าน้อยกว่า/เท่ากับ nums[i] ออก และเอาหัวที่หลุดหน้าต่างออก หัว deque คือค่าสูงสุด',
 sol:'function maxSlidingWindow(nums, k) {\n  const dq = new Array(nums.length); let head = 0, tail = 0;\n  const out = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (tail > head && nums[dq[tail - 1]] <= nums[i]) tail--;\n    dq[tail++] = i;\n    if (dq[head] <= i - k) head++;\n    if (i >= k - 1) out.push(nums[dq[head]]);\n  }\n  return out;\n}',
 cs:'public static int[] MaxSlidingWindow(int[] nums, int k)\n{\n    var dq = new LinkedList<int>();   // เก็บ index ค่าลดลงจากหัวไปท้าย\n    var res = new List<int>();\n    for (int i = 0; i < nums.Length; i++)\n    {\n        while (dq.Count > 0 && nums[dq.Last!.Value] <= nums[i]) dq.RemoveLast();\n        dq.AddLast(i);\n        if (dq.First!.Value <= i - k) dq.RemoveFirst();\n        if (i >= k - 1) res.Add(nums[dq.First.Value]);\n    }\n    return res.ToArray();\n}',
 cx:'O(n)'}
);
Object.assign(GEN, {
  'mergek-big': () => {
    const r = lcg(777), arrays = [];
    for (let k = 0; k < 2000; k++) { const a = []; let v = Math.floor(r() * 1000); for (let i = 0; i < 100; i++) { v += Math.floor(r() * 50); a.push(v); } arrays.push(a); }
    return [arrays];
  },
  'lis-big': () => { const r = lcg(31337), a = []; for (let i = 0; i < 100000; i++) a.push(Math.floor(r() * 1e9)); return [a]; },
  'slide-big': () => { const r = lcg(2024), a = []; for (let i = 0; i < 200000; i++) a.push(Math.floor(r() * 2e9) - 1e9); return [a, 50000]; }
});
