import { Canvas, FontLibrary } from './lib/index.mjs'


let canvas = new Canvas(400, 400)
const ctx = canvas.getContext("2d")
const { width, height } = canvas

FontLibrary.use('./STZHONGS.TTF')

// for (const color of ['orange', 'yellow', 'green', 'skyblue', 'purple']){
//   ctx = canvas.newPage()
//   ctx.fillStyle = color
//   ctx.fillRect(0,0, width, height)
//   ctx.fillStyle = 'white'
//   ctx.arc(width/2, height/2, 40, 0, 2 * Math.PI)
//   ctx.fill()
const text = "测试一下"
console.log(FontLibrary.family('STZhongsong'))
const font = "16pt STZhongsong"

ctx.font = font
ctx.fillText(text, 50, 50)
// ctx.strokeText(text, 50, 100)

ctx.lineWidth = 0.4
ctx.fillTextAndStroke(text, 50, 150)
// }

async function render() {
  // save to a multi-page PDF file
  await canvas.saveAs("all-pages.pdf")

  // save to files named `page-01.png`, `page-02.png`, etc.
  await canvas.saveAs("page-{2}.png")
}
render()
