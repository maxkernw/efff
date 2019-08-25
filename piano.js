const keys = document.querySelectorAll(".key");
const hints = document.querySelectorAll(".hints");

let delayTime = 3;
let delayCurrentGain = 0.4;
let type = 'square';
let gain = .05;
let release = .3
playNote = (e) => {
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

    if (!key) return;

    const keyNote = key.getAttribute("data-note");


    play(keyNote)
    play(keyNote - 12)

}

removeTransition = (e) => {
    if (e.propertyName !== "transform") return;
    this.classList.remove("playing");
}

hintsOn = (e, index) => {
    e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}
let audioContext;

play = (num) => {
    const oscillator = audioContext.createOscillator()
    let startTime = audioContext.currentTime + delayTime
    let endTime = startTime + .3

    let input = audioContext.createGain()
    let envelope = audioContext.createGain()
    let merger = audioContext.createChannelMerger(2)
    let output = audioContext.createGain()

    let leftDelay = audioContext.createDelay()
    let rightDelay = audioContext.createDelay()
    let feedback = audioContext.createGain()
    let vibrato = audioContext.createGain()
    vibrato.gain.value = 30
    vibrato.connect(oscillator.detune)
    input.connect(feedback, 0)
    leftDelay.connect(rightDelay)
    rightDelay.connect(feedback)
    feedback.connect(leftDelay)
    merger.connect(output)
    input.connect(output)
    envelope.connect(audioContext.destination)
    output.connect(audioContext.destination)
    feedback.gain.value = delayCurrentGain;
    output.gain.value = gain;
    envelope.gain.value = 0
    envelope.gain.setTargetAtTime(1, startTime, 0.1)
    envelope.gain.setTargetAtTime(0, endTime, 0.5)
    leftDelay.connect(merger, 0, 0)
    rightDelay.connect(merger, 0, 1)

    leftDelay.delayTime.value = delayTime / 8
    rightDelay.delayTime.value = delayTime / 8
    oscillator.connect(envelope)
    oscillator.connect(input);

    oscillator.type = type
    oscillator.frequency.value = 440 * Math.pow(2, num / 12);

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + release)
}

hints.forEach(hintsOn);

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

window.addEventListener("keydown", playNote);
setType = (value) => {
    type = value;
}

window.onload = () => {
    audioContext = new AudioContext();
    const slider = document.querySelector(".slider");
    const delayGain = document.querySelector("#delayGain");
    const volumeSlider = document.querySelector("#volume");
    const releaseSlider = document.querySelector("#release");

    slider.oninput = (e) => {
        delayTime = e.srcElement.value / 100
    }

    delayGain.oninput = (e) => {
        delayCurrentGain = e.srcElement.value / 100

    }
    releaseSlider.oninput = (e) => {
        release = e.srcElement.value / 100

    }
    volumeSlider.oninput = (e) => {
        gain = e.srcElement.value / 1000

    }
}