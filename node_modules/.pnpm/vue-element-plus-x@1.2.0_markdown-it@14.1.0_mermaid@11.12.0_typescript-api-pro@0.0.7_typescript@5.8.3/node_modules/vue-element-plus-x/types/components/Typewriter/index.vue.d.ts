import { ComputedRef } from 'vue';
import { TypewriterInstance, TypewriterProps, TypingConfig } from './types.d.ts';
declare const _default: import('vue').DefineComponent<TypewriterProps, {
    interrupt: () => void;
    continue: () => void;
    restart: () => void;
    destroy: () => void;
    renderedContent: ComputedRef<string>;
    isTyping: Ref<boolean>;
    progress: ComputedRef<number>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    start: (instance: TypewriterInstance) => any;
    writing: (instance: TypewriterInstance) => any;
    finish: (instance: TypewriterInstance) => any;
}, string, import('vue').PublicProps, Readonly<TypewriterProps> & Readonly<{
    onStart?: ((instance: TypewriterInstance) => any) | undefined;
    onWriting?: ((instance: TypewriterInstance) => any) | undefined;
    onFinish?: ((instance: TypewriterInstance) => any) | undefined;
}>, {
    content: string;
    isMarkdown: boolean;
    typing: boolean | TypingConfig;
    isFog: boolean | import('./types.d.ts').TypingFogfig;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    typeWriterRef: HTMLDivElement;
    markdownContentRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
