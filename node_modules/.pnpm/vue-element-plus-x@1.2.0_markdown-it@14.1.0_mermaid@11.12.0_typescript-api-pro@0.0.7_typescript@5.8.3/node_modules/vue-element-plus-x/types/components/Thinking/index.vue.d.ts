import { ThinkingProps, ThinkingStatus } from './types.d.ts';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        'status-icon'?(_: {
            status: ThinkingStatus;
        }): any;
        label?(_: {
            status: ThinkingStatus;
        }): any;
        arrow?(_: {}): any;
        content?(_: {
            content: string;
        }): any;
        error?(_: {
            errorContent: string;
        }): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<ThinkingProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: {
        value: boolean;
        status: ThinkingStatus;
    }) => any;
    "update:expanded": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<ThinkingProps> & Readonly<{
    onChange?: ((value: {
        value: boolean;
        status: ThinkingStatus;
    }) => any) | undefined;
    "onUpdate:expanded"?: ((value: boolean) => any) | undefined;
}>, {
    maxWidth: string;
    status: ThinkingStatus;
    color: string;
    content: string;
    disabled: boolean;
    duration: string;
    backgroundColor: string;
    modelValue: boolean;
    autoCollapse: boolean;
    buttonWidth: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
