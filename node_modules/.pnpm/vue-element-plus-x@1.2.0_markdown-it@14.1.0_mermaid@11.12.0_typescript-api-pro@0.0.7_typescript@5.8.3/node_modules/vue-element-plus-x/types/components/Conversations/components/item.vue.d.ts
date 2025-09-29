import { Component, CSSProperties } from 'vue';
import { ConversationItem, ConversationMenu, ConversationMenuCommand } from '../types';
interface Props {
    item: ConversationItem;
    itemsStyle?: CSSProperties;
    itemsHoverStyle?: CSSProperties;
    itemsActiveStyle?: CSSProperties;
    itemsMenuOpenedStyle?: CSSProperties;
    prefixIcon?: Component | null;
    suffixIcon?: Component | null;
    showTooltip?: boolean;
    labelMaxWidth?: number;
    menu?: ConversationMenu[];
    showBuiltInMenu?: boolean;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
    tooltipOffset?: number;
    menuPlacement?: 'top' | 'bottom' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
    menuOffset?: number;
    menuMaxHeight?: number;
    menuStyle?: CSSProperties;
    menuShowArrow?: boolean;
    menuClassName?: string;
    menuTeleported?: boolean;
    active?: boolean;
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: Readonly<Record<string, any>> & Record<string, any>;
    refs: {
        menuButtonRef: HTMLDivElement;
    };
    rootEl: HTMLLIElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    click: (key: string) => any;
    menuCommand: (command: ConversationMenuCommand, item: ConversationItem) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((key: string) => any) | undefined;
    onMenuCommand?: ((command: ConversationMenuCommand, item: ConversationItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    menuButtonRef: HTMLDivElement;
}, HTMLLIElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
