const URL_DO_MODELO = "https://teachablemachine.withgoogle.com/models/2I554wBMF/";

let modelo, cameraWebcam, estaLigada = false;

document.getElementById("botao").addEventListener("click", function () {
    if (!estaLigada) {
        ligarCamera();
        this.textContent = "Desligar Câmera";
    } else {
        desligarCamera();
        this.textContent = "Ligar Câmera";
    }
    estaLigada = !estaLigada;
});

async function ligarCamera() {
    const urlModelo = URL_DO_MODELO + "model.json";
    const urlMetadados = URL_DO_MODELO + "metadata.json";

    modelo = await tmImage.load(urlModelo, urlMetadados);
    cameraWebcam = new tmImage.Webcam(600, 600, true);
    await cameraWebcam.setup();
    await cameraWebcam.play();
    document.getElementById("webcam").innerHTML = "";
    document.getElementById("webcam").appendChild(cameraWebcam.canvas);
    window.requestAnimationFrame(loop);
}

function desligarCamera() {
    if (cameraWebcam && cameraWebcam.stream) {
        cameraWebcam.stream.getTracks().forEach(pista => pista.stop());
    }
    document.getElementById("webcam").innerHTML = "Câmera desligada";
    document.body.style.backgroundColor = "";
}

async function loop() {
    if (!estaLigada) return;
    cameraWebcam.update();
    await prever();
    window.requestAnimationFrame(loop);
}

async function prever() {
    const previsoes = await modelo.predict(cameraWebcam.canvas);

    let maisProvavel = previsoes.reduce((a, b) => a.probability > b.probability ? a : b);

    if (maisProvavel.className === "Aberta" && maisProvavel.probability > 0.7) {
        document.body.style.backgroundColor = "#787";
    }
    else if (maisProvavel.className === "Fechada" && maisProvavel.probability > 0.7) {
        document.body.style.backgroundColor = "#000";
    }
}