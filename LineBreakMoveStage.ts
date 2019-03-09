const w : number = window.innerWidth
const h : number = window.innerHeight
const nodes : number = 5
const lines : number = 2
const scGap : number = 0.05
const scDiv : number = 0.51
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "#673AB7"
const backColor : string = "#BDBDBD"

const scaleFactor : Function = (scale : number) : number => Math.floor(scale / scDiv)
const maxScale : Function = (scale : number, i : number, n : number) : number => Math.max(0, scale - i / n)
const divideScale : Function = (scale : number, i : number, n : number) : number => Math.min(1 / n, maxScale(scale, i, n)) * n
const mirrorValue : Function = (scale : number, a : number, b : number) : number => (1 - scaleFactor(scale)) / a + scaleFactor(scale) / b
const updateValue : Function = (scale : number, dir : number, a : number, b : number) => {
    return mirrorValue(scale, a, b) * dir * scGap
}

const drawLBMNode : Function = (context : CanvasRenderingContext2D, i : number, scale : number) => {
    const gap : number = h / (nodes + 1)
    const sc1 : number = divideScale(scale, 0, 2)
    const sc2 : number = divideScale(scale, 1, 2)
    const size : number = gap / sizeFactor
    context.strokeStyle = foreColor
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / strokeFactor
    context.save()
    context.translate(w / 2, gap * (i + 1))
    for (var j = 0; j < lines; j++) {
        const sf : number = 1 - 2 * j
        const sc1j : number = divideScale(scale, 0, 2)
        const sc2j : number = divideScale(scale, 1, 2)
        context.save()
        context.translate(w / 2 * sf * sc2j, 0)
        context.rotate(Math.PI/2 * sc1j)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(size * sf, 0)
        context.stroke()
        context.restore()
    }
    context.restore()
}

class LineBreakMoveStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : LineBreakMoveStage = new LineBreakMoveStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
