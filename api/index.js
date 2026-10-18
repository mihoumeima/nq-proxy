// 网易云音乐 API 代理 (Vercel / 任意 Node 平台)
// 用法: https://<你的域名>/api?p=<url编码后的网易接口路径>
//   例: /api?p=%2Fapi%2Fuser%2Fplaylist%3Fuid%3D1560553416%26limit%3D30
// cookie 优先级: 环境变量 NQ_COOKIE > 内置 DEFAULT_COOKIE > ?cookie= 参数
const https = require('https');

const DEFAULT_COOKIE = 'MUSIC_U=00ABDAFF26195DD3FC735B5A22B7DCD5DB7A45C7A964AC084A166C24E689C3852BDD7ED4BD36C807CC3C0BECDF287095B5CD822F2F6D3DE67757BAE15D1C069A1DD932BC884A269B20F7C51C627C9734522F01C98567F9FD58BAC966AB3C454B3E0E7A91BCBBB9A177DEC56B727569BF27C3733054B8254B2196DA467324637134EABF35196EA1D4987748158F34A5B9949E059FDFF112D49CEC187419727CD6170793C9DD0A8B9D7EB2F05B4C6E3F387E2ED4AF649CAAF263327F875C7B44160D6A59B2F8F10BF2AA1545131A00744A7E9FBE37C9B56B2B577DBE04905256DCBD453776449993DB7BB55FE0072A35C76769CAC248C5D7B7005174E2AD526D87CDF6BF333C98C54218740F91181A3FB78FB0289ECABCAA6DF6EF916DB05B0E5B310DD75A5D27C4751E4890DF1ECF36C4B66E9A9F0524E3E4A7A195A367AD522603E23C4D1AE63CF485C7BE85396B2952AA26599C85C39DF0513C239CD02EB56E814FA8FECB1FF6940423FC323D65E9869E441249E63394C3D335D03AB9C49EB25DD51AD7FC4E4F7878B33599C69842A1ABB643D973BA515030DEED3DC613892677D522705C9404DE79786B6AC68B010D06671C7EC5A9C93CC6BD833F6CDF1462D2879672DFBD0F0FA5CCB0C424B9D46527; __csrf=7ff0f7fcdf9ac5472517c59a86119617';
const UA = 'Mozilla/5.0 (Linux; Android 15; PGZ110 Build/UKQ1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36 NeteaseMusic/9.5.50';
const UPSTREAM = 'music.163.com';

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.statusCode=200; res.end(); return; }

  const u = new URL(req.url, 'http://x');
  const p = u.searchParams.get('p') || '';
  const cookie = u.searchParams.get('cookie') || process.env.NQ_COOKIE || DEFAULT_COOKIE;

  if (!p.startsWith('/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode=400; res.end(JSON.stringify({ code: -1, message: 'missing ?p=/api/xxx' }));
    return;
  }

  const path = p + (p.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
  const options = {
    hostname: UPSTREAM,
    path: path,
    method: 'GET',
    headers: {
      'User-Agent': UA,
      'Referer': 'https://music.163.com/',
      'Accept': '*/*',
      'Cookie': cookie,
      'Cache-Control': 'no-cache'
    },
    timeout: 9000
  };

  const r = https.request(options, (up) => {
    let body = '';
    up.setEncoding('utf8');
    up.on('data', (d) => body += d);
    up.on('end', () => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.statusCode=200; res.end(body);
    });
  });
  r.on('error', (e) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode=502; res.end(JSON.stringify({ code: -2, message: String(e && e.message) }));
  });
  r.on('timeout', () => { r.destroy(); });
  r.end();
};
