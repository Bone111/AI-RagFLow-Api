import { BubbleProps } from '../Bubble/types';
import { BubbleListProps } from './types.d.ts';
declare const _default: <T extends BubbleProps>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onComplete?: ((...args: any[]) => any) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, "onComplete"> & BubbleListProps<T> & Partial<{}>> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{
        scrollToTop: () => void;
        scrollToBottom: () => void;
        scrollToBubble: (index: number) => void;
    }>): void;
    attrs: any;
    slots: {
        avatar?(_: {
            item: T;
        }): any;
        header?(_: {
            item: T;
        }): any;
        content?(_: {
            item: T;
        }): any;
        footer?(_: {
            item: T;
        }): any;
        loading?(_: {
            item: T;
        }): any;
        backToBottom?(_: {}): any;
    };
    emit: (event: "complete", ...args: any[]) => void;
}>) => import('vue').VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
