import { FilesCardProps } from '../FilesCard/types.d.ts';
import { FileListProps } from './types';
declare function onScrollLeft(): void;
declare function onScrollRight(): void;
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        'empty-upload'?(_: {}): any;
        'file-list'?(_: {
            items: FilesCardProps[];
        }): any;
        'no-empty-upload'?(_: {}): any;
        'prev-button'?(_: {
            show: boolean;
            onScrollLeft: typeof onScrollLeft;
        }): any;
        'next-button'?(_: {
            show: boolean;
            onScrollRight: typeof onScrollRight;
        }): any;
        'drop-area'?(_: {}): any;
    };
    refs: {
        wrapperRef: HTMLDivElement;
        containerRef: HTMLDivElement;
        dropAreaRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<FileListProps, {
    onScrollLeft: typeof onScrollLeft;
    onScrollRight: typeof onScrollRight;
    debouncedCheckPing: {
        (): void;
        cancel(): void;
        isPending(): boolean;
        flush(): void;
    };
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    uploadChange: (...args: any[]) => void;
    uploadSuccess: (...args: any[]) => void;
    uploadError: (...args: any[]) => void;
    uploadDrop: (...args: any[]) => void;
    deleteCard: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<FileListProps> & Readonly<{
    onUploadChange?: ((...args: any[]) => any) | undefined;
    onUploadSuccess?: ((...args: any[]) => any) | undefined;
    onUploadError?: ((...args: any[]) => any) | undefined;
    onUploadDrop?: ((...args: any[]) => any) | undefined;
    onDeleteCard?: ((...args: any[]) => any) | undefined;
}>, {
    items: FilesCardProps[];
    overflow: "scrollX" | "scrollY" | "wrap";
    listStyle: Record<string, string>;
    hideUpload: boolean;
    uploadIconSize: string;
    dragTarget: string | Ref<HTMLElement> | HTMLElement;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    wrapperRef: HTMLDivElement;
    containerRef: HTMLDivElement;
    dropAreaRef: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
