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
