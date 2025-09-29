import { Ref } from 'vue';
type ContentEditableAction = () => void;
export declare function useContentEditable(targetRef: Ref<HTMLElement | null>): {
    selectAll: ContentEditableAction;
    deselectAll: ContentEditableAction;
    moveToStart: ContentEditableAction;
    moveToEnd: ContentEditableAction;
    focusElement: ContentEditableAction;
    blurElement: ContentEditableAction;
    insertNewLine: ContentEditableAction;
};
export {};
