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
    const sc1 : number = divideScale(scale, 0, lines)
    const sc2 : number = divideScale(scale, 1, lines)
    const size : number = gap / sizeFactor
    context.strokeStyle = foreColor
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / strokeFactor
    context.save()
    context.translate(w / 2, gap * (i + 1))
    for (var j = 0; j < lines; j++) {
        const sf : number = 1 - 2 * j
        const sc1j : number = divideScale(scale, j, lines)
        const sc2j : number = divideScale(scale, j, lines)
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
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
        }
    }

    static init() {
        const stage : LineBreakMoveStage = new LineBreakMoveStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += updateValue(this.scale, this.dir, lines, lines)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LBMNode {
    state : State = new State()
    prev : LBMNode
    next : LBMNode

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new LBMNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        drawLBMNode(context, this.i, this.state.scale)
        if (this.next) {
            this.next.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : LBMNode {
        var curr : LBMNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class LineBreakMover {
    root : LBMNode = new LBMNode(0)
    curr : LBMNode = this.root
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.root.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {
    lbm : LineBreakMover = new LineBreakMover()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.lbm.draw(context)
    }

    handleTap(cb : Function) {
        this.lbm.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.lbm.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
