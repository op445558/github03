class LoadingComponent {
    constructor(options) {
        this.loading = options.loading || false;
        this.size = options.size || 100;
        this.startDeg = options.startDeg !== undefined ? options.startDeg : -0.5; // Start from the top middle
        this.endDeg = options.endDeg !== undefined ? options.endDeg : 1.5; // Adjust end angle as needed
        this.outColor = options.outColor || "#dbdbdb";
        this.innerLineDash = options.innerLineDash || false;
        this.counterclockwise = options.counterclockwise || false; // Make it clockwise for natural progression
        this.slider = options.slider || 10;
        this.padding = options.padding || 20;
        this.textShow = options.textShow || true;
        this.showDrag = options.showDrag || true;

        this.devicePixelRatio = window.devicePixelRatio;
        this.percent = 0;
        this.maxPercent = 99;
        this.targetPercent = 100;
        this.totalTime = 3000;
        this.stepTime = 20;
        this.el = document.getElementById("loading");
        this.el.style.transform = `scale(${1 / this.devicePixelRatio})`;
        this.el.style.width = `${this.size * this.devicePixelRatio}px`;
        this.el.style.height = `${this.size * this.devicePixelRatio}px`;
        this.width = this.size;
        this.height = this.size;
        this.center = this.width / 2;
        this.radius = this.width / 2 - this.padding;
        this.residueDeg = 2 - this.startDeg;
        this.isDown = false;
        this.ctx = null;
        this.ctx2 = null;
        this.canvas = null;
        this.canvas2 = null;
        this.P = null;

        this.initCanvas(this.el);
        this.draw(this.percent);
        this.loadingInterval = setInterval(
            this.updatePercent.bind(this),
            this.stepTime
        );

        if (!this.loading) {
            clearInterval(this.loadingInterval);
            this.animateToTargetPercent();
        }
    }

    get stepPercent() {
        return (
            (this.targetPercent - this.percent) / (this.totalTime / this.stepTime)
        );
    }

    updatePercent() {
        this.percent += this.stepPercent;
        if (this.percent >= this.maxPercent) {
            clearInterval(this.loadingInterval);
        }
        this.draw(this.percent);
    }

    animateToTargetPercent() {
        const remainingTime = 300;
        const remainingStepTime =
            remainingTime / (this.targetPercent - this.percent);
        const remainingStepPercent =
            ((this.targetPercent - this.percent) * 10) / remainingTime;
        this.remainingInterval = setInterval(() => {
            this.percent += remainingStepPercent;
            if (this.percent >= this.targetPercent) {
                clearInterval(this.remainingInterval);
            }
            this.draw(this.percent);
        }, remainingStepTime);
    }

    complete() {
        clearInterval(this.loadingInterval);
        clearInterval(this.remainingInterval);

        const duration = 500; // 1 second
        const steps = duration / this.stepTime;
        const stepPercent = (100 - this.percent) / steps;

        this.remainingInterval = setInterval(() => {
            this.percent += stepPercent;
            if (this.percent >= 100) {
                this.percent = 100;
                clearInterval(this.remainingInterval);
            }
            this.draw(this.percent);
        }, this.stepTime);
    }

    initCanvas(dom) {
        const scaleFactor = this.devicePixelRatio;
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "dragArc");
        this.canvas.width = this.width * scaleFactor;
        this.canvas.height = this.width * scaleFactor;
        dom.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(scaleFactor, scaleFactor);

        let startDeg = this.counterclockwise ?
            Math.PI * (2 - this.startDeg) :
            Math.PI * this.startDeg;
        let endDeg = this.counterclockwise ?
            Math.PI * (2 - this.endDeg) :
            Math.PI * this.endDeg;

        this.ctx.beginPath();
        this.innerLineDash && this.ctx.setLineDash([1, 0]);
        this.ctx.arc(
            this.center,
            this.center,
            this.radius,
            startDeg,
            endDeg,
            this.counterclockwise
        );
        this.ctx.strokeStyle = this.outColor;
        this.ctx.lineCap = "butt";
        this.ctx.lineWidth =
            (this.size - this.padding * 2) * 0.052 -
            (this.size - this.padding * 2) * 0.014;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(
            this.center,
            this.center,
            this.radius * 0.74,
            startDeg,
            endDeg,
            this.counterclockwise
        );
        // this.ctx.fillStyle = this.getPropertyThemeColorValue();
        // this.ctx.fill();
        // this.ctx.strokeStyle = this.getPropertyThemeColorValue();
        // this.ctx.lineWidth = 2;
        // this.ctx.stroke();

        const image = new Image();
        image.src = `data:image/png;base64,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`;
        image.onload = () => {
            const imageWidth = this.radius + 10;
            const imageHeight = this.radius + 10;
            const imageX = this.center - imageWidth / 2;
            const imageY = this.center - imageHeight / 2;
            this.ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
        };

        this.canvas2 = document.createElement("canvas");
        this.canvas2.setAttribute("id", "dragArc2");
        this.canvas2.width = this.width * scaleFactor;
        this.canvas2.height = this.width * scaleFactor;
        dom.appendChild(this.canvas);
        this.canvas2.style.position = "absolute";
        this.canvas2.style.left = 0;
        this.canvas2.style.top = 0;
        dom.appendChild(this.canvas2);
        this.ctx2 = this.canvas2.getContext("2d");
        this.ctx2.scale(scaleFactor, scaleFactor);
    }

    draw(value) {
        if (value > 100) value = 100;
        this.ctx2.clearRect(0, 0, this.width, this.width);
        this.ctx2.save();
        let startDeg = this.counterclockwise ?
            Math.PI * (2 - this.startDeg) :
            Math.PI * this.startDeg;
        let Deg = this.valToDeg(value);
        if (!this.showDrag) return;

        this.ctx2.beginPath();
        this.ctx2.arc(
            this.center,
            this.center,
            this.radius -
            ((this.size - this.padding * 2) * 0.052 -
                (this.size - this.padding * 2) * 0.014),
            startDeg,
            Deg,
            this.counterclockwise
        );
        this.ctx2.strokeStyle = this.getPropertyThemeColorValue();
        this.ctx2.lineCap = "butt";
        this.ctx2.lineWidth =
            (this.size - this.padding * 2) * 0.052 -
            (this.size - this.padding * 2) * 0.014;
        this.ctx2.stroke();

        if (!this.textShow) return;
        this.P = this.degToXY(Deg);
        const radius = this.slider;
        const angle = this.valToDeg(value);
        const textX = this.P.x + Math.cos(angle) * radius;
        const textY = this.P.y + Math.sin(angle) * radius;

        this.ctx2.font = `700 ${this.center / 5}px arial`;
        this.ctx2.fillStyle = this.getPropertyThemeColorValue();
        this.ctx2.textAlign = "center";
        this.ctx2.textBaseline = "middle";
        this.ctx2.translate(textX, textY);
        this.ctx2.rotate(angle + Math.PI / 2);
        this.ctx2.fillText(Math.floor(value) + "%", 0, 0);
        this.ctx2.rotate(-angle - Math.PI / 2);
        this.ctx2.translate(-textX, -textY);
        this.ctx.fillStyle = this.getPropertyThemeColorValue();
        this.el.style.transform = `scale(${1 / this.devicePixelRatio})`;
    }

    valToDeg(v) {
        let range = this.endDeg - this.startDeg;
        let val = (range / 100) * v;
        if (this.counterclockwise && val != 0) val = 2 - val;
        let startDeg = this.counterclockwise ? 2 - this.startDeg : this.startDeg;
        return (startDeg + val) * Math.PI;
    }

    degToXY(deg) {
        let d = 2 * Math.PI - deg;
        return this.respotchangeXY({
            x: this.radius * Math.cos(d),
            y: this.radius * Math.sin(d),
        });
    }

    respotchangeXY(point) {
        const spotchangeX = (i) => {
            return i + this.center;
        };
        const spotchangeY = (i) => {
            return this.center - i;
        };
        return {
            x: spotchangeX(point.x),
            y: spotchangeY(point.y),
        };
    }

    getPropertyThemeColorValue() {
        // var themeColor = getComputedStyle(
        //   document.documentElement
        // ).getPropertyValue("--theme-color");
        // return themeColor ? themeColor : "#0637A1";
        return "#0087b4";
    }
}

window.LoadingComponent = LoadingComponent;