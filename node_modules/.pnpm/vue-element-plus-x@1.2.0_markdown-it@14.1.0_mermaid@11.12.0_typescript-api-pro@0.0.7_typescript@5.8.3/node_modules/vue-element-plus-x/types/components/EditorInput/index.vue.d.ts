import { EditorInputProps } from './types.d.ts';
declare function focus(e: Event): void;
declare function blur(e: Event): void;
declare function select(): void;
declare function clear(): void;
declare const _default: import('vue').DefineComponent<EditorInputProps, {
    focus: typeof focus;
    blur: typeof blur;
    select: typeof select;
    clear: typeof clear;
    selectAll: () => void;
    moveToStart: () => void;
    moveToEnd: () => void;
    editableElement: globalThis.Ref<HTMLElement | null, HTMLElement | null>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    compositionend: (...args: any[]) => void;
    compositionstart: (...args: any[]) => void;
    keydown: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    handleBlur: (...args: any[]) => void;
    handleFocus: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<EditorInputProps> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    onCompositionend?: ((...args: any[]) => any) | undefined;
    onCompositionstart?: ((...args: any[]) => any) | undefined;
    onKeydown?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onHandleBlur?: ((...args: any[]) => any) | undefined;
    onHandleFocus?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: string;
    readOnly: boolean;
    placeholder: string;
    rows: number;
    autosize: boolean | {
        minRows?: number;
        maxRows?: number;
    };
    submitType: "enter" | "shiftEnter";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    editableElement: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
