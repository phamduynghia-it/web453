var streams = [];
var fadeInterval = 1.6;
var symbolSize = window.innerWidth < 600 ? 28 : 22;
var fixedMessage = "Happy Birthday";

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);

    var x = 0;
    for (var i = 0; i <= width / symbolSize; i++) {
        var stream = new Stream();
        stream.generateSymbols(x, random(-2000, 0));
        streams.push(stream);
        x += symbolSize;
    }

    textFont("Arial");
    textSize(symbolSize);

    let p5canvas = document.querySelector("canvas");
    if (p5canvas) p5canvas.id = "p5-canvas";
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    symbolSize = window.innerWidth < 600 ? 28 : 22;
    streams = [];
    var x = 0;
    for (var i = 0; i <= width / symbolSize; i++) {
        var stream = new Stream();
        stream.generateSymbols(x, random(-2000, 0));
        streams.push(stream);
        x += symbolSize;
    }
    textSize(symbolSize);
}

function draw() {
    background(0, 150);
    streams.forEach(function (stream) {
        stream.render();
    });
}

function Symbol(x, y, speed, first, opacity, value) {
    this.x = x;
    this.y = y;
    this.value = value;

    this.speed = speed;
    this.first = first;
    this.opacity = opacity;

    this.rain = function () {
        this.y = this.y >= height ? 0 : (this.y += this.speed);
    };
}

function Stream() {
    this.symbols = [];
    this.totalSymbols = round(random(10, 30)); // độ dài cột
    this.speed = random(4, 8); // chậm nhẹ nhàng

    this.generateSymbols = function (x, y) {
        var opacity = 255;
        var first = round(random(0, 4)) == 1;
        let messageIndex = 0;

        for (var i = 0; i <= this.totalSymbols; i++) {
            var char = fixedMessage.charAt(messageIndex);
            var symbol = new Symbol(x, y, this.speed, first, opacity, char);
            this.symbols.push(symbol);
            opacity -= 255 / this.totalSymbols / fadeInterval;

            // ✅ Hiển thị từ trên xuống
            y += symbolSize;

            messageIndex = (messageIndex + 1) % fixedMessage.length;
            first = false;
        }
    };

    this.render = function () {
        this.symbols.forEach(function (symbol) {
            fill(176, 128, 136, symbol.opacity);
            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
        });
    };
}
