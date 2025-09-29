import { PromptsItemsProps, PromptsProps } from './types';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        title?(_: {}): any;
        icon?(_: {
            item: PromptsItemsProps;
        }): any;
        label?(_: {
            item: PromptsItemsProps;
        }): any;
        description?(_: {
            item: PromptsItemsProps;
        }): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<PromptsProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    itemClick: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<PromptsProps> & Readonly<{
    onItemClick?: ((...args: any[]) => any) | undefined;
}>, {
    style: import('vue').CSSProperties;
    title: string;
    wrap: boolean;
    vertical: boolean;
    items: PromptsItemsProps[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
