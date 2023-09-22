const Koa = require('koa');
const {koaBody} = require('koa-body');
const session = require('koa-session');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const serve = require("koa-static");

const router = require('@koa/router')();



const app = new Koa();

app.use(session(app));
// app.use(koaBody());

router.get('/static/(.*)', serve("./"));
/**
 * route
 */

router.get('/get/:word', word);
router.get('/', (ctx)=>{
  return new Promise((resolve)=>{
    ctx.set('Content-Type', 'text/html');
    fs.readFile('./index.html', 'utf8', (error, data) => {
      ctx.set('Content-Type', 'text/html')
      ctx.body = data;
      resolve();
    })
  })
});

app.use(router.routes());
function word(ctx) {
  const getWords = ctx.params.word.split('').map((key)=>{
    return axios.get(`https://hanyu.baidu.com/s?wd=${encodeURIComponent(key)}&ptype=zici`).then(res=>{
      const $ = cheerio.load(res.data);
      const pinyin = $('#pinyin').html()?.trim();
      const wordStroke = $('.word-stroke .word-stroke-wrap').html()?.trim();
      return {
        name: key,
        pinyin,
        wordStroke
      }
    })
  });
  return Promise.all(getWords).then((data)=>{
    ctx.body = {
      word: ctx.params.word,
      data
    }
  })
}
app.listen(3000);
