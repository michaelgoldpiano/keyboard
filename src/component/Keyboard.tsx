import React, { useRef, useState, useEffect } from "react";
import Key, { KeyName, KeyColor } from "./Key";


/**
 * Component for rendering a piano keyboard.
 * 
 * @returns {JSX.Element} Full piano keyboard.
 */
export default function Keyboard(): JSX.Element {
    const ac = useRef<AudioContext>(new AudioContext());
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    /* Setup keyboard layout */
    const totalWidth: number = 1248;
    const totalHeight: number = 153;

    /**
     * Generates static properties for all Keys.
     * 
     * @returns {any} Properties for all Keys.
     */
    function generateKeyProps() {
        const props = []
        const numKeys = 88;

        const whiteWidth: number = 24;
        const whiteHeight: number = 153;
        const blackWidth: number = 14;
        const blackHeight: number = 102;
        const octaveWidth: number = whiteWidth * 7;
        const notes = [
            (n: number) => {return {name: KeyName.A,       color: KeyColor.WHITE, size: {left: (n * octaveWidth),                         top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.A_SHARP, color: KeyColor.BLACK, size: {left: (n * octaveWidth) + (blackWidth * 1) + 7,  top: 0, width: blackWidth, height: blackHeight, zIndex: 1}}},
            (n: number) => {return {name: KeyName.B,       color: KeyColor.WHITE, size: {left: (n * octaveWidth) + (whiteWidth * 1),      top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.C,       color: KeyColor.WHITE, size: {left: (n * octaveWidth) + (whiteWidth * 2),      top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.C_SHARP, color: KeyColor.BLACK, size: {left: (n * octaveWidth) + (blackWidth * 4) + 7,  top: 0, width: blackWidth, height: blackHeight, zIndex: 1}}},
            (n: number) => {return {name: KeyName.D,       color: KeyColor.WHITE, size: {left: (n * octaveWidth) + (whiteWidth * 3),      top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.D_SHARP, color: KeyColor.BLACK, size: {left: (n * octaveWidth) + (blackWidth * 6) + 7,  top: 0, width: blackWidth, height: blackHeight, zIndex: 1}}},
            (n: number) => {return {name: KeyName.E,       color: KeyColor.WHITE, size: {left: (n * octaveWidth) + (whiteWidth * 4),      top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.F,       color: KeyColor.WHITE, size: {left: (n * octaveWidth) + (whiteWidth * 5),      top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.F_SHARP, color: KeyColor.BLACK, size: {left: (n * octaveWidth) + (blackWidth * 9) + 7,  top: 0, width: blackWidth, height: blackHeight, zIndex: 1}}},
            (n: number) => {return {name: KeyName.G,       color: KeyColor.WHITE, size: {left: (n * octaveWidth) + (whiteWidth * 6),      top: 0, width: whiteWidth, height: whiteHeight, zIndex: 0}}},
            (n: number) => {return {name: KeyName.G_SHARP, color: KeyColor.BLACK, size: {left: (n * octaveWidth) + (blackWidth * 11) + 7, top: 0, width: blackWidth, height: blackHeight, zIndex: 1}}},
        ];

        for (let i = 0; i < numKeys; i++) {
            const frequency: number = 27.5 * (Math.pow(Math.pow(2, 1 / 12), i));
            const octaveNum: number = Math.floor(i / 12);
            const noteProps = notes[i % 12](octaveNum);

            const currProp = {
                ...noteProps,
                frequency: frequency,
                ac: ac.current,
                key: i,
            };
            props.push(currProp);
        }

        return props;
    }

    /**
     * Handles mousedown events.
     * 
     * @param {MouseEvent | React.MouseEvent} e
     */
    function onMouseDown(e: MouseEvent | React.MouseEvent): void {
        e.preventDefault();
        setIsMouseDown(true)
    }

    /**
     * Handles mouseup events.
     * 
     * @param {MouseEvent | React.MouseEvent} e
     */
    function onMouseUp(e: MouseEvent | React.MouseEvent): void {
        e.preventDefault();
        setIsMouseDown(false);
    }

    /**
     * Handle mouseup events anywhere on screen.
     */
    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    /* Save static properties between rerenders */
    const keyProps = useRef(generateKeyProps());
    
    return (
        <div
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={{
                width: totalWidth,
                height: totalHeight,
            }}
        >
            {keyProps.current.map((prop) => (
                <Key {...prop} isMouseDown={isMouseDown} />
            ))}
        </div>
    );
}