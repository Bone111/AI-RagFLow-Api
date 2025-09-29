export type SSEFields = 'data' | 'event' | 'id' | 'retry';
export type SSEOutput = Partial<Record<SSEFields, any>>;
export interface XStreamOptions<Output = SSEOutput> {
    readableStream: ReadableStream<Uint8Array>;
    transformStream?: TransformStream<string, Output>;
}
export declare function useXStream(): {
    startStream: (options: XStreamOptions<SSEOutput>) => Promise<void>;
    cancel: () => void;
    data: globalThis.Ref<{
        data?: any;
        id?: any;
        event?: any;
        retry?: any;
    }[], Partial<Record<SSEFields, any>>[] | {
        data?: any;
        id?: any;
        event?: any;
        retry?: any;
    }[]>;
    error: globalThis.Ref<Error | null, Error | null>;
    isLoading: globalThis.Ref<boolean, boolean>;
};
