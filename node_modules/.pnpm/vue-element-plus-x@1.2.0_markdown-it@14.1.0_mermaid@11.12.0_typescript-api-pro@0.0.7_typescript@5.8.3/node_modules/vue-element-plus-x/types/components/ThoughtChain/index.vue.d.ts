import { DefaultThoughtChainItemProps, ThoughtChainProps } from './types.d.ts';
declare const _default: <T = DefaultThoughtChainItemProps>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onHandleExpand?: ((value: string[]) => any) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, "onHandleExpand"> & ThoughtChainProps<T> & Partial<{}>> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: {
        icon?(_: {
            item: import('./types.d.ts').ThoughtChainItemProps<T>;
        }): any;
    };
    emit: (evt: "handleExpand", value: string[]) => void;
}>) => import('vue').VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
