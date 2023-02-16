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
        const props = [];
        const numKeys: number = 88;

        const whitePixelWidth: number = 24;
        const whitePixelHeight: number = 153;
        const blackPixelWidth: number = 14;
        const blackPixelHeight: number = 102;
        const octavePixelWidth: number = whitePixelWidth * 7;
        const octavePixelHeight: number = whitePixelHeight;

        const pixelPercentWidth: number = 100 / octavePixelWidth / ((numKeys + 1) / 12);
        const pixelPercentHeight: number = 100 / octavePixelHeight;

        const whitePercentWidth: number = pixelPercentWidth * whitePixelWidth;
        const whitePercentHeight: number = pixelPercentHeight * whitePixelHeight;
        const blackPercentWidth: number = pixelPercentWidth * blackPixelWidth;
        const blackPercentHeight: number = pixelPercentHeight * blackPixelHeight;
        const blackPercentWidthOffset: number = pixelPercentWidth * 7;
        const octavePercentWidth: number = whitePercentWidth * 7;

        const notes = [
            (register: number) => {return {name: KeyName.A,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 0)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.A_SHARP, color: KeyColor.BLACK, size: {left: (register * octavePercentWidth) + (blackPercentWidth * 1)  + blackPercentWidthOffset + "%", top: "0%", width: blackPercentWidth + "%", height: blackPercentHeight + "%", zIndex: 1}}},
            (register: number) => {return {name: KeyName.B,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 1)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.C,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 2)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.C_SHARP, color: KeyColor.BLACK, size: {left: (register * octavePercentWidth) + (blackPercentWidth * 4)  + blackPercentWidthOffset + "%", top: "0%", width: blackPercentWidth + "%", height: blackPercentHeight + "%", zIndex: 1}}},
            (register: number) => {return {name: KeyName.D,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 3)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.D_SHARP, color: KeyColor.BLACK, size: {left: (register * octavePercentWidth) + (blackPercentWidth * 6)  + blackPercentWidthOffset + "%", top: "0%", width: blackPercentWidth + "%", height: blackPercentHeight + "%", zIndex: 1}}},
            (register: number) => {return {name: KeyName.E,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 4)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.F,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 5)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.F_SHARP, color: KeyColor.BLACK, size: {left: (register * octavePercentWidth) + (blackPercentWidth * 9)  + blackPercentWidthOffset + "%", top: "0%", width: blackPercentWidth + "%", height: blackPercentHeight + "%", zIndex: 1}}},
            (register: number) => {return {name: KeyName.G,       color: KeyColor.WHITE, size: {left: (register * octavePercentWidth) + (whitePercentWidth * 6)  + "%",                           top: "0%", width: whitePercentWidth + "%", height: whitePercentHeight + "%", zIndex: 0}}},
            (register: number) => {return {name: KeyName.G_SHARP, color: KeyColor.BLACK, size: {left: (register * octavePercentWidth) + (blackPercentWidth * 11) + blackPercentWidthOffset + "%", top: "0%", width: blackPercentWidth + "%", height: blackPercentHeight + "%", zIndex: 1}}},
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
                aspectRatio: totalWidth / totalHeight,
                // width: totalWidth,
                // height: totalHeight,
                position: "relative",
            }}
        >
            {keyProps.current.map((prop) => (
                <Key {...prop} isMouseDown={isMouseDown} />
            ))}
        </div>
    );
}