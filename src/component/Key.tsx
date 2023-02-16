import React, { useEffect, useRef, useState } from "react";


export enum KeyName {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
    G = "G",
    A_SHARP = "A#",
    B_SHARP = "B#",
    C_SHARP = "C#",
    D_SHARP = "D#",
    E_SHARP = "E#",
    F_SHARP = "F#",
    G_SHARP = "G#",
    A_FLAT = "Ab",
    B_FLAT = "Bb",
    C_FLAT = "Cb",
    D_FLAT = "Db",
    E_FLAT = "Eb",
    F_FLAT = "Fb",
    G_FLAT = "Gb",
};

export enum KeyColor {
    WHITE = "#FFF",
    BLACK = "#000",
    PEARL = "#CCCCCC",
    PINK = "#FF9999",
    RED = "#FF6666",
};

export interface KeySize {
    left: string,
    top: string,
    width: string,
    height: string,
    zIndex: number,
};

interface Props {
    name: KeyName,
    frequency: number,
    color: KeyColor,
    size: KeySize,
    ac: AudioContext,
    isMouseDown: boolean,
};


/**
 * Component for rendering a single piano key.
 * 
 * @param {Props} props Properties.
 * @returns {JSX.Element} A single piano key.
 */
export default function Key({name, frequency, color, size, ac, isMouseDown}: Props): JSX.Element {
    const oscillatorNode = useRef<OscillatorNode | null>(null);
    const gainNode = useRef<GainNode | null>(null);
    const isPlaying = useRef<boolean>(false);
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

    /**
     * Handles mouseover events.
     * 
     * @param {MouseEvent | React.MouseEvent} e
     */
    function onMouseOver(e: MouseEvent | React.MouseEvent): void {
        e.preventDefault();
        setIsMouseOver(true);
    }

    /**
     * Handles mouseout events.
     * 
     * @param {MouseEvent | React.MouseEvent} e
     */
    function onMouseOut(e: MouseEvent | React.MouseEvent): void {
        e.preventDefault();
        setIsMouseOver(false);
    }

    /* HTML */
    const divs = {
        default: (
            <div
                onMouseOver={onMouseOver}
                style={{
                    ...size,
                    backgroundColor: color,
                    border: "1px solid " + KeyColor.BLACK,
                    borderRadius: "3px",
                    position: "absolute",
                }}
            />
        ),
        clicked: (
            <div
                onMouseOut={onMouseOut}
                style={{
                    ...size,
                    backgroundColor: KeyColor.RED,
                    border: "1px solid " + KeyColor.BLACK,
                    borderRadius: "3px",
                    position: "absolute",
                }}
            />
        ),
        hovered: (
            <div
                onMouseOut={onMouseOut}
                style={{
                    ...size,
                    backgroundColor: KeyColor.PINK,
                    border: "1px solid " + KeyColor.BLACK,
                    borderRadius: "3px",
                    position: "absolute",
                }}
            />
        ),
    };

    /**
     * Plays audio for this note using the Web Audio API.
     */
    function playNote(): void {
        if (gainNode.current !== null || oscillatorNode.current !== null) {
            return;
        }
        const attackDuration = .002;
        const decayDuration = .25;
        const sustainLevel = .03;

        // const imag: Float32Array = new Float32Array([0, 0, 1, 0, 1]);
        // const real: Float32Array = new Float32Array(imag.length);
        // const real: number[] = [
        //     0, 0, -0.203569, 0.5, -0.401676, 0.137128, -0.104117, 0.115965,
        //     -0.004413, 0.067884, -0.00888, 0.0793, -0.038756, 0.011882, -0.030883, 0.027608,
        //     -0.013429, 0.00393, -0.014029, 0.00972, -0.007653, 0.007866, -0.032029, 0.046127,
        //     -0.024155, 0.023095, -0.005522, 0.004511, -0.003593, 0.011248, -0.004919, 0.008505,
        // ];
        // const imag: number[] = [
        //     0, 0.147621, 0, 0.000007, -0.00001, 0.000005, -0.000006, 0.000009,
        //     0, 0.000008, -0.000001, 0.000014, -0.000008, 0.000003, -0.000009, 0.000009,
        //     -0.000005, 0.000002, -0.000007, 0.000005, -0.000005, 0.000005, -0.000023, 0.000037,
        //     -0.000021, 0.000022, -0.000006, 0.000005, -0.000004, 0.000014, -0.000007, 0.000012,
        // ];
        // const waveform = ac.createPeriodicWave(real, imag);
        oscillatorNode.current = ac.createOscillator();
        gainNode.current = ac.createGain();

        gainNode.current.connect(ac.destination);
        gainNode.current.gain.setValueAtTime(0, ac.currentTime);
        gainNode.current.gain.linearRampToValueAtTime(1.0, ac.currentTime + attackDuration);
        gainNode.current.gain.setTargetAtTime(sustainLevel, ac.currentTime + attackDuration, decayDuration);
    
        oscillatorNode.current.connect(gainNode.current);
        oscillatorNode.current.type = "triangle";
        // oscillatorNode.current.setPeriodicWave(waveform);
        oscillatorNode.current.frequency.value = frequency;
        oscillatorNode.current.start();
    };

    /**
     * Stops audio for this note using the Web Audio API.
     */
    function stopNote(): void {
        if (gainNode.current === null || oscillatorNode.current === null) {
            return;
        }

        const releaseDuration = .12;
        gainNode.current.gain.cancelScheduledValues(ac.currentTime);
        gainNode.current.gain.setValueAtTime(gainNode.current.gain.value, ac.currentTime);
        gainNode.current.gain.linearRampToValueAtTime(0, ac.currentTime + releaseDuration);
    
        oscillatorNode.current.stop(ac.currentTime + releaseDuration + 1);

        gainNode.current = null;
        oscillatorNode.current = null;
    };

    /**
     * Handle mouseout events anywhere on screen.
     */
    useEffect(() => {
        window.addEventListener("mouseout", onMouseOut);
        return () => {
            window.removeEventListener("mouseout", onMouseOut);
        };
    }, []);

    // TODO: Use mutex around block (only start/stop note once)
    if (isMouseOver) {
        /* Clicked */
        if (isMouseDown) {
            if (!isPlaying.current) {
                isPlaying.current = true;
                playNote();
            }
            return divs.clicked;
        
        /* Hovered */
        } else {
            if (isPlaying.current) {
                isPlaying.current = false;
                stopNote();
            }
            return divs.hovered;
        }
    
    /* Default */
    } else {
        if (isPlaying.current) {
            isPlaying.current = false;
            stopNote();
        }
        return divs.default;
    }
}